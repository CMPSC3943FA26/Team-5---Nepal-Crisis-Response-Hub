(() => {
    const user = JSON.parse(localStorage.getItem("currentPrototypeUser"));
    const donationForm = document.getElementById("donationForm");
    const donationList = document.getElementById("donationList");
    const contactList = document.getElementById("savedContactList");
    const contactMessage = document.getElementById("contactMessage");
    const saveButtons = document.querySelectorAll(".contact-save");

    const accountKey = (feature) => `prototype:${feature}:${user.email}`;
    const records = (feature) => JSON.parse(localStorage.getItem(accountKey(feature)) || "[]");
    const saveRecords = (feature, entries) => {
        localStorage.setItem(accountKey(feature), JSON.stringify(entries));
    };

    if (donationForm) {
        document.getElementById("donationLogin").hidden = Boolean(user);
        donationForm.hidden = !user;
        donationForm.addEventListener("submit", (event) => {
            event.preventDefault();
            if (!user || !donationForm.reportValidity()) return;

            const amount = document.getElementById("donationAmount").valueAsNumber;
            const entry = { amount, createdAt: new Date().toISOString() };
            saveRecords("donations", [entry, ...records("donations")]);
            const message = document.getElementById("donationMessage");
            setInterfaceText(message, "Demo donation recorded.");
            donationForm.reset();
        });
    }

    if (user && donationList) {
        const donations = records("donations");
        if (donations.length === 0) {
            const item = document.createElement("li");
            setInterfaceText(item, "No demo donations yet.");
            donationList.append(item);
        }
        for (const { amount, createdAt } of donations) {
            const item = document.createElement("li");
            const status = document.createElement("span");
            setInterfaceText(status, "Demo donation");
            item.append(`NPR ${amount.toLocaleString()} · ${new Date(createdAt).toLocaleString()} · `, status);
            donationList.append(item);
        }
    }

    function showContacts() {
        const contacts = records("contacts");
        contactList.replaceChildren();
        if (contacts.length === 0) {
            const item = document.createElement("li");
            setInterfaceText(item, "No saved contacts yet.");
            contactList.append(item);
        }
        for (const { name, number } of contacts) {
            const item = document.createElement("li");
            const link = document.createElement("a");
            link.href = `tel:${number}`;
            const label = document.createElement("span");
            setInterfaceText(label, name);
            link.append(label, ` (${number})`);
            const remove = document.createElement("button");
            remove.type = "button";
            remove.className = "contact-save";
            setInterfaceText(remove, "Remove");
            remove.addEventListener("click", () => {
                saveRecords("contacts", records("contacts").filter((contact) => contact.number !== number));
                setInterfaceText(contactMessage, "Contact removed.");
                showContacts();
                (contactList.querySelector("button") || document.querySelector("#savedContacts a")).focus();
            });
            item.append(link, remove);
            contactList.append(item);
        }
    }

    for (const button of saveButtons) {
        const { contact: name, number } = button.dataset;
        button.addEventListener("click", () => {
            if (!user) {
                setInterfaceText(contactMessage, "Log in to save emergency contacts.");
                return;
            }
            const contacts = records("contacts");
            if (contacts.some((contact) => contact.number === number)) {
                setInterfaceText(contactMessage, "This contact is already saved.");
                return;
            }
            saveRecords("contacts", [...contacts, { name, number }]);
            setInterfaceText(contactMessage, "Contact saved to your dashboard.");
        });
    }

    if (user && contactList) showContacts();
})();
