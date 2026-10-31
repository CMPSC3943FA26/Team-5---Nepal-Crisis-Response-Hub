const helpForm = document.getElementById("helpForm");
const formMessage = document.getElementById("formMessage");

helpForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const assistance = document.getElementById("assistance").value;
    const location = document.getElementById("location").value;
    const urgency = document.getElementById("urgency").value;
    const description = document.getElementById("description").value;

    const currentRequestUser =
    JSON.parse(localStorage.getItem("currentPrototypeUser"));

const request = {
    assistance,
    location,
    urgency,
    description,
    status: "Pending",
    userEmail: currentRequestUser
        ? currentRequestUser.email
        : null,
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

        
        const severity = document.createElement("p");
        severity.textContent =
            "Severity: " + (crisisAlert.severity || "Not specified");

        const description = document.createElement("p");
        description.textContent = crisisAlert.description;

        
        const safetyInstructions = document.createElement("p");

        safetyInstructions.textContent =
            "Safety Instructions: " +
            (crisisAlert.safetyInstructions || "Not provided");


const publishedDate = document.createElement("p");

publishedDate.textContent =
    "Published: " +
    (crisisAlert.createdAt
        ? new Date(crisisAlert.createdAt).toLocaleString()
        : "Not available");

        alertCard.appendChild(badge);
        alertCard.appendChild(title);
        alertCard.appendChild(location);
        alertCard.appendChild(type);
        alertCard.appendChild(severity);
        alertCard.appendChild(description);
        alertCard.appendChild(safetyInstructions);
        alertCard.appendChild(publishedDate);
        alertsContainer.appendChild(alertCard);

    });
}


 // Update homepage navigation based on login status
const authNavLink = document.getElementById("authNavLink");

if (authNavLink) {
    const loggedInUser = JSON.parse(
        localStorage.getItem("currentPrototypeUser")
    );

    if (loggedInUser) {
        authNavLink.textContent = "Dashboard";
        authNavLink.href = "dashboard.html";
    } else {
        authNavLink.textContent = "Login";
        authNavLink.href = "login.html";
    }
}

