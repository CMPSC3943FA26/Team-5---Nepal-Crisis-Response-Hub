const currentAdminUser =
    JSON.parse(localStorage.getItem("currentPrototypeUser"));

if (!currentAdminUser || currentAdminUser.role !== "admin") {
    window.location.href = "dashboard.html";
}
const alertForm = document.getElementById("alertForm");
const alertMessage = document.getElementById("alertMessage");
const publishedAlertsContainer =
    document.getElementById("publishedAlertsContainer");


function getAlerts() {
    return JSON.parse(localStorage.getItem("crisisAlerts")) || [];
}


function saveAlerts(alerts) {
    localStorage.setItem(
        "crisisAlerts",
        JSON.stringify(alerts)
    );
}


function renderPublishedAlerts() {
    if (!publishedAlertsContainer) {
        return;
    }

    publishedAlertsContainer.textContent = "";

    const alerts = getAlerts();

    if (alerts.length === 0) {
        const message = document.createElement("p");
        message.textContent = "No prototype alerts have been published.";
        publishedAlertsContainer.appendChild(message);
        return;
    }

    alerts.forEach(function (crisisAlert, index) {

        const card = document.createElement("article");
        card.classList.add("card");


        const badge = document.createElement("span");
        badge.classList.add("badge");
        badge.textContent = "Verified Alert";


        const title = document.createElement("h3");
        title.textContent = crisisAlert.title;


        const location = document.createElement("p");
        location.textContent =
            "Location: " + crisisAlert.location;


        const type = document.createElement("p");
        type.textContent =
            "Type: " + crisisAlert.type;


        const description = document.createElement("p");
        description.textContent =
            crisisAlert.description;


        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete Alert";

        deleteButton.addEventListener("click", function () {

            const alerts = getAlerts();

            alerts.splice(index, 1);

            saveAlerts(alerts);

            renderPublishedAlerts();
        });


        card.appendChild(badge);
        card.appendChild(title);
        card.appendChild(location);
        card.appendChild(type);
        card.appendChild(description);
        card.appendChild(deleteButton);

        publishedAlertsContainer.appendChild(card);
    });
}


if (alertForm) {

    alertForm.addEventListener("submit", function (event) {

        event.preventDefault();


        const title =
            document.getElementById("alertTitle").value;

        const type =
            document.getElementById("alertType").value;

        const location =
            document.getElementById("alertLocation").value;

        const description =
            document.getElementById("alertDescription").value;

        const severity =
            document.getElementById("alertSeverity").value;

            
        const safetyInstructions =
        document.getElementById("alertSafety").value;


        const alert = {
            title,
            type,
            severity,
            location,
            description,
            safetyInstructions,
            verified: true,
            createdAt: new Date().toISOString()
        };


        const existingAlerts = getAlerts();

        existingAlerts.push(alert);

        saveAlerts(existingAlerts);


        alertMessage.textContent =
            "Prototype verified alert published successfully.";


        alertForm.reset();

        renderPublishedAlerts();
    });
}


renderPublishedAlerts();

 
 // Display saved emergency help requests
const adminRequestList =
    document.getElementById("adminRequestList");

function renderAdminRequests() {
    if (!adminRequestList) {
        return;
    }

    adminRequestList.textContent = "";

    const requests =
        JSON.parse(localStorage.getItem("helpRequests")) || [];

    if (requests.length === 0) {
        const message = document.createElement("p");
        message.textContent = "No emergency requests found.";
        adminRequestList.appendChild(message);
        return;
    }

    requests.forEach(function (request, index) {
        const card = document.createElement("article");
        card.className = "card";

        const heading = document.createElement("h3");
        heading.textContent = "Request #" + (index + 1);
        card.appendChild(heading);

        const details = [
            ["Assistance", request.assistance],
            ["Location", request.location],
            ["Urgency", request.urgency],
            ["Description", request.description],
            ["Status", request.status || "Pending"]
        ];

        details.forEach(function (detail) {
            const paragraph = document.createElement("p");
            const label = document.createElement("strong");

            label.textContent = detail[0] + ": ";
            paragraph.appendChild(label);
            paragraph.appendChild(
                document.createTextNode(detail[1] || "")
            );
            card.appendChild(paragraph);
        });

const statusLabel = document.createElement("label");
statusLabel.textContent = "Update Status: ";

const statusSelect = document.createElement("select");

["Pending", "In Progress", "Completed"].forEach(function (status) {
    const option = document.createElement("option");
    option.value = status;
    option.textContent = status;
    statusSelect.appendChild(option);
});

statusSelect.value = request.status || "Pending";

statusSelect.addEventListener("change", function () {
    const allRequests =
        JSON.parse(localStorage.getItem("helpRequests")) || [];

    if (allRequests[index]) {
        allRequests[index].status = statusSelect.value;

        localStorage.setItem(
            "helpRequests",
            JSON.stringify(allRequests)
        );

        renderAdminRequests();
    }
});

statusLabel.appendChild(statusSelect);
card.appendChild(statusLabel);

        adminRequestList.appendChild(card);
    });
}

if (currentAdminUser && currentAdminUser.role === "admin") {
    renderAdminRequests();
}
