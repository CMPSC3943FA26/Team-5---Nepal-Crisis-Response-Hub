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
