const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const socketio = require('socket.io');
const signalRoutes = require('./routes/signalRoutes');
const { clearAllIntervals } = require('./controllers/signalsController');

// express app
const app = express();
const port = 4000;

// socket.io
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: "*"
    }
});

// parse application/json
app.use(bodyParser.json())

// allow cors
app.use(cors());

// socket.io middleware
app.use((req, res, next) => {
    req.io = io;
    return next();
});

io.on('connection', (socket) => {
    console.log('new socket.io connection', socket.id);

    socket.on("disconnect", () => {
        console.log("Client disconnected", socket.id);
        // clear all signals intervals
        clearAllIntervals(socket.id);
    });
});

// signal routes
app.use('/', signalRoutes);

// 404 page
app.use((req, res) => {
    res.status(404).json({
        error: "route not found",
        status: "404"
    });
});

server.listen(port, () => {
    console.log(`sever listening on port ${port}`)
})