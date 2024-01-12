"use client";

import Loader from "@components/Loader";
import {
  VideoCallOutlined,
  LocalPhoneOutlined,
  DeleteOutlined,
  SendRounded,
  AddPhotoAlternateOutlined,
} from "@mui/icons-material";
import { useSession } from "next-auth/react";
import { CldUploadButton } from "next-cloudinary";
import { useEffect, useRef, useState } from "react";
import MessageBox from "./MessageBox";

const ChatDetails = ({ chatId }) => {
  // To scrolldown when a new message is sent
  const bottomRef = useRef(null);

  const { data: session } = useSession();
  const currentUser = session?.user;

  const [loading, setLoading] = useState(true);
  const [chat, setChat] = useState({});
  const [otherMembers, setOtherMembers] = useState([]);
  const [text, setText] = useState("");

  const getChatDetails = async () => {
    try {
      const res = await fetch(`/api/chats/${chatId}`);
      const data = await res.json();
      setChat(data);
      setOtherMembers(
        data.members.filter((member) => member._id !== currentUser._id)
      );
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch chat details:", err);
    }
  };

  useEffect(() => {
    if (currentUser && chatId) getChatDetails();
  }, [currentUser, chatId]);

  console.log(chat);

  const sendText = async () => {
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        body: JSON.stringify({
          chatId,
          currentUserId: currentUser._id,
          text,
        }),
      });

      const data = await res.json();
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  const sendPhoto = async (result) => {
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        body: JSON.stringify({
          chatId,
          currentUserId: currentUser._id,
          photo: result?.info?.secure_url,
        }),
      });

      const data = await res.json();
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <div className="chat-details">
      <div className="chat-header">
        <div className="contact">
          {otherMembers.length < 2 ? (
            otherMembers.map((person) => (
              <>
                {person?.profileImagePath === "" ? (
                  <img
                    src="/assets/person.jpg"
                    alt="profile"
                    className="profilePhoto"
                  />
                ) : (
                  <img
                    src={person.profileImagePath}
                    alt="profile"
                    className="profilePhoto"
                  />
                )}
                <div className="text">
                  <p className="text-base-bold">{person.username}</p>
                </div>
              </>
            ))
          ) : (
            <>
              <img
                src="/assets/group.png"
                alt="profile"
                className="profilePhoto"
              />
              <div className="text">
                <p className="text-base-bold">{chat.name}</p>
              </div>
            </>
          )}
        </div>
        <div className="icons">
          <VideoCallOutlined
            sx={{
              color: "#737373",
              cursor: "pointer",
              "&:hover": { color: "#ff5252" },
            }}
          />
          <LocalPhoneOutlined
            sx={{
              color: "#737373",
              cursor: "pointer",
              "&:hover": { color: "#ff5252" },
            }}
          />
          <DeleteOutlined
            sx={{
              color: "#737373",
              cursor: "pointer",
              "&:hover": { color: "#ff5252" },
            }}
          />
        </div>
      </div>

      <div ref={bottomRef} className="chat-body">
        {chat?.messages.map((message, index) => (
          <p key={index}>
            <MessageBox
              key={message._id}
              isLast={index === chat?.messages - 1}
              message={message}
              currentUser={currentUser}
            />
          </p>
        ))}
      </div>

      <div className="send-message">
        <div className="prepare-message">
          <CldUploadButton
            options={{ maxFiles: 1 }}
            onUpload={sendPhoto}
            uploadPreset="qge6i0t5"
          >
            <AddPhotoAlternateOutlined
              sx={{
                color: "#737373",
                cursor: "pointer",
                "&:hover": { color: "#ff5252" },
              }}
            />
          </CldUploadButton>
          <input
            placeholder="Write a message..."
            className="input-field"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <SendRounded
          sx={{
            color: "#737373",
            cursor: "pointer",
            "&:hover": { color: "#ff5252" },
          }}
          onClick={sendText}
        />
      </div>
    </div>
  );
};

export default ChatDetails;
