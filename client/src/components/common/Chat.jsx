import { useSelector } from "react-redux";
import { publishTasks } from "../../utils/websocket.utils";
import { useEffect, useState } from "react";

const Chat = ({ currentTask }) => {
  const comments = useSelector((state) => state.task.comments);
  const isConnected = useSelector((state) => state.webSocket.connected);
  const client = useSelector((state) => state.webSocket.client);
  const [comment, setComment] = useState("");

  const handleSend = () => {
    if (comment.trim()) {
      // onSendMessage(inputMessage);
      setInputMessage(""); // Clear input after sending
      const delta = {
        taskId: currentTask.id,
        content: comment,
  
      }
      // publishTasks(client, delta, "/app/chat.sendMessage")
    }
    
  }
  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      height: "500px",
      width: "400px",
      border: "1px solid #ccc",
      borderRadius: "8px",
      overflow: "hidden",
      backgroundColor: "#f9f9f9",
      fontFamily: "Arial, sans-serif",
    },
    header: {
      backgroundColor: "#007bff",
      color: "white",
      padding: "10px",
      textAlign: "center",
      fontSize: "18px",
      fontWeight: "bold",
    },
    messages: {
      flex: 1,
      padding: "10px",
      overflowY: "auto",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },
    message: (isSent) => ({
      maxWidth: "70%",
      padding: "10px",
      borderRadius: "8px",
      fontSize: "14px",
      wordWrap: "break-word",
      alignSelf: isSent ? "flex-end" : "flex-start",
      backgroundColor: isSent ? "#d1e7ff" : "#f1f1f1",
      textAlign: isSent ? "right" : "left",
    }),
    messageContent: {
      margin: 0,
      padding: 0,
    },
    messageSender: {
      fontSize: "12px",
      color: "#555",
      marginTop: "5px",
    },
    inputContainer: {
      display: "flex",
      padding: "10px",
      borderTop: "1px solid #ccc",
      backgroundColor: "white",
    },
    input: {
      flex: 1,
      padding: "10px",
      border: "1px solid #ccc",
      borderRadius: "4px",
      fontSize: "14px",
    },
    button: {
      padding: "10px 20px",
      marginLeft: "10px",
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
    },
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    // <div>
    //   {comments?.map((comment) => (
    //     <span>{comment.content}</span>
    //   ))}
    //   <input
    //     type="text"
    //     placeholder="Send a message"
    //     value={comment}
    //     onChange={(e) => setComment(e.target.value)}
    //     onBlur={handleSend}
    //     onKeyDown={(e) => {
    //       if (e.key === 'ENTER') handleSend()
    //     }}
    //     style={{
    //       width: "100%",
    //       padding: "10px",
    //       border: "1px solid #ddd",
    //       borderRadius: "8px",
    //       fontSize: "14px",
    //       backgroundColor: "#fff",
    //     }}
    //   />

    // </div>
    <div style={styles.container}>
      <div style={styles.header}>Chat</div>
      <div style={styles.messages}>
        {comments?.map((msg, index) => (
          <div
            key={index}
            style={styles.message(msg.senderId === "currentUserId")}
          >
            <p style={styles.messageContent}>{msg.content}</p>
            <span style={styles.messageSender}>{msg.sender}</span>
          </div>
        ))}
      </div>
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type a message..."
          style={styles.input}
        />
        <button style={styles.button} onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  )
}
export default Chat