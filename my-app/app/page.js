'use client'

import {
  Avatar,
  Box,
  Button,
  Divider,
  Link,
  Stack,
  TextField,
  Typography,
  useTheme,
  Switch,
} from "@mui/material";
import { blue, grey, red } from "@mui/material/colors";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello, I am Dev Coach, your personal Software Engineering AI companion. How can I help you land that $100,000+ job today?",
    },
  ]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // Add darkMode state

  const sendMessage = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setMessage("");

    setMessages((messages) => [
      ...messages,
      { role: "user", content: message },
      { role: "assistant", content: "" },
    ]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([...messages, { role: "user", content: message }]),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ];
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((messages) => [
        ...messages,
        {
          role: "assistant",
          content:
            "I'm sorry, but I encountered an error. Please try again later.",
        },
      ]);
    }
    setIsLoading(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const backgroundColor = darkMode ? grey[900] : grey[100]; // Set background color based on darkMode
  const chatBackgroundColor = darkMode ? grey[800] : grey[200]; // Set chat background color based on darkMode
  const textColor = darkMode ? "white" : "black"; // Set text color based on darkMode
  const inputTextColor = darkMode ? "white" : "black"; // Set input field text color
  const inputLabelColor = darkMode ? grey[500] : grey[700]; // Set input label color
  const inputBorderColor = darkMode ? grey[700] : grey[500]; // Set input border color
  const buttonBackgroundColor = darkMode ? grey[700] : grey[200]; // Set button background color
  const buttonHoverBackgroundColor = darkMode ? grey[600] : grey[300]; // Set button hover background color
  const avatarBackgroundColor = darkMode ? grey[700] : grey[200]; // Set avatar background color
  const dividerColor = darkMode ? grey[700] : grey[300]; // Set divider color
  const iconColor = darkMode ? "white" : "black"; // Set icon color

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bgcolor={backgroundColor} // Use backgroundColor variable
    >
      <Stack
        direction={"column"}
        width={isMobile ? "390px" : "700px"}
        height={isMobile ? "668px" : "700px"}
        border={isMobile ? "none" : "1px solid #444"} // Dark border
        p={2}
        spacing={3}
        bgcolor={chatBackgroundColor} // Use chatBackgroundColor variable
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Link href="https://github.com/Jadalriyabi/Dev-Coach">
            <Avatar
              src="public/logo.png" // Your GitHub image path
              alt="GitHub"
              sx={{ width: isMobile ? 40 : 50, height: isMobile ? 40 : 50, bgcolor: avatarBackgroundColor }} // Use avatarBackgroundColor variable
            />
          </Link>
          <Switch
            checked={darkMode}
            onChange={toggleDarkMode}
            sx={{ color: iconColor }} // Use iconColor variable
          />
        </Box>
        <Divider sx={{ bgcolor: dividerColor }} /> {/* Darker divider */}
        <Stack
          direction={"column"}
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                message.role === "assistant" ? "flex-start" : "flex-end"
              }
            >
              <Box
                bgcolor={message.role === "assistant" ? grey[700] : blue[600]}
                color={textColor} // Use textColor variable
                borderRadius={4}
                p={1.6}
                margin="10px 0"
                boxShadow="3px 3px 10px rgba(0, 0, 0, 0.5)" // Stronger shadow
              >
                <Typography>{message.content}</Typography>
              </Box>
            </Box>
          ))}
          <div ref={messagesEndRef} />
        </Stack>
        <Stack direction={"row"} spacing={2}>
          <Button
            variant="contained"
            onClick={clearChat}
            sx={{
              bgcolor: red[500], // Set the background color to red
              ":hover": { bgcolor: red[700] }, // Darker red on hover
              marginRight: "auto",
              padding: "8px 16px", // Adjust padding for better button size
              borderRadius: 20, // Add a rounded corner
              fontSize: "0.9rem", // Slightly larger font size
              textTransform: "none", // Remove default uppercase
              "& svg": { // Style the icon
                fontSize: "1.2rem",
                marginRight: "8px",
                color: "white", // Make the icon white for contrast
              },
            }}
          >
            <span style={{ marginRight: "8px" }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-trash"
                viewBox="0 0 16 16"
              >
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-.5.5H10a.5.5 0 0 1 0-1H6V6z" />
                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h1.5a1 1 0 0 1 1-1H14.5zM6 2h12v13H6V2z" />
              </svg>
            </span>
            Clear Chat
          </Button>
          <TextField
            label="Type your message..."
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            sx={{
              input: { color: inputTextColor }, // Use inputTextColor variable
              label: { color: inputLabelColor }, // Use inputLabelColor variable
              fieldset: { borderColor: inputBorderColor }, // Use inputBorderColor variable
            }}
          />
          <Button
            variant="contained"
            onClick={sendMessage}
            disabled={isLoading}
            sx={{ bgcolor: blue[600], ":hover": { bgcolor: blue[500] } }}
          >
            {isLoading ? "Sending..." : "Send"}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}