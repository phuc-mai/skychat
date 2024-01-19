import { format } from "date-fns";

const MessageBox = ({ message, currentUser }) => {
  return message?.sender?._id !== currentUser._id ? (
    <div className="message-box">
      <img
        src={message?.sender?.profileImage || "/assets/person.jpg"}
        alt="profile"
        className="message-profilePhoto"
      />
      <div className="message-info">
        <p className="text-small-bold">
          {message?.sender.username} &#160; &#183; &#160;{" "}
          {format(new Date(message.createdAt), "p")}
        </p>

        {message?.photo ? (
          <img src={message?.photo} alt="message" className="message-photo" />
        ) : (
          <p className="message-text">{message?.text}</p>
        )}
      </div>
    </div>
  ) : (
    <div id="message-box" className="message-box justify-end">
      <div className="message-info items-end">
        <p className="text-small-bold">
          {format(new Date(message.createdAt), "p")}
        </p>

        {message?.photo ? (
          <img src={message?.photo} alt="message" className="message-photo" />
        ) : (
          <p className="message-text-sender">{message?.text}</p>
        )}
      </div>
    </div>
  );
};

export default MessageBox;
