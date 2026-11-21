const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name =
            document.getElementById("registerName").value.trim();

        const email =
            document.getElementById("registerEmail").value.trim().toLowerCase();

        const password =
            document.getElementById("registerPassword").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;

        const message =
            document.getElementById("registerMessage");

        if (!name) {
            setInterfaceText(message, "Enter your name.");
            return;
        }

        if (password !== confirmPassword) {
            setInterfaceText(message, "Passwords do not match.");
            return;
        }

        const users =
            readAccountRecords(USERS_KEY);

        const emailTaken = users.some(user => sameAccountEmail(user.email, email));
        const adminEmailReserved = email === DEMO_ADMIN_EMAIL &&
            users.some(user => getAccountRole(user) === "admin");

        if (emailTaken || adminEmailReserved) {
            setInterfaceText(message, "A prototype account with this email already exists.");
            return;
        }

        const role = email === DEMO_ADMIN_EMAIL ? "admin" :
            (document.getElementById("registerVolunteer").checked ? "responder" : "user");
        users.push({ name, email, password, role });
        localStorage.setItem(USERS_KEY, JSON.stringify(users));

        setInterfaceText(message, "Prototype account created successfully.");

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