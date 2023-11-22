import { IconSend } from "@/assets/IconSend";
import BubbleChat from "@/components/BubbleChat";
import { Box, Button, IconButton, TextField } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

type IChatUrl = {
  id: string;
};

const Chat = ({socket}: {socket:Socket}) => {
  const { query, back } = useRouter();
  const [message, setMessage] = useState<string>("");
  const [data, setData] = useState<any[]>([])


  useEffect(() => {
    const handleListenMsg = (msg: any) => {
      setData(prev => ([
        ...prev,
        msg
      ]))}
      const handleGetOldMessage = (payload: any) => {
        console.log('messages payload', payload);
        if (payload.messages.length) {
          const messages = payload.messages.map((item: any) => ({
            ...item,
            msg: item.message
          }))
          setData(prev => ([
            ...prev,
            ...messages
          ]))
        }
        }
      socket.emit('load-chat-message', {roomId: query.id, seqId: new Date().getTime(), count: -10});

      socket.on('lst-messages-loaded', handleGetOldMessage)
      
    socket.on('chat-message', handleListenMsg);

    return () => {
      socket.off("chat-message", handleListenMsg); 
      socket.off('lst-messages-loaded', handleGetOldMessage)
    };
  },[query.id, socket])

  const handleSendMessage = () => {
    socket.emit("chat-message", {
      roomId: query.id,
      message
    })
    setMessage("")
  }

  return (
    <div className="container">
      <div className="titleContainer">
        <Box onClick={() => back()} sx={{color: "#5DB075", fontSize: "15px", position: "absolute", left: "20px", top: 0, cursor: "pointer"}}>
        Exit
        </Box>
        <div>{query.id}</div>
      </div>
      <Box sx={{ width: "100%", height: "100%", overflow: "auto" }}>
      {data.map(({msg, roomId, username: user}, index) => (
          <BubbleChat key={index} message={msg} senderName={user} isSender={query.username as string !== user}/>
          ))}
      </Box>
      <Box sx={{ width: "100%", position: "relative" }}>
        <TextField
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          sx={{ width: "100%", margin: "10px 0"}}
          InputProps={{ sx: { height: "auto", borderRadius: "20px" } }}
          placeholder="Message here..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage()
            }
          }}
        />
        <IconButton sx={{position: "absolute", right: 0, bottom: "50%", transform: "translate(-50%, 50%)"}} onClick={handleSendMessage}>
          <IconSend/>
        </IconButton>
      </Box>
    </div>
  );
};

export default Chat;
