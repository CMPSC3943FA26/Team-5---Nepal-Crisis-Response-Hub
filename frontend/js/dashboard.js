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
    const volunteerCard = document.getElementById("volunteerCard");

    if (volunteerCard) {
        volunteerCard.hidden = currentUser.role !== "responder";
    }

    
const responderRequestsSection =
    document.getElementById("responderRequestsSection");

if (responderRequestsSection) {
    responderRequestsSection.hidden =
        currentUser.role !== "responder";
}


const assignedRequestsSection =
    document.getElementById("assignedRequestsSection");

if (assignedRequestsSection) {
    assignedRequestsSection.hidden =
        currentUser.role !== "responder";
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

    // Calculate request statistics for the dashboard
const myRequests = allRequests.filter(function (request) {
    return request.userEmail === currentUser.email;
});

const requestSummary = {
    total: myRequests.length,
    pending: myRequests.filter(r => !r.status || r.status === "Pending").length,
    inProgress: myRequests.filter(r => r.status === "In Progress").length,
    completed: myRequests.filter(r => r.status === "Completed").length,
    canceled: myRequests.filter(r => r.status === "Canceled").length
};

const summaryContainer = document.createElement("div");
summaryContainer.className = "card";

const summaryHeading = document.createElement("h3");
setInterfaceText(summaryHeading, "My Request Summary");
summaryContainer.appendChild(summaryHeading);

[
    ["Total Requests", requestSummary.total],
    ["Pending", requestSummary.pending],
    ["In Progress", requestSummary.inProgress],
    ["Completed", requestSummary.completed],
    ["Canceled", requestSummary.canceled]
].forEach(function (item) {
    const paragraph = document.createElement("p");
    setInterfaceText(paragraph, item[0]);
    paragraph.append(": " + item[1]);
    summaryContainer.appendChild(paragraph);
});

const dashboardRequestList = document.getElementById("requestList");

if (dashboardRequestList && dashboardRequestList.parentNode) {
    dashboardRequestList.parentNode.insertBefore(
        summaryContainer,
        dashboardRequestList
    );
}

    
const assignedRequestList =
    document.getElementById("assignedRequestList");

if (currentUser.role === "responder" && assignedRequestList) {
    assignedRequestList.replaceChildren();

    const myAssignedRequests = allRequests.filter(function (request) {
        return request.assignedResponderEmail === currentUser.email;
    });

    if (myAssignedRequests.length === 0) {
        const message = document.createElement("p");
        message.textContent = "No requests assigned to you yet.";
        assignedRequestList.appendChild(message);
    } else {
        myAssignedRequests.forEach(function (request) {
            const card = document.createElement("article");
            card.className = "card";

            const heading = document.createElement("h3");
            heading.textContent =
                request.assistance || "Emergency Help Request";

            const details = [
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
                    document.createTextNode(detail[1] || "Not provided")
                );

                card.appendChild(paragraph);
            });

            card.prepend(heading);

            

card.appendChild(createResponseTimeline(request));

card.appendChild(
    createResponseProgressButton(request)
);



if (
    request.coordinates &&
    typeof request.coordinates.latitude === "number" &&
    typeof request.coordinates.longitude === "number"
) {
    const sharedLocation = document.createElement("p");

    sharedLocation.textContent =
        "Shared GPS Location: " +
        request.coordinates.latitude.toFixed(6) +
        ", " +
        request.coordinates.longitude.toFixed(6);

    card.appendChild(sharedLocation);
}


const messagesSection = document.createElement("div");

const messagesHeading = document.createElement("h4");
messagesHeading.textContent = "Messages From Requester";
messagesSection.appendChild(messagesHeading);

const requesterMessages = Array.isArray(request.messages)
    ? request.messages.filter(function (message) {
        return (
            message.senderEmail === request.userEmail &&
            message.recipientEmail === currentUser.email
        );
    })
    : [];

if (requesterMessages.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent = "No messages from requester yet.";
    messagesSection.appendChild(emptyMessage);
} else {
    requesterMessages.forEach(function (message) {
        const paragraph = document.createElement("p");

        const date = message.createdAt
            ? new Date(message.createdAt).toLocaleString()
            : "Date unavailable";

        paragraph.textContent = message.text + " — " + date;
        messagesSection.appendChild(paragraph);
    });
}

card.appendChild(messagesSection);
card.appendChild(createRequestNotes(request));

            card.append(createRequestSubmitter(request));
            assignedRequestList.appendChild(card);
        });
    }
}


    
const responderRequestList =
    document.getElementById("responderRequestList");

