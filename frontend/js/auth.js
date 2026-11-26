const registerForm = document.getElementById("registerForm");

if (registerForm) {

    
const accountType =
    document.getElementById("registerAccountType");

const citizenFields =
    document.getElementById("citizenFields");

const responderFields =
    document.getElementById("responderFields");

function updateRegistrationFields() {
    const isResponder =
        accountType.value === "responder";

    citizenFields.hidden = isResponder;
    responderFields.hidden = !isResponder;

    citizenFields.style.display =
        isResponder ? "none" : "block";

    responderFields.style.display =
        isResponder ? "block" : "none";

    citizenFields.querySelectorAll("input, select")
        .forEach(field => {
            field.disabled = isResponder;
            field.required = !isResponder;
        });

    responderFields.querySelectorAll("input, select")
        .forEach(field => {
            field.disabled = !isResponder;
            field.required = isResponder;
        });
}

accountType.addEventListener(
    "change",
    updateRegistrationFields
);

registerForm.addEventListener("reset", () => {
    setTimeout(updateRegistrationFields, 0);
});

updateRegistrationFields();


    
registerForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const value = id =>
        document.getElementById(id).value.trim();

    const name = value("registerName");
    const email = value("registerEmail").toLowerCase();
    const phone = value("registerPhone");
    const district = value("registerDistrict");
    const selectedType = value("registerAccountType");

    const password =
        document.getElementById("registerPassword").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;

    const message =
        document.getElementById("registerMessage");

    if (!registerForm.reportValidity()) return;

    if (!name || !email || !phone || !district) {
        setInterfaceText(message, "Please complete all required fields.");
        return;
    }

    if (password.length < 8) {
        setInterfaceText(message, "Use at least 8 characters.");
        return;
    }

    if (password !== confirmPassword) {
        setInterfaceText(message, "Passwords do not match.");
        return;
    }

    const users = readAccountRecords(USERS_KEY);

    // Prevent public administrator registration
    if (email === DEMO_ADMIN_EMAIL) {
        setInterfaceText(message, "This email is unavailable.");
        return;
    }

    // Prevent duplicate email addresses
    if (users.some(user =>
        sameAccountEmail(user.email, email)
    )) {
        setInterfaceText(
            message,
            "A prototype account with this email already exists."
        );
        return;
    }

    const newAccount = {
        id: crypto.randomUUID(),
        name,
        email,
        phone,
        district,
        password,
        role: "user",
        accountType: selectedType,
        createdAt: new Date().toISOString()
    };

    if (selectedType === "user") {
        const idType = value("citizenIdType");
        const idNumber = value("citizenIdNumber").toUpperCase();

        if (!/^DEMO-[A-Z0-9-]+$/.test(idNumber)) {
            message.textContent =
                "Use a fictional ID beginning with DEMO-.";
            return;
        }

        const duplicateId = users.some(user =>
            user.citizenIdType === idType &&
            user.citizenIdNumber === idNumber
        );

        if (duplicateId) {
            message.textContent =
                "This identification number is already registered.";
            return;
        }

        newAccount.citizenIdType = idType;
        newAccount.citizenIdNumber = idNumber;
        newAccount.verificationStatus = "Not Required";

    } else if (selectedType === "responder") {

        const organization = value("responderOrganization");
        const organizationType = value("responderOrgType");
        const position = value("responderPosition");
        const credentialType = value("responderCredentialType");

        const credentialNumber =
            value("responderCredentialNumber").toUpperCase();

        if (
            !organization ||
            !organizationType ||
            !position ||
            !credentialType ||
            !credentialNumber
        ) {
            message.textContent =
                "Please complete all professional information.";
            return;
        }

        if (!/^DEMO-[A-Z0-9-]+$/.test(credentialNumber)) {
            message.textContent =
                "Use a fictional credential beginning with DEMO-.";
            return;
        }

        const duplicateCredential = users.some(user =>
            (user.organization || "").toLowerCase() ===
                organization.toLowerCase() &&
            user.credentialType === credentialType &&
            user.credentialNumber === credentialNumber
        );

        if (duplicateCredential) {
            message.textContent =
                "This responder credential is already registered.";
            return;
        }

        newAccount.organization = organization;
        newAccount.organizationType = organizationType;
        newAccount.position = position;
        newAccount.credentialType = credentialType;
        newAccount.credentialNumber = credentialNumber;
        newAccount.verificationStatus = "Pending";

        // Responder privileges remain restricted
        // until an administrator approves the account.
        newAccount.role = "user";

    } else {
        message.textContent = "Invalid account type.";
        return;
    }

    try {
        users.push(newAccount);

        localStorage.setItem(
            USERS_KEY,
            JSON.stringify(users)
        );

    } catch (error) {
        message.textContent =
            "Unable to create account. Please try again.";
        return;
    }

    if (selectedType === "responder") {
        message.textContent =
            "Account created! Your responder application is pending administrator approval.";
        message.style.color = "#d97706";
    } else {
        setInterfaceText(
            message,
            "Prototype account created successfully."
        );
        message.style.color = "#15803d";
    }

    registerForm.reset();
});
}





const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email =
            document.getElementById("loginEmail").value.trim();

        const password =
            document.getElementById("loginPassword").value;

        const message =
            document.getElementById("loginMessage");

        const users =
            readAccountRecords(USERS_KEY);

        const matchingAccounts = users.filter(account => sameAccountEmail(account.email, email));
        const exactAccount = matchingAccounts.find(account => account.email === email);
        const user = exactAccount || (matchingAccounts.length === 1 ? matchingAccounts[0] : null);

        if (user?.password === password) {
            localStorage.setItem(SESSION_KEY, JSON.stringify(getPublicAccount(user)));

            setInterfaceText(message, "Prototype login successful.");

            setTimeout(function () {
                window.location.href = "dashboard.html";
            }, 1000);

        } else {
            setInterfaceText(message, "Invalid prototype email or password.");
        }
    });
}