(function () {
    const app = document.querySelector(".app");
    const socket = io();

    let uname;

    app.querySelector(".join.screen #join-user").addEventListener("click", function () {
        let username = app.querySelector(".join-screen #username").value;
        if (username.length === 0) {
            return;
        }
        socket.emit("newuser", username);
        uname = username;
        app.querySelector(".join-screen").style.display = "none";
        app.querySelector(".chat-screen").style.display = "block";
    });

    app.querySelector(".chat.screen #send-message").addEventListener("click", function () {
        let message = app.querySelector(".chat-screen #message-input").value;
        if (message.length === 0) {
            return;
        }
        renderMessage("my", {
            username: uname,
            text: message,
        });
        socket.emit("chat", {
            username: uname,
            text: message,
        });
        app.querySelector(".chat-screen #message-input").value = "";
    });

    app.querySelector(".chat-screen #exit-chat").addEventListener("click", function () {
        socket.emit("exituser", uname);
        window.location.href = window.location.href;
    });

    socket.on("update", function (update) {
        renderMessage("update", update);
    });

    socket.on("chat", function (message) {
        renderMessage("other", message);
    });

    function renderMessage(type, message) {
        let messageElement = document.createElement("div");
        messageElement.classList.add("message");
        messageElement.classList.add(type === "my" ? "my-message" : "other-message");

        let textElement = document.createElement("div");
        textElement.classList.add("text");
        textElement.textContent = message.text;

        messageElement.appendChild(textElement);

        app.querySelector(".chat-screen .messages").appendChild(messageElement);
    }
})();