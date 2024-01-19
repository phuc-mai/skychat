"use client";

import Loader from "@components/Loader";
import { SendRounded, AddPhotoAlternate, Delete } from "@mui/icons-material";
import { useSession } from "next-auth/react";
import { CldUploadButton } from "next-cloudinary";
import { useEffect, useRef, useState } from "react";
import MessageBox from "../MessageBox";
import Link from "next/link";
import { pusherClient } from "@lib/pusher";

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
      const res = await fetch(`/api/chats/${chatId}`, {
        method: "GET",
      });
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
    if (currentUser && chatId) {
      getChatDetails();
    }
  }, [currentUser, chatId]);

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
      setText("");
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
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    pusherClient.subscribe(chatId);

    const handleMessage = async (newMessage) => {
      setChat((prevChat) => ({
        ...prevChat,
        messages: [...prevChat.messages, newMessage],
      }));
    };

    pusherClient.bind("new-messages", handleMessage);

    return () => {
      pusherClient.unsubscribe(chatId);
      pusherClient.unbind("new-messages", handleMessage);
    };
  }, [chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages]);

  return loading ? (
    <Loader />
  ) : (
    <div className="chat-details">
      <div className="chat-header">
        {otherMembers.length < 2 ? (
          otherMembers.map((person) => (
            <>
              <img
                src={person.profileImage || "/assets/person.jpg"}
                alt="profile"
                className="profilePhoto"
              />
              <p className="text-base-bold">{person.username}</p>
            </>
          ))
        ) : (
          <>
            <Link href={`/chats/${chatId}/group-info`}>
              <img
                src={chat?.groupPhoto || "/assets/group.png"}
                alt="group-photo"
                className="profilePhoto"
              />
            </Link>

            <p className="text-base-bold">
              {chat.name} &#160; &#183; &#160; {chat.members.length} members
            </p>
          </>
        )}
      </div>

      <div className="chat-body">
        {chat?.messages?.map((message, index) => (
          <p key={index}>
            <MessageBox
              key={message._id}
              message={message}
              currentUser={currentUser}
            />
          </p>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="send-message">
        <div className="prepare-message">
          <CldUploadButton
            options={{ maxFiles: 1 }}
            onUpload={sendPhoto}
            uploadPreset="qge6i0t5"
          >
            <AddPhotoAlternate
              sx={{
                fontSize: "35px",
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
            required
          />
        </div>
        <div onClick={sendText}>
          <img src="/assets/send.jpg" className="send-icon" />
        </div>
      </div>
    </div>
  );
};

export default ChatDetails;
