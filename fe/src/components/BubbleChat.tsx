import { Box } from "@mui/material";

interface IBubbleChatProps {
  senderName?: string;
  message: string;
  isSender?: boolean;
}

const BubbleChat = ({ message, senderName, isSender = false }: IBubbleChatProps) => {
  return (
    <Box sx={{direction: isSender ? "ltr" : "rtl"}}>
      <Box>{isSender && senderName}</Box>
      <Box sx={{
        marginTop: "10px",
        borderRadius: "20px",
        background: isSender ? "#F6F6F6" : "#5DB075",
        padding: "20px",
        color: isSender ? "black" : "white",
        border: isSender ? "1px solid #E8E8E8" : "unset",
        width: "fit-content",
        maxWidth: "60%"
      }}>{message}</Box>
    </Box>
  );
};

export default BubbleChat;
