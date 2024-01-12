import { format } from "date-fns";

const MessageBox = ({ isLast, message, currentUser }) => {
  const isSentByCurrentUser = message.sender._id === currentUser._id;

  const seenPeople = message.seenBy
    .filter((user) => user._id !== message?.sender?._id)
    .map((user) => user.username)
    .join(", ");

  return (
    <div className={`message-box ${message?.sender?._id === currentUser._id ? 'right' : ''}`}>
      {message?.sender?.profileImagePath === "" ? (
        <img
          src="/assets/person.jpg"
          alt="profile"
          className="message-profilePhoto"
        />
      ) : (
        <img
          src={message?.sender?.profileImagePath}
          alt="profile"
          className="message-profilePhoto"
        />
      )}
      <div className="message-info">
        <p className="text-small-bold">
          {message?.sender.username} &#160; &#183; &#160;{" "}
          {format(new Date(message.createdAt), "p")}
        </p>

        {message?.photo ? (
          <img src={message?.photo} alt="message" className="message-photo" />
        ) : (

          <p className={`message-text ${message?.sender?._id === currentUser._id ? 'sender' : ''}`}>{message?.text}</p>
        )}
      </div>
    </div>
  );
};

export default MessageBox;
