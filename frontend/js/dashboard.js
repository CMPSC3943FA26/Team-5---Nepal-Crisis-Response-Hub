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
    if (requestList && requests.length > 0) {

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