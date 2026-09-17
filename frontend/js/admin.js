const alertForm = document.getElementById("alertForm");
const alertMessage = document.getElementById("alertMessage");

if (alertForm) {
    alertForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const title = document.getElementById("alertTitle").value;
        const type = document.getElementById("alertType").value;
        const location = document.getElementById("alertLocation").value;
        const description = document.getElementById("alertDescription").value;

        const alert = {
            title,
            type,
            location,
            description,
            verified: true,
            createdAt: new Date().toISOString()
        };

        const existingAlerts =
            JSON.parse(localStorage.getItem("crisisAlerts")) || [];

        existingAlerts.push(alert);

        localStorage.setItem(
            "crisisAlerts",
            JSON.stringify(existingAlerts)
        );

        alertMessage.textContent =
            "Prototype verified alert published successfully.";

        alertForm.reset();
    });
}