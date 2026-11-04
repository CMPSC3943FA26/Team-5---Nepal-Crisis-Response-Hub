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
    coordinates: sharedCoordinates
        ? { ...sharedCoordinates }
        : null,
    status: "Pending",
    userEmail: currentRequestUser
        ? currentRequestUser.email
        : null,
    createdAt: new Date().toISOString()
};

    const existingRequests =
        JSON.parse(localStorage.getItem("helpRequests")) || [];

    existingRequests.push(request);

    localStorage.setItem("helpRequests",
        JSON.stringify(existingRequests)
    );

    formMessage.textContent =
        "Prototype request saved successfully in this browser.";

    helpForm.reset();
    sharedCoordinates = null;
});


const emergencyNotifications =
    document.getElementById("emergencyNotifications");

const notificationList =
    document.getElementById("notificationList");

if (emergencyNotifications && notificationList) {
    const alerts =
        JSON.parse(localStorage.getItem("crisisAlerts") || "[]");

    const seenAlerts =
        JSON.parse(localStorage.getItem("seenEmergencyAlerts") || "[]");

    notificationList.replaceChildren();

    alerts.forEach(function (crisisAlert) {
        const alertId =
            crisisAlert.createdAt + "|" + crisisAlert.title;

        if (seenAlerts.includes(alertId)) {
            return;
        }

        const notification = document.createElement("div");
        notification.className = "card";

        const title = document.createElement("h4");
        title.textContent = crisisAlert.title || "Emergency Alert";

        const location = document.createElement("p");
        location.textContent =
            "Location: " + (crisisAlert.location || "Not specified");

        const severity = document.createElement("p");
        severity.textContent =
            "Severity: " + (crisisAlert.severity || "Not specified");

        const openButton = document.createElement("button");
        openButton.type = "button";
        openButton.textContent = "View Alert";

        openButton.addEventListener("click", function () {
            const currentSeen =
                JSON.parse(
                    localStorage.getItem("seenEmergencyAlerts") || "[]"
                );

            if (!currentSeen.includes(alertId)) {
                currentSeen.push(alertId);

                localStorage.setItem(
                    "seenEmergencyAlerts",
                    JSON.stringify(currentSeen)
                );
            }

            
const matchingAlert = Array.from(
    document.querySelectorAll("[data-notification-id]")
).find(function (card) {
    return card.dataset.notificationId === alertId;
});

if (matchingAlert) {
    // Clear filters so the related alert is visible
    const typeFilter =
        document.getElementById("alertTypeFilter");

    const locationFilter =
        document.getElementById("alertLocationFilter");

    if (typeFilter) {
        typeFilter.value = "all";
        typeFilter.dispatchEvent(new Event("change"));
    }

    if (locationFilter) {
        locationFilter.value = "";
        locationFilter.dispatchEvent(new Event("input"));
    }

    
matchingAlert.setAttribute("tabindex", "-1");

matchingAlert.focus({ preventScroll: true });

matchingAlert.style.outline = "3px solid #2563eb";

matchingAlert.scrollIntoView({
    behavior: "instant",
    block: "center"
});

} else {
    window.location.hash = "alerts";
}

            notification.remove();

            if (!notificationList.children.length) {
                emergencyNotifications.hidden = true;
            }
        });

        notification.append(title, location, severity, openButton);
        notificationList.appendChild(notification);
    });

    emergencyNotifications.hidden =
        notificationList.children.length === 0;
}


const alertsContainer = document.getElementById("alertsContainer");

