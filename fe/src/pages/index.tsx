import { Box, Button, TextField } from "@mui/material";
import { useRouter } from "next/navigation";
import Router from "next/router";
import { useState } from "react";
import { io, Socket } from "socket.io-client";

export default function Home({socket}: {socket: Socket}) {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const [roomId, setRoomId] = useState<string>("");

  const handleJoinRoom = () => {
    if (!username || !roomId) return;
    socket.emit('join-room', {
      roomId,
      username
    });
    Router.push({
      pathname: `/chat/${roomId}`,
      query: {
        username
      },
    });
  };

  return (
    <div className="container">
      <Box sx={{ width: "100%" }}>
        <div className="text-3xl">Join Chatroom</div>
        <Box sx={{ width: "100%" }}>
          <TextField
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ width: "100%", margin: "10px 0" }}
            placeholder="Username"
            
          />
          <TextField
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            sx={{ width: "100%", margin: "10px 0" }}
            placeholder="RoomID"
            
          />
        </Box>
      </Box>
      <Button
        variant="contained"
        color="success"
        onClick={handleJoinRoom}
        sx={{ width: "100%", borderRadius: "20px", height: "40px", marginBottom: "60px" }} 
      >
        Join
      </Button>
    </div>

  );
}
