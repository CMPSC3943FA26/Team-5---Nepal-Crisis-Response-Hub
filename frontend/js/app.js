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


 // Prototype emergency resources
// Demonstration data only — not real-time facilities
const emergencyResources = [
    {
        name: "Demo Hospital - Kathmandu",
        type: "hospital",
        location: "Kathmandu",
        description: "Sample hospital resource for testing."
    },
    {
        name: "Demo Emergency Shelter - Pokhara",
        type: "shelter",
        location: "Pokhara",
        description: "Sample emergency shelter for testing."
    },
    {
        name: "Demo Relief Center - Chitwan",
        type: "relief",
        location: "Chitwan",
        description: "Sample relief center for testing."
    },
    {
        name: "Demo Hospital - Lalitpur",
        type: "hospital",
        location: "Lalitpur",
        description: "Sample hospital resource for testing."
    }
];

const resourceSearch = document.getElementById("resourceSearch");
const resourceType = document.getElementById("resourceType");
const resourceResults = document.getElementById("resourceResults");

function renderResources() {
    if (!resourceResults || !resourceSearch || !resourceType) {
        return;
    }

    const searchText = resourceSearch.value.trim().toLowerCase();
    const selectedType = resourceType.value;

    resourceResults.replaceChildren();

    if (!searchText && selectedType === "all") {
        const message = document.createElement("p");
        message.textContent =
            "Enter a location or select a resource type to search.";
        resourceResults.appendChild(message);
        return;
    }

    const matches = emergencyResources.filter(function (resource) {
        const matchesLocation =
            !searchText ||
            resource.location.toLowerCase().includes(searchText);

        const matchesType =
            selectedType === "all" ||
            resource.type === selectedType;

        return matchesLocation && matchesType;
    });

    if (matches.length === 0) {
        const message = document.createElement("p");
        message.textContent =
            "No matching demonstration resources found.";
        resourceResults.appendChild(message);
        return;
    }

    matches.forEach(function (resource) {
        const card = document.createElement("article");
        card.className = "card";

        const title = document.createElement("h3");
        title.textContent = resource.name;

        const location = document.createElement("p");
        location.textContent = "Location: " + resource.location;

        const type = document.createElement("p");
        type.textContent = "Type: " + resource.type;

        const description = document.createElement("p");
        description.textContent = resource.description;

        const demoLabel = document.createElement("p");
        demoLabel.textContent = "DEMO ONLY — Not a verified facility.";

        card.append(title, location, type, description, demoLabel);
        resourceResults.appendChild(card);
    });
}

if (resourceSearch && resourceType && resourceResults) {
    resourceSearch.addEventListener("input", renderResources);
    resourceType.addEventListener("change", renderResources);
    renderResources();
}
