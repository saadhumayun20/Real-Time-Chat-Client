module.exports = function (io, userSockets) {

    //handelling the connecting of userSockets, with restrictions on characters
    io.on('connection', (socket) => {
        socket.on('new user', (username) => {
            if (/^[A-Za-z][A-Za-z0-9]*$/.test(username) && !userSockets[username]) {
                userSockets[username] = socket.id;
                socket.username = username;
                socket.emit('user connected', `Welcome, ${username}! You can now chat.`);
                console.log(`${username} has connected`);
            } else {
                socket.emit('user error', 'Invalid username or username already in use');
            }
        });

        socket.on('disconnect', () => {
            if (userSockets[socket.username]) {
                console.log(`${socket.username} has disconnected`);
                delete userSockets[socket.username];
            }
        });
    });
};
