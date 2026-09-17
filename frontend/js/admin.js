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


        const alert = {
            title,
            type,
            location,
            description,
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