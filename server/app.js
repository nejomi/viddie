"use strict";
exports.__esModule = true;
var express_1 = require("express");
var http_1 = require("http");
var socket_io_1 = require("socket.io");
var app = (0, express_1["default"])();
var httpServer = (0, http_1.createServer)(app);
var io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: 'http://localhost:3000'
    }
});
io.on('connection', function (socket) {
    socket.username = socket.handshake.auth.username;
    console.log('connected', new Date());
    socket.on('greet', function (greeting) {
        console.log(greeting.message);
    });
    // create room
    socket.on('create room', function () {
        var crypto = require('crypto');
        var roomId = crypto.randomBytes(6).toString('hex');
        socket.emit('room created', {
            room: roomId
        });
    });
    // join room
    socket.on('join room', function (room) {
        // same room
        if (socket.current_room === room) {
            return;
        }
        // new room
        if (socket.current_room) {
            socket.leave(socket.current_room);
        }
        socket.join(room);
        socket.current_room = room;
        socket.emit('joined room', room);
        console.log(socket.username + ' joined room ' + room);
    });
    // send message
    socket.on('send message', function (message) {
        console.log('SENDING MESSAGE TO ROOM ' + socket.current_room);
        socket.to(socket.current_room).emit('recieve message', {
            from: socket.username,
            text: message
        });
    });
});
httpServer.listen(5000, function () {
    console.log('listening on port 5000');
});
