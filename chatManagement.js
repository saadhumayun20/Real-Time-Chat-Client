module.exports = function (io, userSockets) {
    
    io.on('connection', (socket) => {

        // Handle a user sending a message
        socket.on('chat message', (data) => {
            //check if user wanted to send a private message or group message
            if (data.isPrivate && data.recipients && data.recipients.length > 0) {
                data.recipients.forEach((recipient) => {
                    if (userSockets[recipient]) {
                        socket.to(userSockets[recipient]).emit('chat message', data);
                    }
                });
                // Also send the message back to the sender
                socket.emit('chat message', data);
            } else {
                // Broadcast the message to everyone
                io.emit('chat message', data);
            }
        });
    });
};