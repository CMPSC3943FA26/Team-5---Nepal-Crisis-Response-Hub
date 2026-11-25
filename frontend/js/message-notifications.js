
(() => {
    function updateMessageBadge() {
        const user = JSON.parse(
            localStorage.getItem("currentPrototypeUser") || "null"
        );

        const links = document.querySelectorAll(
            'nav a[href="messages.html"]'
        );

        if (!user || !links.length) return;

        const messages = JSON.parse(
            localStorage.getItem("prototypePrivateMessages") || "[]"
        );

        const unread = messages.filter(message => {
            if (message.read) return false;

            if (user.role === "admin") {
                return message.senderRole !== "admin";
            }

            return (
                message.conversationId === user.email &&
                message.senderRole === "admin"
            );
        }).length;

        links.forEach(link => {
            const oldBadge = link.querySelector(".message-badge");

            if (oldBadge) oldBadge.remove();

            if (unread > 0) {
                const badge = document.createElement("span");

                badge.className = "message-badge";
                badge.textContent = unread;

                badge.style.cssText = `
                    background: #dc2626;
                    color: white;
                    border-radius: 20px;
                    padding: 3px 8px;
                    font-size: 12px;
                    font-weight: bold;
                    margin-left: 6px;
                `;

                link.appendChild(badge);
            }
        });
    }

    updateMessageBadge();

    window.addEventListener("storage", updateMessageBadge);

    setInterval(updateMessageBadge, 1500);
})();
