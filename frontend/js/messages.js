
(() => {
    const MESSAGE_KEY = "prototypePrivateMessages";

    const user = JSON.parse(
        localStorage.getItem("currentPrototypeUser") || "null"
    );

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    const isAdmin = user.role === "admin";

    const conversationList =
        document.getElementById("conversationList");

    const chatTitle =
        document.getElementById("chatTitle");

    const chatHistory =
        document.getElementById("chatHistory");

    const messageForm =
        document.getElementById("messageForm");

    const messageText =
        document.getElementById("messageText");

    const messageStatus =
        document.getElementById("messageStatus");

    let activeConversation = isAdmin ? null : user.email;

    function getMessages() {
        return JSON.parse(
            localStorage.getItem(MESSAGE_KEY) || "[]"
        );
    }

    function saveMessages(messages) {
        localStorage.setItem(
            MESSAGE_KEY,
            JSON.stringify(messages)
        );
    }

    function getUnreadCount(email) {
        return getMessages().filter(message =>
            message.conversationId === email &&
            message.senderRole !== (isAdmin ? "admin" : user.role) &&
            !message.read
        ).length;
    }

    function renderConversations() {
        conversationList.replaceChildren();

        const messages = getMessages();

        if (!isAdmin) {
            const button = document.createElement("button");

            button.type = "button";
            button.className = "conversation-button";

            const unread = getUnreadCount(user.email);

            button.textContent = "Administrator" +
                (unread ? ` (${unread} new)` : "");

            button.addEventListener("click", () => {
                openConversation(user.email);
            });

            conversationList.appendChild(button);
            return;
        }

        const conversations = new Map();

        messages.forEach(message => {
            if (message.senderRole !== "admin") {
                conversations.set(
                    message.conversationId,
                    {
                        name: message.senderName,
                        role: message.senderRole
                    }
                );
            }
        });

        if (!conversations.size) {
            const empty = document.createElement("p");
            setInterfaceText(empty, "No incoming messages yet.");
            conversationList.appendChild(empty);
            return;
        }

        conversations.forEach((person, email) => {
            const button = document.createElement("button");

            button.type = "button";
            button.className = "conversation-button";

            const roleLabel =
                person.role === "responder"
                    ? "Responder"
                    : "Resident";

            const unread = getUnreadCount(email);

            button.textContent =
                person.name + " (" + roleLabel + ")" +
                (unread ? ` — ${unread} new` : "");

            if (activeConversation === email) {
                button.style.background = "#1d4ed8";
                button.style.color = "white";
            }

            button.addEventListener("click", () => {
                openConversation(email);
            });

            conversationList.appendChild(button);
        });
    }

    function openConversation(email) {
        if (!isAdmin && email !== user.email) return;

        activeConversation = email;

        const messages = getMessages();

        const conversation = messages.filter(message =>
            message.conversationId === email
        );

        if (isAdmin) {
            const sender = conversation.find(message =>
                message.senderRole !== "admin"
            );

            chatTitle.textContent = sender
                ? sender.senderName + " — " +
                    (sender.senderRole === "responder"
                        ? "Responder"
                        : "Resident")
                : "Conversation";
        } else {
            setInterfaceText(chatTitle, "Administrator");
        }

        chatHistory.replaceChildren();

        if (!conversation.length) {
            const empty = document.createElement("p");

            empty.textContent =
                "Start a conversation by sending a message.";

            chatHistory.appendChild(empty);
        }

        conversation.forEach(message => {
            const bubble = document.createElement("div");

            const sentByMe = isAdmin
                ? message.senderRole === "admin"
                : message.senderRole !== "admin";

            bubble.className =
                "chat-bubble " +
                (sentByMe ? "sent" : "received");

            const sender = document.createElement("strong");
            sender.textContent = message.senderName;

            const content = document.createElement("div");
            content.textContent = message.text;

            const time = document.createElement("span");

            time.className = "chat-time";
            time.textContent =
                new Date(message.createdAt).toLocaleString();

            bubble.append(sender, content, time);
            chatHistory.appendChild(bubble);

            if (!sentByMe) {
                message.read = true;
            }
        });

        saveMessages(messages);

        messageForm.hidden = false;

        chatHistory.scrollTop = chatHistory.scrollHeight;

        renderConversations();
    }

    messageForm.addEventListener("submit", event => {
        event.preventDefault();

        const session = JSON.parse(
            localStorage.getItem("currentPrototypeUser") ||
            "null"
        );

        if (!session ||
            session.email !== user.email ||
            session.role !== user.role) {
            window.location.href = "login.html";
            return;
        }

        const text = messageText.value.trim();

        if (!text || !activeConversation) return;

        if (!isAdmin && activeConversation !== user.email) {
            return;
        }

        const messages = getMessages();

        messages.push({
            id: crypto.randomUUID(),
            conversationId: activeConversation,
            senderEmail: user.email,
            senderName: isAdmin
                ? "Administrator"
                : user.name,
            senderRole: user.role,
            text: text,
            createdAt: new Date().toISOString(),
            read: false
        });

        try {
            saveMessages(messages);
        } catch (error) {
            messageStatus.textContent =
                "Unable to save message. Browser storage may be full.";
            return;
        }

        messageText.value = "";
        setInterfaceText(messageStatus, "Message sent successfully.");

        openConversation(activeConversation);
    });

    window.addEventListener("storage", event => {
        if (event.key === MESSAGE_KEY) {
            if (activeConversation) {
                openConversation(activeConversation);
            } else {
                renderConversations();
            }
        }
    });

    renderConversations();

    if (!isAdmin) {
        openConversation(user.email);
    }
})();


document.getElementById("messageLogout")
    ?.addEventListener("click", function (event) {
        event.preventDefault();

        localStorage.removeItem("currentPrototypeUser");

        window.location.href = "login.html";
    });
