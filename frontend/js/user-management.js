
(() => {
    const session = JSON.parse(
        localStorage.getItem(SESSION_KEY) || "null"
    );

    if (!session || session.role !== "admin") return;

    const stats = document.getElementById(
        "userManagementStats"
    );

    const list = document.getElementById(
        "adminUserList"
    );

    const search = document.getElementById(
        "adminUserSearch"
    );

    const filter = document.getElementById(
        "adminUserFilter"
    );

    const message = document.getElementById(
        "adminUserMessage"
    );

    function getUsers() {
        return readAccountRecords(USERS_KEY);
    }

    function isAdministrator(account) {
        return account.role === "admin";
    }

    function isSuspended(account) {
        return account.accountStatus === "Suspended";
    }

    function getRoleLabel(account) {
        if (isAdministrator(account)) {
            return "Administrator";
        }

        if (account.accountType === "responder") {
            if (account.verificationStatus === "Approved") {
                return "Verified Responder";
            }

            if (account.verificationStatus === "Rejected") {
                return "Rejected Responder";
            }

            return "Pending Responder";
        }

        return "Citizen";
    }

    function renderStats(users) {
        stats.replaceChildren();

        const data = [
            [
                "Total Users",
                users.length,
                "#2563eb"
            ],
            [
                "Active Accounts",
                users.filter(u => !isSuspended(u)).length,
                "#15803d"
            ],
            [
                "Verified Responders",
                users.filter(u =>
                    getRoleLabel(u) === "Verified Responder" &&
                    !isSuspended(u)
                ).length,
                "#2563eb"
            ],
            [
                "Suspended Accounts",
                users.filter(isSuspended).length,
                "#dc2626"
            ]
        ];

        data.forEach(([label, count, color]) => {
            const card = document.createElement("article");
            card.className = "card";

            card.style.cssText = `
                border-top: 4px solid ${color};
                text-align: center;
            `;

            const number = document.createElement("h2");
            number.textContent = count;
            number.style.color = color;

            const title = document.createElement("p");
            setInterfaceText(title, label);

            card.append(number, title);
            stats.appendChild(card);
        });
    }

    function changeAccountStatus(account) {
        const activeSession = JSON.parse(
            localStorage.getItem(SESSION_KEY) || "null"
        );

        const users = getUsers();

        const administrator = users.find(u =>
            sameAccountEmail(u.email, activeSession?.email)
        );

        if (
            !administrator ||
            !isAdministrator(administrator) ||
            isSuspended(administrator)
        ) {
            alert("Administrator access required.");
            return;
        }

        const target = users.find(u =>
            account.id
                ? u.id === account.id
                : sameAccountEmail(u.email, account.email)
        );

        if (!target || isAdministrator(target)) {
            alert("Administrator accounts cannot be suspended.");
            return;
        }

        const suspend = !isSuspended(target);

        if (!confirm(
            suspend
                ? "Suspend this account?"
                : "Restore this account?"
        )) return;

        target.accountStatus =
            suspend ? "Suspended" : "Active";

        target.accountStatusUpdatedAt =
            new Date().toISOString();

        if (
            suspend &&
            target.accountType === "responder"
        ) {
            target.availability = "Offline";
        }

        try {
            localStorage.setItem(
                USERS_KEY,
                JSON.stringify(users)
            );
        } catch {
            alert("Unable to save account status.");
            return;
        }


if (suspend && target.accountType === "responder") {
    const requests = JSON.parse(
        localStorage.getItem("helpRequests") || "[]"
    );

    let updated = false;

    requests.forEach(request => {
        if (
            sameAccountEmail(
                request.assignedResponderEmail,
                target.email
            ) &&
            request.status === "In Progress"
        ) {
            request.status = "Pending";
            request.assignedResponderEmail = "";
            request.responseStage = 0;
            request.updatedAt = new Date().toISOString();

            delete request.acceptedAt;
            delete request.onTheWayAt;
            delete request.arrivedAt;
            delete request.completedAt;

            updated = true;
        }
    });

    if (updated) {
        localStorage.setItem(
            "helpRequests",
            JSON.stringify(requests)
        );
    }
}


        message.textContent = suspend
            ? "Account suspended successfully."
            : "Account restored successfully.";

        renderUsers();
    }

    function renderUsers() {
        const users = getUsers();

        renderStats(users);

        const query = search.value.trim().toLowerCase();
        const selected = filter.value;

        list.replaceChildren();

        const filtered = users.filter(account => {
            const matchesSearch =
                (account.name || "").toLowerCase()
                    .includes(query) ||
                (account.email || "").toLowerCase()
                    .includes(query);

            if (!matchesSearch) return false;

            if (selected === "all") return true;

            if (selected === "suspended") {
                return isSuspended(account);
            }

            if (selected === "citizen") {
                return getRoleLabel(account) === "Citizen";
            }

            if (selected === "responder") {
                return getRoleLabel(account) ===
                    "Verified Responder";
            }

            if (selected === "pending") {
                return getRoleLabel(account) ===
                    "Pending Responder";
            }

            return false;
        });

        if (!filtered.length) {
            list.textContent = "No matching accounts found.";
            return;
        }

        filtered.forEach(account => {
            const card = document.createElement("article");
            card.className = "card";

            const heading = document.createElement("h3");
            heading.textContent = account.name;

            const role = document.createElement("p");
            setInterfaceText(role, getRoleLabel(account));

            const status = document.createElement("p");

            setInterfaceText(
                status,
                isSuspended(account) ? "Suspended" : "Active"
            );

            status.style.cssText = `
                font-weight: bold;
                color: ${
                    isSuspended(account)
                        ? "#dc2626"
                        : "#15803d"
                };
            `;

            card.append(heading, role, status);

            const details = [
                ["Email", account.email],
                ["District", account.district],
                ["Affiliated Organization", account.organization],
                ["Verification Status", account.verificationStatus]
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

            if (!isAdministrator(account)) {
                const button = document.createElement("button");

                button.type = "button";

                setInterfaceText(
                    button,
                    isSuspended(account)
                        ? "Restore Account"
                        : "Suspend Account"
                );

                button.style.cssText = `
                    background: ${
                        isSuspended(account)
                            ? "#15803d"
                            : "#dc2626"
                    };
                    color: white;
                    margin-top: 12px;
                    width: 100%;
                `;

                button.addEventListener("click", () => {
                    changeAccountStatus(account);
                });

                card.appendChild(button);
            }

            list.appendChild(card);
        });
    }

    search.addEventListener("input", renderUsers);
    filter.addEventListener("change", renderUsers);

    window.addEventListener("storage", event => {
        if (event.key === USERS_KEY) {
            renderUsers();
        }
    });

    renderUsers();
})();
