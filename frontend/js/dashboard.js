const currentUser =
    JSON.parse(localStorage.getItem("currentPrototypeUser"));


if (!currentUser) {
    window.location.href = "login.html";
} else {

    // Display logged-in user's name
    const userName = document.getElementById("userName");

    if (userName) {
        userName.textContent = currentUser.name;
    }

        // Show registration confirmation for volunteers
    const volunteerCard =
        document.getElementById("volunteerCard");

    if (volunteerCard) {
        volunteerCard.hidden = currentUser.role !== "responder";
    }

    // Hide admin features from normal users
    const adminOnlyElements =
        document.querySelectorAll(".admin-only");

    if (currentUser.role !== "admin") {
        adminOnlyElements.forEach(function (element) {
            element.style.display = "none";
        });
    }


    // Display help requests
    const requestList =
        document.getElementById("requestList");

    const allRequests =
    JSON.parse(localStorage.getItem("helpRequests")) || [];

const requests = allRequests.filter(function (request) {
    return request.userEmail === currentUser.email;
});


const userRequestIndexes = [];

allRequests.forEach(function (request, originalIndex) {
    if (request.userEmail === currentUser.email) {
        userRequestIndexes.push(originalIndex);
    }
});



    if (requestList && requests.length > 0) {

        requestList.innerHTML = "";

        requests.forEach(function (request, index) {

            const card = document.createElement("div");

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


            
const editButton = document.createElement("button");

editButton.type = "button";
editButton.textContent = "Edit Request";

if (request.status === "Completed" ||
    request.status === "Canceled") {
    editButton.disabled = true;
}

editButton.addEventListener("click", function () {
    const newLocation = prompt(
        "Update location:",
        request.location
    );

    if (newLocation === null) return;

    const newUrgency = prompt(
        "Update urgency (Low, Medium, High):",
        request.urgency
    );

    if (newUrgency === null) return;

    const newDescription = prompt(
        "Update description:",
        request.description
    );

    if (newDescription === null) return;

    const location = newLocation.trim();
    const urgency = newUrgency.trim();
    const description = newDescription.trim();

    if (!location || !description ||
        !["Low", "Medium", "High"].includes(urgency)) {
        alert(
            "Enter a location, description, and valid urgency."
        );
        return;
    }

    const allRequests =
        JSON.parse(localStorage.getItem("helpRequests")) || [];

    

const originalIndex = userRequestIndexes[index];


    
if (
    Number.isInteger(originalIndex) &&
    allRequests[originalIndex] &&
    allRequests[originalIndex].userEmail === currentUser.email &&
    allRequests[originalIndex].assistance === request.assistance &&
    allRequests[originalIndex].location === request.location &&
    allRequests[originalIndex].urgency === request.urgency &&
    allRequests[originalIndex].description === request.description
) {

        allRequests[originalIndex].location = location;
        allRequests[originalIndex].urgency = urgency;
        allRequests[originalIndex].description = description;

        localStorage.setItem(
            "helpRequests",
            JSON.stringify(allRequests)
        );

        window.location.reload();
    }
});

card.appendChild(editButton);


const cancelButton = document.createElement("button");
cancelButton.type = "button";
cancelButton.textContent = "Cancel Request";

// Completed and canceled requests cannot be canceled
const currentStatus = request.status || "Pending";

if (currentStatus === "Completed" ||
    currentStatus === "Canceled") {
    cancelButton.disabled = true;
}

cancelButton.addEventListener("click", function () {
    const confirmed = confirm(
        "Are you sure you want to cancel this help request?"
    );

    if (!confirmed) return;

    const savedRequests =
        JSON.parse(localStorage.getItem("helpRequests")) || [];

    const originalIndex = userRequestIndexes[index];
    const savedRequest = savedRequests[originalIndex];

    if (
        !Number.isInteger(originalIndex) ||
        !savedRequest ||
        savedRequest.userEmail !== currentUser.email ||
        savedRequest.createdAt !== request.createdAt ||
        savedRequest.location !== request.location ||
        savedRequest.description !== request.description ||
        !["Pending", "In Progress"].includes(
            savedRequest.status || "Pending"
        )
    ) {
        alert("Request has changed. Please refresh the page.");
        return;
    }

    savedRequest.status = "Canceled";
    savedRequest.updatedAt = new Date().toISOString();

    localStorage.setItem(
        "helpRequests",
        JSON.stringify(savedRequests)
    );

    window.location.reload();
});

card.appendChild(cancelButton);



            requestList.appendChild(card);
        });
    }


    // Logout
    const logoutButton =
        document.getElementById("logoutButton");

    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                localStorage.removeItem(
                    "currentPrototypeUser"
                );

                window.location.href = "login.html";
            }
        );
    }
}
