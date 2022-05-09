const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();


const serverM = http.createServer(app);

const io = new Server(serverM, {
    cors: {
        origin: 'https://upgrade-jobs-app.vercel.app',

        methods: ['GET', 'PUSH'],
        allowedHeaders: ['Access-Control-Allow-Origin'],
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