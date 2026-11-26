
function getResponseStage(request) {
    if (request.status === "Completed") return 4;

    if (!request.assignedResponderEmail) return 0;

    if (Number.isInteger(request.responseStage)) {
        return Math.max(1, Math.min(3, request.responseStage));
    }

    return 1;
}

function createResponseTimeline(request) {
    const timeline = document.createElement("div");

    timeline.style.cssText = `
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 18px;
        margin: 18px 0;
    `;

    const heading = document.createElement("h3");
    setInterfaceText(heading, "Response Progress");

    timeline.appendChild(heading);

    if (request.status === "Canceled") {
        const canceled = document.createElement("p");
        setInterfaceText(canceled, "Request Canceled");
        canceled.style.color = "#dc2626";
        timeline.appendChild(canceled);
        return timeline;
    }

    const stages = [
        "Request Submitted",
        "Responder Assigned",
        "On the Way",
        "Arrived",
        "Resolved"
    ];

    const currentStage = getResponseStage(request);

    stages.forEach((label, index) => {
        const row = document.createElement("div");

        row.style.cssText = `
            display: flex;
            align-items: flex-start;
            gap: 14px;
            min-height: 65px;
            position: relative;
        `;

        const marker = document.createElement("div");

        marker.textContent =
            index < currentStage ? "✓" : index + 1;

        marker.style.cssText = `
            width: 32px;
            height: 32px;
            flex-shrink: 0;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            background: ${
                index <= currentStage
                    ? "#15803d"
                    : "#e2e8f0"
            };
            color: ${
                index <= currentStage
                    ? "white"
                    : "#64748b"
            };
            position: relative;
            z-index: 1;
        `;

        if (index < stages.length - 1) {
            const connector = document.createElement("div");

            connector.style.cssText = `
                position: absolute;
                top: 30px;
                bottom: 0;
                left: 15px;
                width: 3px;
                background: ${
                    index < currentStage
                        ? "#15803d"
                        : "#cbd5e1"
                };
            `;

            row.appendChild(connector);
        }

        const content = document.createElement("div");

        const title = document.createElement("strong");
        setInterfaceText(title, label);

        title.style.color =
            index <= currentStage
                ? "#15803d"
                : "#64748b";

        content.appendChild(title);

        const dates = [
            request.createdAt,
            request.acceptedAt,
            request.onTheWayAt,
            request.arrivedAt,
            request.completedAt
        ];

        if (index <= currentStage && dates[index]) {
            const date = document.createElement("p");

            date.textContent =
                new Date(dates[index]).toLocaleString();

            date.style.cssText = `
                font-size: 12px;
                color: #64748b;
                margin: 4px 0;
            `;

            content.appendChild(date);
        }

        if (index === currentStage) {
            const active = document.createElement("p");

            setInterfaceText(active, "Current Stage");

            active.style.cssText = `
                color: #15803d;
                font-size: 12px;
                font-weight: bold;
            `;

            content.appendChild(active);
        }

        row.append(marker, content);
        timeline.appendChild(row);
    });

    return timeline;
}

function createResponseProgressButton(request) {
    const button = document.createElement("button");

    button.type = "button";

    const stage = getResponseStage(request);

    const labels = {
        1: "Mark as On the Way",
        2: "Confirm Arrival",
        3: "Complete Response"
    };

    if (
        ["Completed", "Canceled"].includes(request.status) ||
        !labels[stage]
    ) {
        return document.createElement("span");
    }

    setInterfaceText(button, labels[stage]);

    button.style.cssText = `
        background: #15803d;
        color: white;
        width: 100%;
        margin-top: 10px;
    `;

    button.addEventListener("click", () => {
        const session = JSON.parse(
            localStorage.getItem("currentPrototypeUser") || "null"
        );

        const users = JSON.parse(
            localStorage.getItem("prototypeUsers") || "[]"
        );

        const account = users.find(u =>
            u.email === session?.email
        );

        if (
            !session ||
            !account ||
            getAccountRole(account) !== "responder"
        ) {
            alert("Verified responder access required.");
            return;
        }

        const requests = JSON.parse(
            localStorage.getItem("helpRequests") || "[]"
        );

        const target = requests.find(r =>
            request.id
                ? r.id === request.id
                : r.createdAt === request.createdAt &&
                  r.userEmail === request.userEmail &&
                  r.assistance === request.assistance
        );

        if (
            !target ||
            target.assignedResponderEmail !== session.email ||
            ["Completed", "Canceled"].includes(target.status) ||
            getResponseStage(target) !== stage
        ) {
            alert("Request has changed. Please refresh.");
            window.location.reload();
            return;
        }

        const nextStage = stage + 1;
        const now = new Date().toISOString();

        target.responseStage = nextStage;
        target.updatedAt = now;

        if (nextStage === 2) {
            target.onTheWayAt = now;
        }

        if (nextStage === 3) {
            target.arrivedAt = now;
        }

        if (nextStage === 4) {
            target.completedAt = now;
            target.status = "Completed";
        } else {
            target.status = "In Progress";
        }

        try {
            localStorage.setItem(
                "helpRequests",
                JSON.stringify(requests)
            );
        } catch (error) {
            alert("Unable to save response progress.");
            return;
        }

        window.location.reload();
    });

    return button;
}
