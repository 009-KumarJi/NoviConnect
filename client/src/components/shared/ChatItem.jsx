import React from 'react';
import {Link} from "../styles/StyledComponents.jsx";

const ChatItem = ({
  avatar = [],
  name,
  _id,
  groupChat,
  sameSender,
  isOnline,
  newMessage,
  index = 0,
  handleDeleteChatOpen,
                  }) => {
  return (
    <Link to={`/chat/${_id}`} className="chat-item">
      <div style={{
        display: "flex",
        alignItems: "center",
        padding: "1rem",
        backgroundColor: sameSender ? "black" : "unset",
        color: sameSender ? "white" : "unset",
        position: "relative",
      }}>

      </div>
    </Link>
  );
};

export default ChatItem;