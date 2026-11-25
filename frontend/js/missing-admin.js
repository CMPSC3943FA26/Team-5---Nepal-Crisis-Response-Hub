
(() => {
    const user = JSON.parse(
        localStorage.getItem("currentPrototypeUser") || "null"
    );

    if (!user || user.role !== "admin") return;

    const statsContainer =
        document.getElementById("missingAdminStats");

    const reportList =
        document.getElementById("missingAdminList");

    const filter =
        document.getElementById("missingAdminFilter");

    const message =
        document.getElementById("missingAdminMessage");

    function getReports() {
        return JSON.parse(
            localStorage.getItem("missingPersons") || "[]"
        );
    }

    function saveReports(reports) {
        try {
            localStorage.setItem(
                "missingPersons",
                JSON.stringify(reports)
            );
            return true;
        } catch (error) {
            message.textContent = "Unable to save changes.";
            return false;
        }
    }

    function isAdmin() {
        const session = JSON.parse(
            localStorage.getItem("currentPrototypeUser") || "null"
        );

        return session && session.role === "admin";
    }

    function pendingRequests(report) {
        return (report.safetyRequests || [])
            .filter(r => r.status === "Pending");
    }

    function renderStats(reports) {
        statsContainer.replaceChildren();

        const stats = [
            [
                "Currently Missing",
                reports.filter(r =>
                    r.status === "Missing"
                ).length,
                "#dc2626"
            ],
            [
                "Pending Verification",
                reports.filter(r =>
                    r.status === "Missing" &&
                    pendingRequests(r).length > 0
                ).length,
                "#d97706"
            ],
            [
                "Located Safe",
                reports.filter(r =>
                    r.status === "Located - Safe"
                ).length,
                "#15803d"
            ]
        ];

        stats.forEach(([label, count, color]) => {
            const card = document.createElement("div");
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
            statsContainer.appendChild(card);
        });
    }

    function findReport(reports, person) {
        return reports.findIndex(r =>
            person.id
                ? r.id === person.id
                : r.createdAt === person.createdAt &&
                  r.name === person.name &&
                  r.lastKnownLocation === person.lastKnownLocation
        );
    }

    function reviewRequest(person, request, approved) {
        if (!isAdmin()) return;

        const reports = getReports();
        const index = findReport(reports, person);
        const report = reports[index];

        if (!report || report.status !== "Missing") {
            alert("This report is no longer active.");
            renderReports();
            return;
        }

        const target = (report.safetyRequests || [])
            .find(r => r.id === request.id);

        if (!target || target.status !== "Pending") {
            alert("This request has already been reviewed.");
            renderReports();
            return;
        }

        if (approved && !confirm(
            "Confirm this fictional person has been verified safe?"
        )) return;

        target.status = approved
            ? "Approved"
            : "Rejected";

        target.reviewedBy = user.email;
        target.reviewedAt = new Date().toISOString();

        if (approved) {
            report.status = "Located - Safe";
            report.updatedAt = new Date().toISOString();

            report.safetyRequests.forEach(r => {
                if (r.status === "Pending") {
                    r.status = "Closed";
                }
            });
        }

        if (!saveReports(reports)) return;

        message.textContent = approved
            ? "Missing person successfully marked as safe."
            : "Safety confirmation rejected.";

        renderReports();
    }

    function createButton(label, color, action) {
        const button = document.createElement("button");

        button.type = "button";
        setInterfaceText(button, label);

        button.style.cssText = `
            background: ${color};
            color: white;
            margin: 5px 5px 5px 0;
        `;

        button.addEventListener("click", action);

        return button;
    }

    function renderReports() {
        if (!isAdmin()) return;

        const reports = getReports();

        renderStats(reports);
        reportList.replaceChildren();

        const selected = filter.value;

        const filtered = reports.filter(report => {
            if (selected === "missing") {
                return report.status === "Missing";
            }

            if (selected === "pending") {
                return report.status === "Missing" &&
                    pendingRequests(report).length > 0;
            }

            if (selected === "safe") {
                return report.status === "Located - Safe";
            }

            return true;
        }).reverse();

        if (!filtered.length) {
            reportList.textContent = "No matching reports found.";
            return;
        }

        filtered.forEach(person => {
            const card = document.createElement("article");
            card.className = "card";

            if (
                person.photo &&
                /^data:image\/(jpeg|png|webp);base64,/.test(person.photo)
            ) {
                const photo = document.createElement("img");

                photo.src = person.photo;
                photo.alt = "Photograph of " + person.name;

                photo.style.cssText = `
                    width: 100%;
                    height: 220px;
                    object-fit: cover;
                    border-radius: 10px;
                    margin-bottom: 12px;
                `;

                card.appendChild(photo);
            }

            const heading = document.createElement("h3");
            heading.textContent = person.name;
            card.appendChild(heading);

            const details = [
                ["Age", person.age],
                ["Gender", person.gender],
                ["Height", person.height],
                ["Last Known Location", person.lastKnownLocation],
                ["Clothing", person.clothing],
                ["Identifying Features", person.description],
                ["Status", person.status]
            ];

            details.forEach(([label, value]) => {
                if (value === undefined || value === "") return;

                const paragraph = document.createElement("p");
                paragraph.textContent = label + ": " + value;
                card.appendChild(paragraph);
            });

            if (person.status === "Missing") {
                pendingRequests(person).forEach(request => {
                    const panel = document.createElement("div");

                    panel.style.cssText = `
                        background: #fff7ed;
                        border: 1px solid #fdba74;
                        padding: 12px;
                        border-radius: 8px;
                        margin: 12px 0;
                    `;

                    const title = document.createElement("h4");
                    setInterfaceText(title, "Pending Safety Verification");
                    title.style.color = "#c2410c";

                    const sender = document.createElement("p");
                    sender.textContent =
                        "Requested by: " +
                        request.requesterName +
                        " (" + request.requesterRole + ")";

                    const info = document.createElement("p");
                    info.textContent = request.details;

                    const approve = createButton(
                        "Approve",
                        "#15803d",
                        () => reviewRequest(person, request, true)
                    );

                    const reject = createButton(
                        "Reject",
                        "#dc2626",
                        () => reviewRequest(person, request, false)
                    );

                    panel.append(
                        title,
                        sender,
                        info,
                        approve,
                        reject
                    );

                    card.appendChild(panel);
                });
            }

            const deleteButton = createButton(
                "Remove Report",
                "#dc2626",
                () => {
                    if (!isAdmin()) return;

                    if (!confirm(
                        "Permanently remove this report?"
                    )) return;

                    const latest = getReports();
                    const index = findReport(latest, person);

                    if (index === -1) {
                        renderReports();
                        return;
                    }

                    latest.splice(index, 1);

                    if (!saveReports(latest)) return;

                    message.textContent =
                        "Report removed successfully.";

                    renderReports();
                }
            );

            card.appendChild(deleteButton);

            reportList.appendChild(card);
        });
    }

    filter.addEventListener("change", renderReports);

    window.addEventListener("storage", event => {
        if (event.key === "missingPersons") {
            renderReports();
        }
    });

    renderReports();
})();
