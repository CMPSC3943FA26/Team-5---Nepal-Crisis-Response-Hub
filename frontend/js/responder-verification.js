
(() => {
    const user = JSON.parse(
        localStorage.getItem("currentPrototypeUser") || "null"
    );

    if (!user || user.role !== "admin") return;

    const stats = document.getElementById(
        "responderVerificationStats"
    );

    const list = document.getElementById(
        "responderApplicationList"
    );

    const filter = document.getElementById(
        "responderVerificationFilter"
    );

    const message = document.getElementById(
        "responderVerificationMessage"
    );

    function getUsers() {
        return JSON.parse(
            localStorage.getItem("prototypeUsers") || "[]"
        );
    }

    function getApplications() {
        return getUsers().filter(account =>
            account.accountType === "responder"
        );
    }

    function renderStats(applications) {
        stats.replaceChildren();

        const categories = [
            ["Pending Applications", "Pending", "#d97706"],
            ["Approved Responders", "Approved", "#15803d"],
            ["Rejected Applications", "Rejected", "#dc2626"]
        ];

        categories.forEach(([label, status, color]) => {
            const card = document.createElement("article");

            card.className = "card";

            card.style.cssText = `
                border-top: 4px solid ${color};
                text-align: center;
            `;

            const count = document.createElement("h2");

            count.textContent = applications.filter(
                account => account.verificationStatus === status
            ).length;

            count.style.color = color;

            const title = document.createElement("p");
            setInterfaceText(title, label);

            card.append(count, title);
            stats.appendChild(card);
        });
    }

    function reviewApplication(account, approved) {
        const session = JSON.parse(
            localStorage.getItem("currentPrototypeUser") || "null"
        );

        if (!session || session.role !== "admin") {
            alert("Administrator access required.");
            return;
        }

        const users = getUsers();

        const applicant = users.find(item =>
            item.id === account.id &&
            item.accountType === "responder"
        );

        if (!applicant ||
            applicant.verificationStatus !== "Pending") {
            alert("This application is no longer pending.");
            renderApplications();
            return;
        }

        const confirmed = confirm(
            approved
                ? "Approve this responder application?"
                : "Reject this responder application?"
        );

        if (!confirmed) return;

        applicant.verificationStatus =
            approved ? "Approved" : "Rejected";

        applicant.role =
            approved ? "responder" : "user";

        applicant.reviewedBy = session.email;
        applicant.reviewedAt = new Date().toISOString();

        try {
            localStorage.setItem(
                "prototypeUsers",
                JSON.stringify(users)
            );
        } catch (error) {
            message.textContent = "Unable to save decision.";
            return;
        }

        message.textContent = approved
            ? "Responder application approved successfully."
            : "Responder application rejected.";

        renderApplications();
    }

    function renderApplications() {
        const applications = getApplications();

        renderStats(applications);
        list.replaceChildren();

        const selected = filter.value;

        const filtered = applications.filter(account =>
            selected === "all" ||
            account.verificationStatus === selected
        ).reverse();

        if (!filtered.length) {
            list.textContent = "No matching applications found.";
            return;
        }

        filtered.forEach(account => {
            const card = document.createElement("article");
            card.className = "card";

            const heading = document.createElement("h3");
            heading.textContent = account.name;

            const status = document.createElement("p");

            setInterfaceText(
                status,
                account.verificationStatus || "Pending"
            );

            const statusColor =
                account.verificationStatus === "Approved"
                    ? "#15803d"
                    : account.verificationStatus === "Rejected"
                        ? "#dc2626"
                        : "#d97706";

            status.style.cssText = `
                color: ${statusColor};
                font-weight: bold;
                margin: 10px 0;
            `;

            card.append(heading, status);

            const details = [
                ["Email", account.email],
                ["Phone Number", account.phone],
                ["District", account.district],
                ["Affiliated Organization", account.organization],
                ["Organization Type", account.organizationType],
                ["Professional Role", account.position],
                ["Credential Type", account.credentialType],
                ["Credential Number", account.credentialNumber],
                ["Submitted", account.createdAt
                    ? new Date(account.createdAt).toLocaleString()
                    : ""]
            ];

            details.forEach(([label, value]) => {
                if (!value) return;

                const paragraph = document.createElement("p");
                const strong = document.createElement("strong");

                setInterfaceText(strong, label);

                paragraph.append(
                    strong,
                    document.createTextNode(": " + value)
                );

                card.appendChild(paragraph);
            });

            if (account.verificationStatus === "Pending") {
                const approve = document.createElement("button");

                approve.type = "button";
                setInterfaceText(approve, "Approve Responder");
                approve.style.background = "#15803d";
                approve.style.color = "white";

                approve.addEventListener("click", () =>
                    reviewApplication(account, true)
                );

                const reject = document.createElement("button");

                reject.type = "button";
                setInterfaceText(reject, "Reject Application");
                reject.style.background = "#dc2626";
                reject.style.color = "white";
                reject.style.marginTop = "8px";

                reject.addEventListener("click", () =>
                    reviewApplication(account, false)
                );

                card.append(approve, reject);
            }

            list.appendChild(card);
        });
    }

    filter.addEventListener("change", renderApplications);

    window.addEventListener("storage", event => {
        if (event.key === "prototypeUsers") {
            renderApplications();
        }
    });

    renderApplications();
})();
