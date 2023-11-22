// src/chat/chat.gateway.ts
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import mongoose from 'mongoose';


@WebSocketGateway(3002, {cors: true})
export class ChatGateway {
  @WebSocketServer()
  io: Server;

  roomSockets: Record<string, Socket[]> = {};
  userInSocket: Record<string, Record<string, Boolean>> = {};
  socketUsernames: Record<string, string> = {};

  afterInit(io: Server) {
    console.log('Initialized!');
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(client: any, payload: { roomId: string, username: string }): void {
    console.log('event join-room');
    console.log(client.id)
    let { username, roomId } = payload
    let userInSocket = this.userInSocket;
    let socketUsernames = this.socketUsernames;
    let roomSockets = this.roomSockets;
    if (userInSocket[roomId] && userInSocket[roomId][username]) {
      client.emit('room-join-failed', {
        msg: 'duplicated username'
      })
      return
    }
    socketUsernames[client.id] = username;
    console.log(`User ${username} has joined this room`);
    this.io.to(roomId).emit('chat-message', {
      roomId: roomId,
      username: username,
      msg: `${username} joined this room`
    })
    client.join(roomId);
    if (!roomSockets[roomId]) {
      roomSockets[roomId] = [];
    }
    roomSockets[roomId].push(client);
    console.log(`User ${socketUsernames[client.id]} joined room ${roomId}`);
    userInSocket
    if (!userInSocket[roomId]) {
      userInSocket[roomId] = {}
    }
    userInSocket[roomId][username] = true
    client.emit('room-joined', {
      roomId: payload.roomId,
      username: payload.username
    });

    
  }

  @SubscribeMessage('chat-message')
  async handleChatToRoom(client: any, payload: { roomId: string, message: string }): Promise<void> {
    const { roomId, message } = payload;
    const username = this.socketUsernames[client.id] || 'Unknown User';
    // Save the message to MongoDB using Mongoose
    const Message = mongoose.model('Message');
    const newMessage = new Message({ roomId, username, message });
    await newMessage.save();
    this.io.to(roomId).emit('chat-message', {
      roomId,
      username,
      msg: `${username}: ${message}`,
      createdAt: newMessage.createdAt,
      seqId: newMessage.createdAt.getTime(),
    });
    // this.io.to(payload.roomId).emit('chatToRoom', payload.message);
  }

  @SubscribeMessage('load-chat-message')
  async handleLoadMessage(client: any, payload: { roomId: string, seqId: number, count: number }): Promise<void> {
    console.log('load-chat-message', payload);
    
    let { roomId, seqId, count } = payload;

    const Message = mongoose.model('Message');
    
    if (count == 0) {
      count = 10
    }

    if (!isFinite(seqId)) {
      client.emit('lst-messages-loaded', {
        messages: []
      });
      return
    }

    let messages = []
    try {
      messages = await Message.find(
        {
          roomId,
          // _id: {
          //   [(count > 0) ? '$gte': '$lte']: new mongoose.Types.ObjectId(messageId)
          // }
          createdAt: {
            [(count > 0) ? '$gte': '$lte']: new Date(seqId)
          }
        }, null,
        {
          sort: {createdAt: (count > 0) ? 1 : -1},
          limit: (count > 0) ? (count + 1) : (0 - count + 1)
        }
      )
    } catch (e) {
      console.log(e);
    }

    console.log('messages');
    let nextSeqId = -1
    let nextMessageId = ''
    if (messages.length > Math.abs(count)) {
      nextSeqId = messages[messages.length - 1].createdAt.getTime()
      nextMessageId = messages[messages.length - 1]._id
      messages.pop()
    }
    let msgs = []

    messages.map(m => {
      msgs.push({
        _id: m._id,
        seqId: m.createdAt.getTime(),
        roomId: m.roomId,
        username: m.username,
        message: m.message
      })
    })

    msgs.sort((a, b) => a.seqId - b.seqId)

    client.emit('lst-messages-loaded', {
      messages: msgs,
      nextSeqId,
      nextMessageId
    });
    // this.io.to(payload.roomId).emit('chatToRoom', payload.message);
  }
}
