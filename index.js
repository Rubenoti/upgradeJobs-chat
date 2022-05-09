const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();


const serverM = http.createServer(app);


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Methods', 'GET,POST');
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
const io = new Server(app, {
    cors: {
        origin: 'https://upgrade-jobs-app.vercel.app',

        methods: ['GET', 'PUSH'],
        allowedHeaders: ['Access-Control-Allow-Origin', 'Access-Control-Allow-Credentials', 'Access-Control-Allow-Headers', 'Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
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

//finalize