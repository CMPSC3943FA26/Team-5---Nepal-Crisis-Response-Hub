(() => {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
    const initialAccount = readAccountRecords(USERS_KEY).find(user => user.email === session?.email);
    if (!initialAccount) {
        localStorage.removeItem(SESSION_KEY);
        window.location.replace("login.html");
        return;
    }

    const profileForm = document.getElementById("profileForm");
    const passwordForm = document.getElementById("passwordForm");
    const deleteForm = document.getElementById("deleteAccountForm");
    const nameField = document.getElementById("accountName");
    const emailField = document.getElementById("accountEmail");
    const phoneField = document.getElementById("accountPhone");
    let activeEmail = initialAccount.email;

    nameField.value = initialAccount.name || "";
    emailField.value = activeEmail;
    phoneField.value = initialAccount.phone || "";
    document.getElementById("accountSettings").hidden = false;

    // Keep existing browser records keyed by email usable after a profile update.
    function linkedRecordChanges(oldEmail, newEmail) {
        const requests = readAccountRecords("helpRequests")
            .filter(request => newEmail !== null || request.userEmail !== oldEmail)
            .map(request => {
                const updated = { ...request };
                if (updated.userEmail === oldEmail) updated.userEmail = newEmail;
                if (updated.assignedResponderEmail === oldEmail) updated.assignedResponderEmail = newEmail;
                if (Array.isArray(updated.messages)) {
                    updated.messages = updated.messages
                        .filter(message => newEmail !== null ||
                            (message.senderEmail !== oldEmail && message.recipientEmail !== oldEmail))
                        .map(message => ({
                            ...message,
                            senderEmail: message.senderEmail === oldEmail ? newEmail : message.senderEmail,
                            recipientEmail: message.recipientEmail === oldEmail ? newEmail : message.recipientEmail
                        }));
                }
                return updated;
            });
        const reports = readAccountRecords("incidentReports")
            .filter(report => newEmail !== null || report.reportedBy !== oldEmail)
            .map(report => report.reportedBy === oldEmail ? { ...report, reportedBy: newEmail } : report);
        const changes = [["helpRequests", JSON.stringify(requests)], ["incidentReports", JSON.stringify(reports)]];

        for (const feature of ["contacts", "donations"]) {
            const oldKey = accountRecordsKey(feature, oldEmail);
            const records = localStorage.getItem(oldKey);
            changes.push([oldKey, null]);
            if (newEmail !== null && records !== null) {
                changes.push([accountRecordsKey(feature, newEmail), records]);
            }
        }


// Update private messaging records
const privateMessages = readAccountRecords("prototypePrivateMessages")
    .filter(message =>
        newEmail !== null ||
        (
            message.conversationId !== oldEmail &&
            message.senderEmail !== oldEmail
        )
    )
    .map(message => ({
        ...message,
        conversationId:
            message.conversationId === oldEmail
                ? newEmail
                : message.conversationId,
        senderEmail:
            message.senderEmail === oldEmail
                ? newEmail
                : message.senderEmail
    }));

changes.push([
    "prototypePrivateMessages",
    JSON.stringify(privateMessages)
]);

// Update missing person safety confirmation records
const missingReports = readAccountRecords("missingPersons")
    .map(report => {
        const updated = { ...report };

        if (Array.isArray(updated.safetyRequests)) {
            updated.safetyRequests = updated.safetyRequests
                .map(request => {
                    const revised = { ...request };

                    if (revised.requestedBy === oldEmail) {
                        revised.requestedBy = newEmail;

                        if (newEmail === null) {
                            revised.requesterName = "Deleted Account";

                            if (revised.status === "Pending") {
                                revised.status = "Withdrawn";
                                revised.details = "";
                            }
                        }
                    }

                    if (revised.reviewedBy === oldEmail) {
                        revised.reviewedBy = newEmail;
                    }

                    return revised;
                });
        }

        return updated;
    });

changes.push([
    "missingPersons",
    JSON.stringify(missingReports)
]);


        return changes;
    }

    function writeChanges(changes) {
        const previous = changes.map(([key]) => [key, localStorage.getItem(key)]);
        const write = (key, value) => {
            if (value === null) localStorage.removeItem(key);
            else localStorage.setItem(key, value);
        };
        let applied = 0;
        try {
            for (const [key, value] of changes) {
                write(key, value);
                applied += 1;
            }
        } catch (error) {
            for (const [key, value] of previous.slice(0, applied).reverse()) write(key, value);
            throw error;
        }
    }

    function handleSubmit(form, messageId, update) {
        const message = document.getElementById(messageId);
        form.addEventListener("submit", event => {
            event.preventDefault();
            try {
                const latestSession = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
                const users = readAccountRecords(USERS_KEY);
                const account = users.find(user => user.email === activeEmail);
                if (!account || latestSession?.email !== activeEmail) {
                    window.location.replace("login.html");
                    return;
                }
                update(account, users, message);
            } catch {
                setInterfaceText(message, "Could not save changes. Try again.");
            }
        });
    }

    handleSubmit(profileForm, "profileMessage", (account, users, message) => {
        const name = nameField.value.trim();
        const enteredEmail = emailField.value.trim();
        const email = sameAccountEmail(enteredEmail, account.email) ? account.email : enteredEmail.toLowerCase();
        const phone = phoneField.value.trim();
        const role = getAccountRole(account);

        if (!name) {
            setInterfaceText(message, "Enter your name.");
            return;
        }
        if ((email === DEMO_ADMIN_EMAIL && role !== "admin") ||
            users.some(user => user !== account && sameAccountEmail(user.email, email))) {
            setInterfaceText(message, "This email is unavailable.");
            return;
        }

        const updated = { ...account, name, email, phone, role };
        const changes = email === activeEmail ? [] : linkedRecordChanges(activeEmail, email);
        changes.push(
            [USERS_KEY, JSON.stringify(users.map(user => user === account ? updated : user))],
            [SESSION_KEY, JSON.stringify(getPublicAccount(updated))]
        );
        writeChanges(changes);
        activeEmail = email;
        nameField.value = name;
        emailField.value = email;
        phoneField.value = phone;
        setInterfaceText(message, "Profile saved.");
    });

    handleSubmit(passwordForm, "passwordMessage", (account, users, message) => {
        const current = document.getElementById("currentPassword").value;
        const password = document.getElementById("newPassword").value;
        const confirmation = document.getElementById("confirmNewPassword").value;
        if (current !== account.password) {
            setInterfaceText(message, "Current password is incorrect.");
            return;
        }
        if (password.length < 8) {
            setInterfaceText(message, "Use at least 8 characters.");
            return;
        }
        if (password !== confirmation) {
            setInterfaceText(message, "Passwords do not match.");
            return;
        }
        const updatedUsers = users.map(user => user === account ? { ...user, password } : user);
        writeChanges([
            [USERS_KEY, JSON.stringify(updatedUsers)],
            [SESSION_KEY, JSON.stringify(getPublicAccount(account))]
        ]);
        passwordForm.reset();
        setInterfaceText(message, "Password changed.");
    });

    handleSubmit(deleteForm, "deleteMessage", (account, users, message) => {
        if (document.getElementById("deletePassword").value !== account.password) {
            setInterfaceText(message, "Current password is incorrect.");
            return;
        }
        if (!window.confirm(translateLabel("Permanently delete your account and its records from this browser?"))) {
            deleteForm.reset();
            return;
        }
        writeChanges([
            ...linkedRecordChanges(activeEmail, null),
            [USERS_KEY, JSON.stringify(users.filter(user => user !== account))],
            [SESSION_KEY, null]
        ]);
        window.location.replace("login.html");
    });
})();
