const currentUser =
    JSON.parse(localStorage.getItem("currentPrototypeUser"));

if (!currentUser) {
    window.location.href = "login.html";
}

const userName = document.getElementById("userName");

if (currentUser) {
    userName.textContent = currentUser.name;
}


const requestList = document.getElementById("requestList");

const requests =
    JSON.parse(localStorage.getItem("helpRequests")) || [];

if (requests.length > 0) {

    requestList.innerHTML = "";

    requests.forEach(function (request, index) {

        const card = document.createElement("div");

        card.className = "card";

        card.innerHTML = `
            <h3>Request #${index + 1}</h3>

            <p>
                <strong>Assistance:</strong>
                ${request.assistance}
            </p>

            <p>
                <strong>Location:</strong>
                ${request.location}
            </p>

            <p>
                <strong>Urgency:</strong>
                ${request.urgency}
            </p>

            <p>
                <strong>Description:</strong>
                ${request.description}
            </p>

            <p>
                <strong>Status:</strong>
                Pending
            </p>
        `;

        requestList.appendChild(card);
    });
}


const logoutButton =
    document.getElementById("logoutButton");

logoutButton.addEventListener("click", function (event) {

    event.preventDefault();

    localStorage.removeItem("currentPrototypeUser");

    window.location.href = "login.html";
});