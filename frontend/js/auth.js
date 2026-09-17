const ADMIN_EMAIL = "test@example.com";
const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name =
            document.getElementById("registerName").value;

        const email =
            document.getElementById("registerEmail").value;

        const password =
            document.getElementById("registerPassword").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;

        const message =
            document.getElementById("registerMessage");

        if (password !== confirmPassword) {
            message.textContent =
                "Passwords do not match.";
            return;
        }

        const users =
            JSON.parse(localStorage.getItem("prototypeUsers")) || [];

        const existingUser =
            users.find(user => user.email === email);

        if (existingUser) {
            message.textContent =
                "A prototype account with this email already exists.";
            return;
        }

        users.push({
            name: name,
            email: email,
            password: password
        });

        localStorage.setItem(
            "prototypeUsers",
            JSON.stringify(users)
        );

        message.textContent =
            "Prototype account created successfully.";

        registerForm.reset();
    });
}


const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email =
            document.getElementById("loginEmail").value;

        const password =
            document.getElementById("loginPassword").value;

        const message =
            document.getElementById("loginMessage");

        const users =
            JSON.parse(localStorage.getItem("prototypeUsers")) || [];

        const user = users.find(
            account =>
                account.email === email &&
                account.password === password
        );

       if (user) {

    const loggedInUser = {
        ...user,
        role: user.email === ADMIN_EMAIL ? "admin" : "user"
    };

    localStorage.setItem(
        "currentPrototypeUser",
        JSON.stringify(loggedInUser)
    );

            message.textContent =
                "Prototype login successful.";

            setTimeout(function () {
                window.location.href = "dashboard.html";
            }, 1000);

        } else {
            message.textContent =
                "Invalid prototype email or password.";
        }
    });
}