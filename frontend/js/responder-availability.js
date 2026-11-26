
function getResponderAvailability(email) {
    const users = readAccountRecords(USERS_KEY);

    const account = users.find(user =>
        sameAccountEmail(user.email, email)
    );

    if (!account || getAccountRole(account) !== "responder") {
        return "Offline";
    }

    return ["Available", "Busy", "Offline"].includes(
        account.availability
    ) ? account.availability : "Available";
}

(() => {
    const session = JSON.parse(
        localStorage.getItem(SESSION_KEY) || "null"
    );

    if (!session) return;

    const account = readAccountRecords(USERS_KEY)
        .find(user =>
            sameAccountEmail(user.email, session.email)
        );

    if (!account || getAccountRole(account) !== "responder") {
        return;
    }

    const welcomeHeading =
        document.getElementById("userName")?.closest("h2");

    if (!welcomeHeading) return;

    const card = document.createElement("article");

    card.className = "card";

    card.style.cssText = `
        margin: 20px 0;
        border-left: 5px solid #15803d;
    `;

    const heading = document.createElement("h3");
    setInterfaceText(heading, "Response Availability");

    const description = document.createElement("p");

    const select = document.createElement("select");

    ["Available", "Busy", "Offline"].forEach(status => {
        const option = document.createElement("option");

        option.value = status;
        setInterfaceText(option, status);

        select.appendChild(option);
    });

    select.value = getResponderAvailability(session.email);

    const indicator = document.createElement("p");

    function updateAppearance() {
        const status = select.value;

        const colors = {
            Available: "#15803d",
            Busy: "#d97706",
            Offline: "#64748b"
        };

        const descriptions = {
            Available:
                "You are available to accept emergency requests.",
            Busy:
                "You are busy and cannot accept new requests.",
            Offline:
                "You are offline and cannot accept new requests."
        };

        setInterfaceText(indicator, status);

        indicator.style.cssText = `
            color: ${colors[status]};
            font-weight: bold;
            margin: 12px 0;
        `;

        card.style.borderLeftColor = colors[status];

        setInterfaceText(description, descriptions[status]);
    }

    select.addEventListener("change", () => {
        const latestSession = JSON.parse(
            localStorage.getItem(SESSION_KEY) || "null"
        );

        const users = readAccountRecords(USERS_KEY);

        const current = users.find(user =>
            sameAccountEmail(user.email, session.email)
        );

        if (
            !latestSession ||
            latestSession.email !== session.email ||
            !current ||
            getAccountRole(current) !== "responder"
        ) {
            alert("Verified responder access required.");
            return;
        }

        current.availability = select.value;
        current.availabilityUpdatedAt =
            new Date().toISOString();

        try {
            localStorage.setItem(
                USERS_KEY,
                JSON.stringify(users)
            );
        } catch (error) {
            select.value =
                getResponderAvailability(session.email);

            updateAppearance();

            alert("Unable to save availability.");
            return;
        }

        window.location.reload();
    });

    card.append(
        heading,
        indicator,
        select,
        description
    );

    welcomeHeading.after(card);

    updateAppearance();
})();