if (alertsContainer) {
    const publishedAlerts =
        JSON.parse(localStorage.getItem("crisisAlerts")) || [];

    publishedAlerts.forEach(function (crisisAlert) {
        const alertCard = document.createElement("article");
        alertCard.classList.add("card");

        
const alertId =
    crisisAlert.createdAt + "|" + crisisAlert.title;

alertCard.dataset.notificationId = alertId;

        
        alertCard.dataset.alertType = crisisAlert.type || "Other";

        
        alertCard.dataset.alertLocation = crisisAlert.location || "";



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

        
const detailsButton = document.createElement("button");
detailsButton.type = "button";
detailsButton.textContent = "View Details";

const detailsContainer = document.createElement("div");
detailsContainer.hidden = true;

function addDetail(label, value) {
    const paragraph = document.createElement("p");
    const strong = document.createElement("strong");

    strong.textContent = label + ": ";
    paragraph.appendChild(strong);
    paragraph.appendChild(
        document.createTextNode(value || "Not provided")
    );

    detailsContainer.appendChild(paragraph);
}

addDetail("Verification", "Prototype verified alert");
addDetail("Type", crisisAlert.type);
addDetail("Location", crisisAlert.location);
addDetail("Severity", crisisAlert.severity);
addDetail("Published",
    crisisAlert.createdAt
        ? new Date(crisisAlert.createdAt).toLocaleString()
        : "Not available"
);


if (crisisAlert.updatedAt) {
    addDetail(
        "Last Updated",
        new Date(crisisAlert.updatedAt).toLocaleString()
    );
}


addDetail("Description", crisisAlert.description);
addDetail("Safety Instructions", crisisAlert.safetyInstructions);

detailsButton.setAttribute("aria-expanded", "false");

detailsButton.addEventListener("click", function () {
    const isOpening = detailsContainer.hidden;

    detailsContainer.hidden = !isOpening;
    detailsButton.textContent =
        isOpening ? "Hide Details" : "View Details";
    detailsButton.setAttribute(
        "aria-expanded",
        String(isOpening)
    );
});


      
    alertCard.appendChild(badge);
    alertCard.appendChild(title);
    alertCard.appendChild(location);
    alertCard.appendChild(severity);
    alertCard.appendChild(detailsButton);
    alertCard.appendChild(detailsContainer);

    alertsContainer.appendChild(alertCard);


    });
}


            const alertTypeFilter = document.getElementById("alertTypeFilter");

            if (alertTypeFilter && alertsContainer) {
                // Assign types to the two existing homepage demo alerts.
                const demoCards = alertsContainer.querySelectorAll(
                    "article.card:not([data-alert-type])"
                );

                if (demoCards[0]) {
                    demoCards[0].dataset.alertType = "Flood";
                }

                if (demoCards[1]) {
                    demoCards[1].dataset.alertType = "Other";
                }

                
            const alertLocationFilter =
                document.getElementById("alertLocationFilter");

            const clearAlertLocation =
                document.getElementById("clearAlertLocation");

            function filterCrisisAlerts() {
                const selectedType = alertTypeFilter.value;

                const searchLocation = alertLocationFilter
                    ? alertLocationFilter.value.trim().toLowerCase()
                    : "";

                const cards =
                    alertsContainer.querySelectorAll("article.card");

                let visibleCount = 0;

                cards.forEach(function (card) {
                    const matchesType =
                        selectedType === "all" ||
                        card.dataset.alertType === selectedType;

                    const matchesLocation =
                        !searchLocation ||
                        (card.dataset.alertLocation || "")
                            .toLowerCase()
                            .includes(searchLocation);

                    
                const isVisible = matchesType && matchesLocation;

                        card.style.display = isVisible ? "" : "none";

                if (isVisible) {
                   visibleCount++;
                }

                });

                
                const noMatchingAlerts =
                    document.getElementById("noMatchingAlerts");

                if (noMatchingAlerts) {
                    noMatchingAlerts.hidden = visibleCount > 0;
                }


            }

            alertTypeFilter.addEventListener("change", filterCrisisAlerts);

            if (alertLocationFilter) {
                alertLocationFilter.addEventListener(
                    "input",
                    filterCrisisAlerts
                );
            }

            if (clearAlertLocation && alertLocationFilter) {
                clearAlertLocation.addEventListener("click", function () {
                    alertLocationFilter.value = "";
                    filterCrisisAlerts();
                });
            }

            filterCrisisAlerts();

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
        description: "Sample hospital resource for testing.",
        availability: "Available"
    },
    {
        name: "Demo Emergency Shelter - Pokhara",
        type: "shelter",
        location: "Pokhara",
        description: "Sample emergency shelter for testing.",
        availability: "Available"
    },
    {
        name: "Demo Relief Center - Chitwan",
        type: "relief",
        location: "Chitwan",
        description: "Sample relief center for testing.",
        availability: "Available"
    },
    {
        name: "Demo Hospital - Lalitpur",
        type: "hospital",
        location: "Lalitpur",
        description: "Sample hospital resource for testing.",
        availability: "Available"
    }
];