if (currentUser.role === "responder" && responderRequestList) {
    responderRequestList.replaceChildren();

const availableCount = allRequests.filter(r =>
    !r.assignedResponderEmail &&
    (r.status || "Pending") === "Pending"
).length;

const activeCount = allRequests.filter(r =>
    r.assignedResponderEmail === currentUser.email &&
    ["Pending", "In Progress"].includes(r.status || "Pending")
).length;

const completedCount = allRequests.filter(r =>
    r.assignedResponderEmail === currentUser.email &&
    r.status === "Completed"
).length;

const statsContainer = document.createElement("div");

statsContainer.style.cssText = `
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 15px;
    margin: 20px 0;
`;

[
    ["Available Requests", availableCount, "#dc2626"],
    ["Active Responses", activeCount, "#d97706"],
    ["Completed Responses", completedCount, "#15803d"],
    ["Total Assigned", allRequests.filter(r =>
        r.assignedResponderEmail === currentUser.email
    ).length, "#2563eb"]
].forEach(([label, count, color]) => {
    const stat = document.createElement("div");

    stat.style.cssText = `
        background: white;
        border: 1px solid #e2e8f0;
        border-top: 4px solid ${color};
        border-radius: 10px;
        padding: 20px;
        text-align: center;
        box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    `;

    const number = document.createElement("h2");
    number.textContent = count;
    number.style.color = color;

    const title = document.createElement("p");
    setInterfaceText(title, label);

    stat.append(number, title);
    statsContainer.appendChild(stat);
});

responderRequestList.before(statsContainer);

    if (allRequests.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.textContent = "No help requests available.";
        responderRequestList.appendChild(emptyMessage);
    } else {
        

const urgencyPriority = {
    "Critical": 4,
    "High": 3,
    "Medium": 2,
    "Low": 1
};

allRequests
    .map((request, index) => ({ request, index }))
    .filter(({ request }) =>
        !request.assignedResponderEmail &&
        (request.status || "Pending") === "Pending"
    )
    .sort((a, b) =>
        (urgencyPriority[b.request.urgency] || 0) -
        (urgencyPriority[a.request.urgency] || 0)
    )
    .forEach(function ({ request, index }) {
    if (request.status === "Canceled") {
        return;
    }

    
const isAssignedToMe =
    request.assignedResponderEmail === currentUser.email;

const assignmentStatus = document.createElement("p");

if (isAssignedToMe) {
    assignmentStatus.textContent = "Assignment: Assigned to you";
    assignmentStatus.style.color = "green";
} else if (request.assignedResponderEmail) {
    assignmentStatus.textContent =
        "Assignment: Assigned to another responder";
} else {
    assignmentStatus.textContent = "Assignment: Unassigned";
}


            const card = document.createElement("article");
            card.className = "card";

            const heading = document.createElement("h3");
            heading.textContent = "Request #" + (index + 1);
            card.appendChild(heading);

            
const registeredUsers =
    JSON.parse(localStorage.getItem("prototypeUsers") || "[]");

const assignedResponder = registeredUsers.find(function (user) {
    return user.role === "responder" &&
        user.email === request.assignedResponderEmail;
});

const assignedResponderName = assignedResponder
    ? assignedResponder.name || "Registered Responder"
    : request.assignedResponderEmail
        ? "Assigned Responder"
        : "Not assigned";


        const details = [
    ["Assistance", request.assistance],
    ["Location", request.location],
    ["Urgency", request.urgency],
    ["Description", request.description],
    ["Status", request.status || "Pending"],
    ["Assigned Responder", assignedResponderName]
];


            details.forEach(function (detail) {
                const paragraph = document.createElement("p");
                const label = document.createElement("strong");

                label.textContent = detail[0] + ": ";
                paragraph.appendChild(label);
                paragraph.appendChild(
                    document.createTextNode(detail[1] || "Not provided")
                );

                card.appendChild(paragraph);
            });

card.appendChild(assignmentStatus);


// Allow responders to accept unassigned requests
if (
    !request.assignedResponderEmail &&
    (request.status || "Pending") === "Pending"
) {
    const acceptButton = document.createElement("button");
    acceptButton.type = "button";

if (getResponderAvailability(currentUser.email) !== "Available") {
    acceptButton.disabled = true;
    acceptButton.style.opacity = "0.5";
    acceptButton.title =
        "Change your availability to Available to accept requests.";
}

setInterfaceText(acceptButton, "Accept Request");    acceptButton.style.backgroundColor = "#15803d";
    acceptButton.style.color = "white";
    acceptButton.style.marginTop = "10px";

    acceptButton.addEventListener("click", function () {

if (getResponderAvailability(currentUser.email) !== "Available") {
    alert("You must be available to accept emergency requests.");
    return;
}

        const session = JSON.parse(
            localStorage.getItem("currentPrototypeUser") || "null"
        );

        if (!session || session.role !== "responder" ||
            session.email !== currentUser.email) {
            alert("Responder access required.");
            return;
        }

        const savedRequests = JSON.parse(
            localStorage.getItem("helpRequests") || "[]"
        );

        const selectedRequest = savedRequests[index];

        if (
            !selectedRequest ||
            selectedRequest.createdAt !== request.createdAt ||
            selectedRequest.userEmail !== request.userEmail ||
            selectedRequest.assignedResponderEmail ||
            (selectedRequest.status || "Pending") !== "Pending"
        ) {
            alert("This request is no longer available.");
            window.location.reload();
            return;
        }

        selectedRequest.assignedResponderEmail = session.email;
        selectedRequest.status = "In Progress";
        selectedRequest.responseStage = 1;
        selectedRequest.acceptedAt = new Date().toISOString();
        selectedRequest.updatedAt = new Date().toISOString();

        localStorage.setItem(
            "helpRequests",
            JSON.stringify(savedRequests)
        );

        alert("Emergency request accepted successfully!");
        window.location.reload();
    });

    card.appendChild(acceptButton);
}

            responderRequestList.appendChild(card);
        });
    }
}


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


