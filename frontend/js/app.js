const helpForm = document.getElementById("helpForm");
const formMessage = document.getElementById("formMessage");

helpForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const assistance = document.getElementById("assistance").value;
    const location = document.getElementById("location").value;
    const urgency = document.getElementById("urgency").value;
    const description = document.getElementById("description").value;

    const request = {
        assistance,
        location,
        urgency,
        description,
        createdAt: new Date().toISOString()
    };

    const existingRequests =
        JSON.parse(localStorage.getItem("helpRequests")) || [];

    existingRequests.push(request);

    localStorage.setItem(
        "helpRequests",
        JSON.stringify(existingRequests)
    );

    formMessage.textContent =
        "Prototype request saved successfully in this browser.";

    helpForm.reset();
});
const alertsContainer = document.getElementById("alertsContainer");

if (alertsContainer) {
    const publishedAlerts =
        JSON.parse(localStorage.getItem("crisisAlerts")) || [];

    publishedAlerts.forEach(function (crisisAlert) {
        const alertCard = document.createElement("article");
        alertCard.classList.add("card");

        const badge = document.createElement("span");
        badge.classList.add("badge");
        badge.textContent = "Verified Alert";

        const title = document.createElement("h3");
        title.textContent = crisisAlert.title;

        const location = document.createElement("p");
        location.textContent = "Location: " + crisisAlert.location;

        const type = document.createElement("p");
        type.textContent = "Type: " + crisisAlert.type;

        const description = document.createElement("p");
        description.textContent = crisisAlert.description;

        alertCard.appendChild(badge);
        alertCard.appendChild(title);
        alertCard.appendChild(location);
        alertCard.appendChild(type);
        alertCard.appendChild(description);

        alertsContainer.appendChild(alertCard);
    });
}