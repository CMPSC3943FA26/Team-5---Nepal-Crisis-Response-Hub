
(() => {
    const user = JSON.parse(
        localStorage.getItem("currentPrototypeUser") || "null"
    );

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    const isAdmin = user.role === "admin";
    const isResponder = user.role === "responder";

    const READ_KEY =
        "prototypeNotificationReads";

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

    function getReadIds() {
        return new Set(
            readData(READ_KEY)
                .filter(record => record.email === user.email)
                .map(record => record.id)
        );
    }

    function markAsRead(ids) {
        const records = readData(READ_KEY);
        const existing = getReadIds();

        ids.forEach(id => {
            if (!existing.has(id)) {
                records.push({
                    email: user.email,
                    id,
                    readAt: new Date().toISOString()
                });
            }
        });

        try {
            localStorage.setItem(
                READ_KEY,
                JSON.stringify(records)
            );
        } catch {
            alert("Unable to save notification status.");
        }
    }

    function getNotifications() {
        const notifications = [];

        const alerts = readData("crisisAlerts");
        const requests = readData("helpRequests");
        const messages = readData("prototypePrivateMessages");
        const users = readData("prototypeUsers");
        const missing = readData("missingPersons");

        function add(id, category, title, description,
                     date, icon, color, link) {

            if (!date || !Number.isFinite(
                new Date(date).getTime()
            )) return;

            notifications.push({
                id,
                category,
                title,
                description,
                date,
                icon,
                color,
                link
            });
        }

        // Emergency alerts for everyone
        alerts.forEach(alert => {
            add(
                "alert-" + (alert.id || alert.createdAt),
                "alerts",
                "Emergency Alert",
                alert.title + " — " + alert.location,
                alert.createdAt,
                "🚨",
                "#dc2626",
                "index.html#alerts"
            );
        });

        // Emergency request notifications
        requests.forEach(request => {
            const id = request.id ||
                request.createdAt + "-" + request.userEmail;

            const owner = request.userEmail === user.email;

            if (owner) {
                const updates = [
                    [
                        "Request Submitted",
                        request.createdAt
                    ],
                    [
                        "Responder Assigned",
                        request.acceptedAt
                    ],
                    [
                        "Responder On the Way",
                        request.onTheWayAt
                    ],
                    [
                        "Responder Arrived",
                        request.arrivedAt
                    ],
                    [
                        "Emergency Request Resolved",
                        request.completedAt
                    ]
                ];

                updates.forEach(([title, date], index) => {
                    add(
                        "request-" + id + "-" + index,
                        "requests",
                        title,
                        request.assistance + " — " +
                            request.location,
                        date,
                        "🚑",
                        "#2563eb",
                        "dashboard.html#requests"
                    );
                });
            }

            if (
                isResponder &&
                !request.assignedResponderEmail &&
                (request.status || "Pending") === "Pending"
            ) {
                add(
                    "incoming-request-" + id,
                    "requests",
                    "New Emergency Help Request",
                    request.assistance + " — " +
                        request.location,
                    request.createdAt,
                    "🚑",
                    "#d97706",
                    "dashboard.html#responderRequestsSection"
                );
            }

            if (isAdmin) {
                add(
                    "admin-request-" + id,
                    "requests",
                    "Emergency Help Request Submitted",
                    request.assistance + " — " +
                        request.location,
                    request.createdAt,
                    "📋",
                    "#d97706",
                    "admin.html#manageRequests"
                );
            }
        });

        // Private message notifications
        messages.forEach(message => {
            const received = isAdmin
                ? message.senderRole !== "admin"
                : message.conversationId === user.email &&
                  message.senderRole === "admin";

            if (!received) return;

            add(
                "message-" + message.id,
                "messages",
                "New Message",
                "Message from " + message.senderName,
                message.createdAt,
                "✉️",
                "#7c3aed",
                "messages.html"
            );
        });

        // Responder application notifications
        users.forEach(account => {
            if (account.accountType !== "responder") return;

            if (isAdmin) {
                add(
                    "application-" + account.id,
                    "verification",
                    "Responder Application Submitted",
                    account.name + " — " +
                        account.organization,
                    account.createdAt,
                    "📋",
                    "#d97706",
                    "admin.html#responderVerification"
                );
            }

            if (
                account.email === user.email &&
                ["Approved", "Rejected"].includes(
                    account.verificationStatus
                )
            ) {
                add(
                    "application-decision-" +
                        account.id + "-" +
                        account.verificationStatus,
                    "verification",
                    account.verificationStatus === "Approved"
                        ? "Responder Application Approved"
                        : "Responder Application Rejected",
                    account.organization || "",
                    account.reviewedAt,
                    "🛡️",
                    account.verificationStatus === "Approved"
                        ? "#15803d"
                        : "#dc2626",
                    "dashboard.html"
                );
            }
        });

        // Missing person safety confirmation updates
        missing.forEach(person => {
            (person.safetyRequests || []).forEach(request => {

                if (isAdmin) {
                    add(
                        "safety-request-" + request.id,
                        "verification",
                        "Safety Confirmation Submitted",
                        person.name,
                        request.createdAt,
                        "👥",
                        "#d97706",
                        "admin.html#missingManagement"
                    );
                }

                if (
                    request.requestedBy === user.email &&
                    ["Approved", "Rejected"].includes(
                        request.status
                    )
                ) {
                    add(
                        "safety-decision-" + request.id +
                            "-" + request.status,
                        "verification",
                        request.status === "Approved"
                            ? "Safety Confirmation Approved"
                            : "Safety Confirmation Rejected",
                        person.name,
                        request.reviewedAt,
                        "🛡️",
                        request.status === "Approved"
                            ? "#15803d"
                            : "#dc2626",
                        "index.html#missingPersons"
                    );
                }
            });
        });

        return notifications.sort(
            (a, b) => new Date(b.date) - new Date(a.date)
        );
    }

    function updateBadge() {
        const readIds = getReadIds();

        const count = getNotifications().filter(
            notification => !readIds.has(notification.id)
        ).length;

        document.querySelectorAll(
            'nav a[href="notifications.html"]'
        ).forEach(link => {
            link.querySelector(".notification-badge")
                ?.remove();

            if (count > 0) {
                const badge = document.createElement("span");

                badge.className = "notification-badge";
                badge.textContent = count > 99
                    ? "99+"
                    : count;

                link.appendChild(badge);
            }
        });
    }

    const list = document.getElementById(
        "notificationCenterList"
    );

    const filter = document.getElementById(
        "notificationFilter"
    );

    const countHeading = document.getElementById(
        "notificationCount"
    );

    function renderNotifications() {
        if (!list || !filter || !countHeading) return;

        const notifications = getNotifications();
        const readIds = getReadIds();

        const unreadCount = notifications.filter(
            n => !readIds.has(n.id)
        ).length;

        countHeading.textContent =
            unreadCount + " Unread Notifications";

        const selected = filter.value;

        const filtered = notifications.filter(n => {
            if (selected === "all") return true;

            if (selected === "unread") {
                return !readIds.has(n.id);
            }

            return n.category === selected;
        });

        list.replaceChildren();

        if (!filtered.length) {
            const empty = document.createElement("p");

            setInterfaceText(
                empty,
                "No notifications found."
            );

            list.appendChild(empty);
        }

        filtered.forEach(notification => {
            const unread = !readIds.has(notification.id);

            const item = document.createElement("article");

            item.className = "notification-item" +
                (unread ? " unread" : "");

            item.style.borderLeftColor =
                notification.color;

            const icon = document.createElement("span");
            icon.className = "notification-icon";
            icon.textContent = notification.icon;

            const content = document.createElement("div");
            content.className = "notification-content";

            const heading = document.createElement("h3");
            setInterfaceText(heading, notification.title);

            const description = document.createElement("p");
            description.textContent =
                notification.description;

            const date = document.createElement("p");
            date.className = "notification-time";

            date.textContent =
                new Date(notification.date).toLocaleString();

            const actions = document.createElement("div");
            actions.className = "notification-actions";

            const view = document.createElement("a");
            view.href = notification.link;
            view.className = "button primary";

            setInterfaceText(view, "View Details");

            view.addEventListener("click", () => {
                markAsRead([notification.id]);
            });

            actions.appendChild(view);

            if (unread) {
                const readButton =
                    document.createElement("button");

                readButton.type = "button";

                setInterfaceText(
                    readButton,
                    "Mark as Read"
                );

                readButton.addEventListener("click", () => {
                    markAsRead([notification.id]);
                    renderNotifications();
                    updateBadge();
                });

                actions.appendChild(readButton);
            }

            content.append(
                heading,
                description,
                date,
                actions
            );

            item.append(icon, content);

            if (unread) {
                const dot = document.createElement("span");

                dot.className =
                    "notification-unread-dot";

                item.appendChild(dot);
            }

            list.appendChild(item);
        });
    }

    filter?.addEventListener(
        "change",
        renderNotifications
    );

    document.getElementById("markAllNotificationsRead")
        ?.addEventListener("click", () => {
            markAsRead(
                getNotifications().map(n => n.id)
            );

            renderNotifications();
            updateBadge();
        });

    document.getElementById("notificationLogout")
        ?.addEventListener("click", event => {
            event.preventDefault();

            localStorage.removeItem(
                "currentPrototypeUser"
            );

            window.location.href = "login.html";
        });

    window.addEventListener("storage", () => {
        renderNotifications();
        updateBadge();
    });

    renderNotifications();
    updateBadge();

    setInterval(updateBadge, 3000);
})();
