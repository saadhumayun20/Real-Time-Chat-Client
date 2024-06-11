document.addEventListener('DOMContentLoaded', function () {
    var socket = io('http://localhost:3000');
    var username;
    var usernameInput = document.getElementById('username');
    var connectBtn = document.getElementById('connectBtn');
    var chatForm = document.getElementById('chatForm');
    var chatInput = document.getElementById('chatInput');
    var messages = document.getElementById('messages');
    var clearBtn = document.getElementById('clearBtn');
    var usernameLabel = document.querySelector('.inputGroup label'); // Get the label element

    //checking for user being entered (enter key)
    usernameInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            username = usernameInput.value.trim();
            if (username) {
                socket.emit('new user', username);
            }
        }
    });

    //checking for user being entered 
    connectBtn.addEventListener('click', function () {
        username = usernameInput.value.trim();
        if (username) {
            socket.emit('new user', username);
        }
    });

    //handling the sending of messages
    chatForm.addEventListener('submit', function (event) {
        event.preventDefault();

        var rawMessage = chatInput.value.trim();
        var messageContent;
        var privateRecipients = [];

        //check if the message includes a colon, indicates private messaging
        if (rawMessage.indexOf(':') !== -1) {
            var parts = rawMessage.split(':');
            var potentialRecipients = parts[0].trim();
            var privateMessage = parts.slice(1).join(':').trim();

            //split by comma to support multiple recipients
            privateRecipients = potentialRecipients.split(',').map(function (name) { return name.trim(); });

            if (privateRecipients.length && privateMessage) {
                messageContent = {
                    username: username,
                    message: privateMessage,
                    recipients: privateRecipients,
                    isPrivate: true
                };
            }
            //is not a private message or group message
        } else {
            messageContent = {
                username: username,
                message: rawMessage,
                isPrivate: false
            };
        }

        if (messageContent && messageContent.message) {
            socket.emit('chat message', messageContent);
            chatInput.value = '';
        }
    });

    // When user successfully connects
    socket.on('user connected', function (msg) {
        document.getElementById('connectStatus').innerText = msg;
        document.getElementById('chat-area').style.display = 'block'; // Show the chat area
        usernameInput.style.display = 'none'; // Hide the username input
        usernameLabel.style.display = 'none'; // Hide the username label
        connectBtn.style.display = 'none'; // Hide the connect button
    });

    socket.on('user error', function (msg) {
        alert(msg);
        usernameInput.value = ''; // Reset the username input for correction
    });

    // Handling incoming messages...
    socket.on('chat message', function (data) {
        if (data && data.username && data.message) {
            var item = document.createElement('li');
            item.textContent = data.username + ": " + data.message;

            // Check if it's a private message
            if (data.isPrivate) {
                item.classList.add('private-message');
            }

            // Align the user's messages to the right, others to the left
            if (data.username === username) {
                item.classList.add('message-right');
            } else {
                item.classList.add('message-left');
            }

            messages.appendChild(item);
            window.scrollTo(0, document.body.scrollHeight);
        }
    });

    // Clear button event listener
    clearBtn.addEventListener('click', function () {
        messages.innerHTML = ''; // Clears the chat content
    });
});