const registeredUsers =
    JSON.parse(localStorage.getItem("prototypeUsers") || "[]");

const assignedResponder = registeredUsers.find(function (user) {
    return user.role === "responder" &&
        user.email === request.assignedResponderEmail;
});

const assignedResponderName = assignedResponder
    ? assignedResponder.name || "Registered Responder"
    : request.assignedResponderEmail
        ? "Assigned Responder"
        : "Not assigned";


const details = [
    ["Assistance", request.assistance],
    ["Location", request.location],
    ["Urgency", request.urgency],
    ["Description", request.description],
    ["Status", request.status || "Pending"],
    ["Assigned Responder", assignedResponderName]
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
setInterfaceText(editButton, "Edit Request");

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

        if (location !== request.location) {
            allRequests[originalIndex].coordinates = null;
        }
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


if (
    request.assignedResponderEmail &&
    !["Completed", "Canceled"].includes(request.status)
) {
    const contactButton = document.createElement("button");
    contactButton.type = "button";
    setInterfaceText(contactButton, "Contact Responder");

    contactButton.addEventListener("click", function () {
        const messageText = prompt(
            "Enter a message for your assigned responder:"
        );

        if (messageText === null) return;

        const trimmedMessage = messageText.trim();

        if (!trimmedMessage) {
            alert("Message cannot be empty.");
            return;
        }

        const savedRequests = JSON.parse(
            localStorage.getItem("helpRequests") || "[]"
        );

        const originalIndex = userRequestIndexes[index];
        const savedRequest = savedRequests[originalIndex];

        if (
            !savedRequest ||
            savedRequest.userEmail !== currentUser.email ||
            savedRequest.assignedResponderEmail !==
                request.assignedResponderEmail ||
            ["Completed", "Canceled"].includes(savedRequest.status)
        ) {
            alert("Request or assignment has changed. Refresh the page.");
            return;
        }

        if (!Array.isArray(savedRequest.messages)) {
            savedRequest.messages = [];
        }

        savedRequest.messages.push({
            senderEmail: currentUser.email,
            recipientEmail: savedRequest.assignedResponderEmail,
            text: trimmedMessage,
            createdAt: new Date().toISOString()
        });

        localStorage.setItem(
            "helpRequests",
            JSON.stringify(savedRequests)
        );

        alert("Prototype message saved for your assigned responder.");
        window.location.reload();
    });

    card.appendChild(contactButton);
}

card.appendChild(createResponseTimeline(request));


card.appendChild(editButton);


const cancelButton = document.createElement("button");
cancelButton.type = "button";
setInterfaceText(cancelButton, "Cancel Request");

// Completed and canceled requests cannot be canceled
const currentStatus = request.status || "Pending";

if (currentStatus === "Completed" ||
    currentStatus === "Canceled") {
    cancelButton.disabled = true;
}

cancelButton.addEventListener("click", function () {
    const confirmed = confirm(
        translateLabel("Are you sure you want to cancel this help request?")
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
setInterfaceText(notesButton, "Add Note");

const notesStatus = request.status || "Pending";

if (notesStatus === "Completed" || notesStatus === "Canceled") {
    notesButton.disabled = true;
}

notesButton.addEventListener("click", function () {
    const newNote = prompt(
        translateLabel("Enter additional information about your request:")
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



card.appendChild(createRequestNotes(request));



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
    setInterfaceText(viewButton, "View Details");
    viewButton.setAttribute("aria-expanded", "false");

    viewButton.addEventListener("click", function () {
        const opening = detailsPanel.hidden;

        detailsPanel.hidden = !opening;
        setInterfaceText(viewButton, opening ? "Hide Details" : "View Details");

        viewButton.setAttribute(
            "aria-expanded",
            String(opening)
        );
    });

    card.appendChild(historyHeading);
    card.appendChild(historyStatus);
    card.appendChild(viewButton);
    card.appendChild(detailsPanel);

    card.append(createRequestSubmitter(request));
    requestHistoryList.appendChild(card);
} else {
    card.append(createRequestSubmitter(request));
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

const incidentReportForm =
    document.getElementById("incidentReportForm");

if (incidentReportForm) {
    incidentReportForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const incidentType =
            document.getElementById("incidentType").value;

        const incidentLocation =
            document.getElementById("incidentLocation").value.trim();

        const incidentDescription =
            document.getElementById("incidentDescription").value.trim();

        const incidentReportMessage =
            document.getElementById("incidentReportMessage");

        if (!incidentType || !incidentLocation || !incidentDescription) {
            incidentReportMessage.textContent =
                "Please complete all fields.";
            return;
        }

        const currentSession =
            JSON.parse(localStorage.getItem("currentPrototypeUser"));

        if (!currentSession || !currentSession.email) {
            incidentReportMessage.textContent =
                "Please log in to submit an incident report.";
            return;
        }

        const reports =
            JSON.parse(localStorage.getItem("incidentReports") || "[]");

        reports.push({
            type: incidentType,
            location: incidentLocation,
            description: incidentDescription,
            reportedBy: currentSession.email,
            status: "Reported",
            createdAt: new Date().toISOString()
        });

        localStorage.setItem(
            "incidentReports",
            JSON.stringify(reports)
        );

        incidentReportMessage.textContent =
            "Simulation incident report submitted successfully.";

        incidentReportForm.reset();
    });
}



function createRequestNotes(request) {
    const notesSection = document.createElement("div");

    const notesHeading = document.createElement("h4");
    setInterfaceText(notesHeading, "Additional Notes");

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
        setInterfaceText(noNotes, "No additional notes yet.");
        notesSection.appendChild(noNotes);
    }

    return notesSection;
}
