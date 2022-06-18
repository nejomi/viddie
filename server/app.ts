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

const corsOrigins = [
  'http://localhost:3000',
  'https://viddie-alpha.netlify.app',
];

const app = express();
const httpServer = createServer(app);
const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(httpServer, {
  cors: {
    origin: corsOrigins,
    credentials: true
  },
});

app.use(
  cors({
    origin: corsOrigins,
    credentials: true
  })
);

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

function randomId() {
  return crypto.randomBytes(3).toString('hex');
}
//  create no room id handler
// function handleNoRoomId() {}

io.on('connection', (socket) => {
  socket.data.username = socket.handshake.auth.username || 'User';

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

    const name = socket.data.username || 'User';

    socket.emit('joined room', {
      videoDetails: videoDetails,
      user: {
        name: name,
        type: room.host === socket.id ? 'host' : 'guest',
      },
    });

    io.in(roomId).emit('new event', {
      event: {
       id: 'user joined ' + randomId(),
       message: `${name} joined the room🥳`,
       type: 'event'
      }
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
      type: 'message'
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

    // emit event message
    io.in(roomId).emit('new event', {
      event: {
       id: 'paused video' + randomId(),
       message: `${socket.data.username} paused the video`,
       type: 'event'
      }
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

    // emit event message
    io.in(roomId).emit('new event', {
      event: {
       id: 'play video' + randomId(),
       message: `${socket.data.username} played the video`,
       type: 'event'
      }
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

    // convert time
    const baseTime = new Date(time * 1000).toISOString();
    // MM:SS on time < 3600, else HH:MM:SS
    const formattedTime = time < 3600 ? baseTime.substring(14, 19) : baseTime.substring(11,19);

    // emit event message
    io.in(roomId).emit('new event', {
      event: {
       id: 'seek video' + randomId(),
       message: `${socket.data.username} jumped to ${formattedTime}`,
       type: 'event'
      }
    });
  });

  // disconnect
  socket.on('disconnect', () => {
    const roomId = socket.data.currentRoom;

    if (!roomId) {
      return;
    }

    // emit event message
    io.in(roomId).emit('new event', {
      event: {
       id: 'disconnect video' + randomId(),
       message: `${socket.data.username} disconnected`,
       type: 'event'
      }
    });

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
    return;
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