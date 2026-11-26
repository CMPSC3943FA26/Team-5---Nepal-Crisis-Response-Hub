
(() => {
    const session = JSON.parse(
        localStorage.getItem("currentPrototypeUser") || "null"
    );

    if (!session || session.role !== "admin") return;

    const statsContainer =
        document.getElementById("crisisOverviewStats");

    const activityContainer =
        document.getElementById("recentCrisisActivity");

    if (!statsContainer || !activityContainer) return;

    function readData(key) {
        try {
            const data = JSON.parse(
                localStorage.getItem(key) || "[]"
            );

            return Array.isArray(data) ? data : [];
        } catch {
            return [];
        }
    }

    statsContainer.style.cssText = `
        display: grid;
        grid-template-columns:
            repeat(auto-fit, minmax(220px, 1fr));
        gap: 18px;
        margin-top: 25px;
    `;

    function renderOverview() {
        const alerts = readData("crisisAlerts");
        const requests = readData("helpRequests");
        const users = readData("prototypeUsers");
        const missing = readData("missingPersons");
        const messages = readData("prototypePrivateMessages");

        const statistics = [

{
    label: "Available Responders",
    count: users.filter(u =>
        getAccountRole(u) === "responder" &&
        (u.availability || "Available") === "Available"
    ).length,
    icon: "🟢",
    color: "#15803d",
    link: "#responderVerification"
},
{
    label: "Busy Responders",
    count: users.filter(u =>
        getAccountRole(u) === "responder" &&
        u.availability === "Busy"
    ).length,
    icon: "🟠",
    color: "#d97706",
    link: "#responderVerification"
},
{
    label: "Offline Responders",
    count: users.filter(u =>
        getAccountRole(u) === "responder" &&
        u.availability === "Offline"
    ).length,
    icon: "⚪",
    color: "#64748b",
    link: "#responderVerification"
},

            {
                label: "Published Emergency Alerts",
                count: alerts.length,
                icon: "🚨",
                color: "#dc2626",
                link: "#publish"
            },
            {
                label: "Pending Help Requests",
                count: requests.filter(r =>
                    (r.status || "Pending") === "Pending"
                ).length,
                icon: "⏳",
                color: "#d97706",
                link: "#manageRequests"
            },
            {
                label: "Active Responses",
                count: requests.filter(r =>
                    r.status === "In Progress"
                ).length,
                icon: "🚑",
                color: "#2563eb",
                link: "#manageRequests"
            },
            {
                label: "Resolved Emergencies",
                count: requests.filter(r =>
                    r.status === "Completed"
                ).length,
                icon: "✅",
                color: "#15803d",
                link: "#manageRequests"
            },
            {
                label: "Verified Responders",
                count: users.filter(u =>
                    u.role === "responder" &&
                    u.verificationStatus === "Approved"
                ).length,
                icon: "🛡️",
                color: "#2563eb",
                link: "#responderVerification"
            },
            {
                label: "Pending Responder Applications",
                count: users.filter(u =>
                    u.accountType === "responder" &&
                    u.verificationStatus === "Pending"
                ).length,
                icon: "📋",
                color: "#d97706",
                link: "#responderVerification"
            },
            {
                label: "Currently Missing",
                count: missing.filter(p =>
                    p.status === "Missing"
                ).length,
                icon: "👥",
                color: "#dc2626",
                link: "#missingManagement"
            },
            {
                label: "Located Safe",
                count: missing.filter(p =>
                    p.status === "Located - Safe"
                ).length,
                icon: "💚",
                color: "#15803d",
                link: "#missingManagement"
            },
            {
                label: "Unread Messages",
                count: messages.filter(m =>
                    m.senderRole !== "admin" && !m.read
                ).length,
                icon: "✉️",
                color: "#7c3aed",
                link: "messages.html"
            }
        ];

        statsContainer.replaceChildren();

        statistics.forEach(stat => {
            const card = document.createElement("a");

            card.className = "card";
            card.href = stat.link;

            card.style.cssText = `
                background: white;
                border: 1px solid #e2e8f0;
                border-left: 5px solid ${stat.color};
                border-radius: 12px;
                padding: 22px;
                text-decoration: none;
                color: #0f172a;
                box-shadow: 0 3px 12px rgba(0,0,0,.05);
            `;

            const icon = document.createElement("span");
            icon.textContent = stat.icon;
            icon.style.fontSize = "26px";

            const number = document.createElement("h2");
            number.textContent = stat.count;

            number.style.cssText = `
                font-size: 38px;
                color: ${stat.color};
                margin: 8px 0;
            `;

            const label = document.createElement("p");
            setInterfaceText(label, stat.label);
            label.style.fontWeight = "bold";

            card.append(icon, number, label);
            statsContainer.appendChild(card);
        });

        renderActivity(alerts, requests, missing, users);
    }

    function renderActivity(alerts, requests, missing, users) {
        const activities = [];

        function addActivity(title, detail, date, color) {
            const timestamp = new Date(date).getTime();

            if (!Number.isFinite(timestamp)) return;

            activities.push({
                title,
                detail,
                timestamp,
                color
            });
        }

        alerts.forEach(alert => {
            addActivity(
                "Emergency alert published",
                alert.title + " - " + alert.location,
                alert.createdAt,
                "#dc2626"
            );
        });

        requests.forEach(request => {
            addActivity(
                "Emergency help request submitted",
                request.assistance + " - " + request.location,
                request.createdAt,
                "#d97706"
            );

            if (request.acceptedAt) {
                addActivity(
                    "Emergency request accepted",
                    request.assistance,
                    request.acceptedAt,
                    "#2563eb"
                );
            }

            if (request.updatedAt) {
                addActivity(
                    "Emergency request updated",
                    request.assistance + " - " + request.status,
                    request.updatedAt,
                    "#15803d"
                );
            }
        });

        missing.forEach(person => {
            addActivity(
                "Missing person reported",
                person.name,
                person.createdAt,
                "#dc2626"
            );

            if (person.status === "Located - Safe") {
                addActivity(
                    "Missing person confirmed safe",
                    person.name,
                    person.updatedAt,
                    "#15803d"
                );
            }
        });

        users.forEach(user => {
            if (user.accountType === "responder") {
                addActivity(
                    "Responder application submitted",
                    user.name,
                    user.createdAt,
                    "#d97706"
                );

                if (user.reviewedAt) {
                    addActivity(
                        "Responder application reviewed",
                        user.name + " - " +
                            user.verificationStatus,
                        user.reviewedAt,
                        "#2563eb"
                    );
                }
            }
        });

        activities.sort(
            (a, b) => b.timestamp - a.timestamp
        );

        activityContainer.replaceChildren();

        if (!activities.length) {
            const empty = document.createElement("p");

            setInterfaceText(
                empty,
                "No recent emergency activity."
            );

            activityContainer.appendChild(empty);
            return;
        }

        activities.slice(0, 10).forEach(activity => {
            const row = document.createElement("div");

            row.style.cssText = `
                border-left: 4px solid ${activity.color};
                background: #f8fafc;
                padding: 14px 18px;
                margin: 12px 0;
                border-radius: 6px;
            `;

            const title = document.createElement("strong");
            setInterfaceText(title, activity.title);

            const detail = document.createElement("p");
            detail.textContent = activity.detail;
            detail.style.margin = "5px 0";

            const time = document.createElement("small");

            time.textContent =
                new Date(activity.timestamp).toLocaleString();

            time.style.color = "#64748b";

            row.append(title, detail, time);

            activityContainer.appendChild(row);
        });
    }

    renderOverview();

    window.addEventListener("storage", renderOverview);

    setInterval(renderOverview, 2000);
})();
