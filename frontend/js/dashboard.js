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

        
const requestHistoryList =
    document.getElementById("requestHistoryList");


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

        
if (requestHistoryList) {
    requestHistoryList.replaceChildren();
}


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


const notesButton = document.createElement("button");
notesButton.type = "button";
notesButton.textContent = "Add Note";

const notesStatus = request.status || "Pending";

if (notesStatus === "Completed" || notesStatus === "Canceled") {
    notesButton.disabled = true;
}

notesButton.addEventListener("click", function () {
    const newNote = prompt(
        "Enter additional information about your request:"
    );

    if (newNote === null) return;

    const noteText = newNote.trim();

    if (!noteText) {
        alert("Note cannot be empty.");
        return;
    }

    const savedRequests =
        JSON.parse(localStorage.getItem("helpRequests") || "[]");

    const originalIndex = userRequestIndexes[index];
    const savedRequest = savedRequests[originalIndex];

    if (
        !Number.isInteger(originalIndex) ||
        !savedRequest ||
        savedRequest.userEmail !== currentUser.email ||
        savedRequest.assistance !== request.assistance ||
        savedRequest.location !== request.location ||
        savedRequest.description !== request.description ||
        !["Pending", "In Progress"].includes(
            savedRequest.status || "Pending"
        )
    ) {
        alert("Request has changed. Please refresh the page.");
        return;
    }

    if (!Array.isArray(savedRequest.notes)) {
        savedRequest.notes = [];
    }

    savedRequest.notes.push({
        text: noteText,
        createdAt: new Date().toISOString()
    });

    localStorage.setItem(
        "helpRequests",
        JSON.stringify(savedRequests)
    );

    window.location.reload();
});

card.appendChild(notesButton);



const notesSection = document.createElement("div");

const notesHeading = document.createElement("h4");
notesHeading.textContent = "Additional Notes";

notesSection.appendChild(notesHeading);

if (Array.isArray(request.notes) && request.notes.length > 0) {
    request.notes.forEach(function (note) {
        const noteParagraph = document.createElement("p");

        const noteDate = note.createdAt
            ? new Date(note.createdAt).toLocaleString()
            : "Date unavailable";

        noteParagraph.textContent =
            note.text + " — " + noteDate;

        notesSection.appendChild(noteParagraph);
    });
} else {
    const noNotes = document.createElement("p");
    noNotes.textContent = "No additional notes yet.";
    notesSection.appendChild(noNotes);
}

card.appendChild(notesSection);



const status = request.status || "Pending";


if (
    (status === "Completed" || status === "Canceled") &&
    requestHistoryList
) {
    // Move the existing request details into an expandable panel
    const detailsPanel = document.createElement("div");

    
    editButton.remove();
    cancelButton.remove();
    notesButton.remove();


    while (card.firstChild) {
        detailsPanel.appendChild(card.firstChild);
    }

    detailsPanel.hidden = true;

    const historyHeading = document.createElement("h3");
    historyHeading.textContent =
        "Request #" + (index + 1) + " — " + request.assistance;

    const historyStatus = document.createElement("p");
    historyStatus.textContent = "Status: " + status;

    const viewButton = document.createElement("button");
    viewButton.type = "button";
    viewButton.textContent = "View Details";
    viewButton.setAttribute("aria-expanded", "false");

    viewButton.addEventListener("click", function () {
        const opening = detailsPanel.hidden;

        detailsPanel.hidden = !opening;
        viewButton.textContent =
            opening ? "Hide Details" : "View Details";

        viewButton.setAttribute(
            "aria-expanded",
            String(opening)
        );
    });

    card.appendChild(historyHeading);
    card.appendChild(historyStatus);
    card.appendChild(viewButton);
    card.appendChild(detailsPanel);

    requestHistoryList.appendChild(card);
} else {
    requestList.appendChild(card);
}

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
