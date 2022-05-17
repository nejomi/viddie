import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

import {
  Room,
  RoomResponse,
  ClientToServerEvents,
  ServerToClientEvents,
} from '../src/types/Types';

interface InterServerEvents {}

interface SocketData {
  username: string;
  currentRoom: string;
}

const app = express();
const httpServer = createServer(app);
const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

const crypto = require('crypto');
const rooms: { [key: string]: Room } = {
  gigachad: {
    host: 's',
    videoDetails: {
      hash: null,
      length: 183.948481,
      size: 48547287,
      currentTime: 0,
      isPlaying: false,
    },
    updatedOn: Date.now(),
  },
};

app.use(cors());

//  create no room id handler
// function handleNoRoomId() {}

io.on('connection', (socket) => {
  socket.data.username = socket.handshake.auth.username;

  console.log('connected', new Date());

  // create room
  socket.on('create room', (videoDetails) => {
    console.log(videoDetails);
    const roomId: string = crypto.randomBytes(6).toString('hex');
    const room: Room = {
      host: socket.id,
      videoDetails: {
        hash: videoDetails.hash,
        length: videoDetails.length,
        size: videoDetails.size,
        currentTime: 0,
        isPlaying: false,
      },
      updatedOn: Date.now(),
    };

    rooms[roomId] = room;
    socket.emit('room created', {
      room: roomId,
    });
  });

  socket.on('get room details', (roomId) => {
    console.log(roomId);
  });

  // join room
  socket.on('join room', (roomId) => {
    // same room
    if (socket.data.currentRoom === roomId) {
      return;
    }

    // new room
    if (socket.data.currentRoom) {
      socket.leave(socket.data.currentRoom);
    }

    let room = rooms[roomId];

    if (!room) {
      socket.emit('room not found');
      return;
    }

    socket.join(roomId);
    socket.data.currentRoom = roomId;

    // computation from syncwatch, adjust time from updated on
    const currentTime = room.videoDetails.isPlaying
      ? room.videoDetails.currentTime + (Date.now() - room.updatedOn) / 1000
      : room.videoDetails.currentTime;

    // update videoDetails
    const videoDetails = room.videoDetails;
    videoDetails.currentTime = currentTime;

    socket.emit('joined room', {
      videoDetails: videoDetails,
      user: {
        name: socket.data.username || 'User',
        type: room.host === socket.id ? 'host' : 'guest',
      },
    });

    console.log(socket.data.username + ' joined room ' + roomId);
  });

  // send message
  socket.on('send message', (message) => {
    const roomId = socket.data.currentRoom;

    if (!roomId) {
      return;
    }

    console.log('SENDING MESSAGE TO ROOM ' + socket.data.currentRoom);
    io.in(roomId).emit('new message', {
      id: crypto.randomBytes(3).toString('hex'),
      from: socket.data.username as string,
      body: message,
    });
  });

  // VIDEO EVENTS
  // pause video
  socket.on('pause video', (time) => {
    if (!socket.data.currentRoom) return;

    // update room
    const roomId = socket.data.currentRoom;
    rooms[roomId].videoDetails.isPlaying = false;
    rooms[roomId].videoDetails.currentTime = time;
    rooms[roomId].updatedOn = Date.now();

    socket.in(socket.data.currentRoom).emit('update video', {
      type: 'PAUSE',
      time: time,
    });
  });

  socket.on('play video', (time) => {
    if (!socket.data.currentRoom) return;

    // update room
    const roomId = socket.data.currentRoom;
    rooms[roomId].videoDetails.isPlaying = true;
    rooms[roomId].videoDetails.currentTime = time;
    rooms[roomId].updatedOn = Date.now();

    console.log(rooms[roomId]);

    socket.in(socket.data.currentRoom).emit('update video', {
      type: 'PLAY',
      time: time,
    });
  });

  socket.on('seek video', (time) => {
    if (!socket.data.currentRoom) return;

    const roomId = socket.data.currentRoom;
    rooms[roomId].videoDetails.currentTime = time;
    rooms[roomId].updatedOn = Date.now();

    console.log(time);
    socket.in(socket.data.currentRoom).emit('update video', {
      type: 'SEEK',
      time: time,
    });
  });

  // disconnect
  socket.on('disconnect', () => {
    const roomId = socket.data.currentRoom;

    if (!roomId) {
      return;
    }

    if (roomId === 'gigachad') {
      return;
    }

    const serverRooms = io.sockets.adapter.rooms;

    // no more in room
    const roomExists = serverRooms.get(roomId);

    if (!roomExists) {
      delete rooms[roomId];
    }

    console.log(rooms);
  });
});

app.get('/room-details/:room', async (req, res) => {
  const roomId = req.params.room;
  const room = rooms[roomId];

  if (!room) {
    res.status(404).json({ message: 'Room does not exist.' });
  }

  // get number of connected users
  const socketsArr = await io.in(roomId).fetchSockets();
  const connectedUsers = socketsArr.length;

  const roomResponse: RoomResponse = {
    videoDetails: room.videoDetails,
    connectedUsers,
  };
  return res.json(roomResponse);
});

httpServer.listen(5000, () => {
  console.log('listening on port 5000');
});

app.get('/yo', (req, res) => {
  const room = rooms['gigachad'];
  res.json(
    room.videoDetails.isPlaying
      ? room.videoDetails.currentTime + (Date.now() - room.updatedOn) / 1000
      : room.videoDetails.currentTime
  );
});
