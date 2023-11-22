import express from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3001",
      "http://10.12.0.20:3001"
    ]
    // origin: 'http://localhost:3001'
  }
});


app.use(cors());

// const MONGO_URI = 'mongodb://localhost:27017/chat';

// mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// const messageSchema = new mongoose.Schema({
//   roomId: String,
//   username: String,
//   message: String,
// });

// const Message = mongoose.model('Message', messageSchema);

const roomSockets: Record<string, Socket[]> = {};
const socketUsernames: Record<string, string> = {};
const userInSocket: Record<string, Record<string, Boolean>> = {}
const socketOfUser: Record<string, Record<string, Boolean>> = {}

io.on('connection', (socket: Socket) => {
  console.log('a user connected');

  // Handle joining a room
  socket.on('join-room', (data: { roomId: string, username: string }) => {
    let { username, roomId } = data
    if (userInSocket[roomId] && userInSocket[roomId][username]) {
      socket.emit('room-join-failed', {
        msg: 'duplicated username'
      })
      return
    }
    socketUsernames[socket.id] = username;
    console.log(`User ${username} has joined this room`);
    io.to(roomId).emit('chat-message', {
      roomId: roomId,
      username: username,
      msg: `${username} joined this room`
    })
    socket.join(roomId);
    if (!roomSockets[roomId]) {
      roomSockets[roomId] = [];
    }
    roomSockets[roomId].push(socket);
    console.log(`User ${socketUsernames[socket.id]} joined room ${roomId}`);
    userInSocket
    if (!userInSocket[roomId]) {
      userInSocket[roomId] = {}
    }
    userInSocket[roomId][username] = true

    // if (!socketOfUser[username]) {
    //   socketOfUser[username] = {}
    // }
    // socketOfUser[username][roomId] = true

    socket.emit('room-joined', {
      roomId,
      username
    })
  });

  // Handle chat message in a specific room and save to MongoDB
  socket.on('chat-message', async (data: { roomId: string; message: string }) => {
    const { roomId, message } = data;
    const username = socketUsernames[socket.id] || 'Unknown User';
    io.to(roomId).emit('chat-message', {
      roomId,
      username,
      msg: `${username}: ${message}`,
    });

    // Save the message to MongoDB using Mongoose
    // const newMessage = new Message({ roomId, username, message });
    // await newMessage.save();
  });

  socket.on('disconnect', () => {
    console.log('user disconnected ', socket.id);
    // Remove the username when a user disconnects
    // let username = socketUsernames[socket.id];
    // delete socketUsernames[socket.id];
    // let lstRooms = socketOfUser[username]

    // if (lstRooms && (lstRooms instanceof Array)) {
    //   for(let roomId of lstRooms) {
    //     try {
    //       delete userInSocket[roomId][username]
    //     } catch (e) {
    //       console.log(e);
    //     }
    //   }
    // }
  });
});

server.listen('3000', () => {
  console.log('listening on *:3000');
});
