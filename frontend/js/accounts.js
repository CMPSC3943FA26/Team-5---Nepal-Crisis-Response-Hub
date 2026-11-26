const DEMO_ADMIN_EMAIL = "test@example.com";
const USERS_KEY = "prototypeUsers";
const SESSION_KEY = "currentPrototypeUser";

function readAccountRecords(key) {
    return JSON.parse(localStorage.getItem(key) || "[]");
}



function getAccountRole(account) {
    if (!account || account.accountStatus === "Suspended") {
        return "suspended";
    }

    if (account.role === "admin") {
        return "admin";
    }

    if (
        account.accountType === "responder" &&
        account.verificationStatus === "Approved" &&
        account.role === "responder"
    ) {
        return "responder";
    }

    return "user";
}



function getPublicAccount(account) {
    const { password, ...profile } = account;
    return { ...profile, role: getAccountRole(account) };
}

function sameAccountEmail(left, right) {
    return typeof left === "string" && typeof right === "string" &&
        left.toLowerCase() === right.toLowerCase();
}

function accountRecordsKey(feature, email) {
    return `prototype:${feature}:${email}`;
}

// Pages render against the active account. Discard old views when another
// tab signs in, signs out, or updates that account.
window.addEventListener("storage", (event) => {
    if (event.key === SESSION_KEY) window.location.reload();
});

function validateActiveSession() {
    const session = JSON.parse(
        localStorage.getItem(SESSION_KEY) || "null"
    );

    if (!session) return;

    const account = readAccountRecords(USERS_KEY)
        .find(user =>
            sameAccountEmail(user.email, session.email)
        );

    if (!account || account.accountStatus === "Suspended") {
        localStorage.removeItem(SESSION_KEY);

        alert(
            "Your account is unavailable or has been suspended."
        );

        window.location.replace("login.html");
    }
}

validateActiveSession();

window.addEventListener("storage", event => {
    if (event.key === USERS_KEY) {
        validateActiveSession();
    }
});

window.addEventListener("pageshow", validateActiveSession);
