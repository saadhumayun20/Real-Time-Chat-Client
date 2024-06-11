const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const userManagement = require('./userManagement');
const chatManagement = require('./chatManagement');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Create an HTTP server
const server = http.createServer(app);

// Setup Socket.io
const io = socketIo(server);
let userSockets = {};
userManagement(io, userSockets);
chatManagement(io, userSockets);

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log('To Test:');
    console.log(`http://localhost:${PORT}/chatClient.html`);
});