const savedResourceAvailability = JSON.parse(
    localStorage.getItem("resourceAvailability") || "{}"
);

emergencyResources.forEach(function (resource) {
    const savedStatus = savedResourceAvailability[resource.name];

    if (savedStatus === "Available" || savedStatus === "Unavailable") {
        resource.availability = savedStatus;
    }
});


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

        
const availability = document.createElement("p");

const availabilityStatus =
    resource.availability || "Unknown";

availability.textContent =
    "Availability: " + availabilityStatus;

availability.style.fontWeight = "bold";

if (availabilityStatus === "Available") {
    availability.style.color = "green";
} else if (availabilityStatus === "Unavailable") {
    availability.style.color = "red";
} else {
    availability.style.color = "gray";
}


        const demoLabel = document.createElement("p");
        demoLabel.textContent = "DEMO ONLY — Not a verified facility.";

        
card.append(title, location, type, description, availability, demoLabel);

        resourceResults.appendChild(card);
    });
}

if (resourceSearch && resourceType && resourceResults) {
    resourceSearch.addEventListener("input", renderResources);
    resourceType.addEventListener("change", renderResources);
    renderResources();
}

const useCurrentLocationButton =
    document.getElementById("useCurrentLocation");

const locationMessage =
    document.getElementById("locationMessage");

let sharedCoordinates = null;


const manualLocationInput =
    document.getElementById("location");

if (manualLocationInput) {
    manualLocationInput.addEventListener("input", function () {
        sharedCoordinates = null;

        if (locationMessage) {
            locationMessage.textContent =
                "Manual location entered. GPS coordinates will not be shared.";
        }
    });
}


if (useCurrentLocationButton && locationMessage) {
    useCurrentLocationButton.addEventListener("click", function () {
        if (!navigator.geolocation) {
            locationMessage.textContent =
                "Your browser does not support location sharing.";
            return;
        }

        locationMessage.textContent = "Requesting location permission...";

        navigator.geolocation.getCurrentPosition(
            function (position) {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                sharedCoordinates = {
                    latitude: latitude,
                    longitude: longitude
                };

                const locationInput =
                    document.getElementById("location");

                if (locationInput) {
                    locationInput.value =
                        latitude.toFixed(6) + ", " +
                        longitude.toFixed(6);
                }

                locationMessage.textContent =
                    "Location added. It will be shared when you submit your request.";
            },
            function () {
                sharedCoordinates = null;
                locationMessage.textContent =
                    "Location access unavailable or denied. You can enter your location manually.";
            },
            {
                enableHighAccuracy: false,
                timeout: 10000,
                maximumAge: 0
            }
        );
    });
}

const demoMissingPersons = [
    {
        name: "Demo Person A",
        lastKnownLocation: "Kathmandu",
        status: "Missing"
    },
    {
        name: "Demo Person B",
        lastKnownLocation: "Pokhara",
        status: "Located - Safe"
    },
    {
        name: "Demo Person C",
        lastKnownLocation: "Chitwan",
        status: "Missing"
    }
];

const missingPersonSearch =
    document.getElementById("missingPersonSearch");

const missingPersonResults =
    document.getElementById("missingPersonResults");

