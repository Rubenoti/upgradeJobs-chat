const express = require('express');
const cors = require('cors');
const { connect } = require('./src/utils/db/db');
const chats = require('./src/api/chat/chat.routes');
const http = require('http');
const { Server } = require('socket.io');

connect()
const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, PATCH');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
app.use(
    cors({
        origin: [
            'http://localhost:3000',
            'https://localhost:4200',
            'https://localhost:5500',
            'http://127.0.0.1:5500',
            'https://upgrade-jobs-app.vercel.app',
        ],
        credentials: true,
    })
);

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

app.use('/chats', chats);

app.use((req, res, next) => {
    let err = new Error();
    err.status = 404;
    err.message = HTTPSTATUSCODE[404];
    next(err);
});

app.use((err, req, res, next) => {
    return res.status(err.status || 500).json(err.message || 'Unexpected error');
});
app.disable('x-powered-by');

const serverM = http.createServer(app);
const io = new Server(serverM, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'PUSH'],
    },
});
io.on('connection', (socket) => {
    socket.on('join_room', (data) => {
        socket.join(data);
        console.log(`User with id: ${socket.id} joined room: ${data}`);
    });

    socket.on('send_message', (data) => {
        socket.to(data.room).emit('receive', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected', socket.id);
    });
});
serverM.listen(3001, () => {
    console.log('Chat is running on port 3001, http://localhost:3001');
});