function renderMissingPersonResults() {
    if (!missingPersonSearch || !missingPersonResults) {
        return;
    }

    const searchText =
        missingPersonSearch.value.trim().toLowerCase();

    missingPersonResults.replaceChildren();

    if (!searchText) {
        const message = document.createElement("p");
        message.textContent =
            "Enter a name to search demonstration reports.";
        missingPersonResults.appendChild(message);
        return;
    }

    const reports = [
        ...demoMissingPersons,
        ...JSON.parse(localStorage.getItem("missingPersons") || "[]")
    ];

    const matches = reports.filter(function (person) {
        return typeof person.name === "string" &&
            person.name.toLowerCase().includes(searchText);
    });

    if (matches.length === 0) {
        const message = document.createElement("p");
        message.textContent = "No matching reports found.";
        missingPersonResults.appendChild(message);
        return;
    }

    matches.forEach(function (person) {
        const card = document.createElement("article");
        card.className = "card";

        const heading = document.createElement("h3");
        heading.textContent = person.name;

        const location = document.createElement("p");
        location.textContent =
            "Last Known Location: " +
            (person.lastKnownLocation || "Not provided");

        const status = document.createElement("p");
        status.textContent =
            "Reported Status: " + (person.status || "Missing");

        card.append(heading, location, status);
        
const loggedInUser = JSON.parse(
    localStorage.getItem("currentPrototypeUser") || "null"
);

const savedReports = JSON.parse(
    localStorage.getItem("missingPersons") || "[]"
);

const reportIndex = savedReports.findIndex(function (report) {
    return (
        report.createdAt === person.createdAt &&
        report.name === person.name &&
        report.lastKnownLocation === person.lastKnownLocation
    );
});

if (
    loggedInUser &&
    loggedInUser.role === "admin" &&
    reportIndex !== -1 &&
    person.status === "Missing"
) {
    const safeButton = document.createElement("button");
    safeButton.type = "button";
    safeButton.textContent = "Mark as Safe";

    safeButton.addEventListener("click", function () {
        const confirmed = confirm(
            "Mark this fictional person as located and safe?"
        );

        if (!confirmed) return;

        const latestReports = JSON.parse(
            localStorage.getItem("missingPersons") || "[]"
        );

        const latestReport = latestReports[reportIndex];

        if (
            !latestReport ||
            latestReport.createdAt !== person.createdAt ||
            latestReport.name !== person.name ||
            latestReport.status !== "Missing"
        ) {
            alert("Report has changed. Please refresh.");
            return;
        }

        latestReport.status = "Located - Safe";
        latestReport.updatedAt = new Date().toISOString();

        localStorage.setItem(
            "missingPersons",
            JSON.stringify(latestReports)
        );

        renderMissingPersonResults();
    });

    card.appendChild(safeButton);
}

        missingPersonResults.appendChild(card);
    });
}

if (missingPersonSearch && missingPersonResults) {
    missingPersonSearch.addEventListener(
        "input",
        renderMissingPersonResults
    );

    renderMissingPersonResults();
}

const missingPersonForm =
    document.getElementById("missingPersonForm");

if (missingPersonForm) {
    missingPersonForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name =
            document.getElementById("missingPersonName").value.trim();

        const lastKnownLocation =
            document.getElementById("missingPersonLocation").value.trim();

        const description =
            document.getElementById("missingPersonDescription").value.trim();

        const message =
            document.getElementById("missingPersonMessage");

        if (!name || !lastKnownLocation || !description) {
            message.textContent = "Please complete all fields.";
            return;
        }

        const reports = JSON.parse(
            localStorage.getItem("missingPersons") || "[]"
        );

        reports.push({
            name: name,
            lastKnownLocation: lastKnownLocation,
            description: description,
            status: "Missing",
            createdAt: new Date().toISOString()
        });

        localStorage.setItem(
            "missingPersons",
            JSON.stringify(reports)
        );

        message.textContent =
            "Fictional missing-person report saved successfully.";

        missingPersonForm.reset();

        // Refresh any existing search results
        if (typeof renderMissingPersonResults === "function") {
            renderMissingPersonResults();
        }
    });
}
