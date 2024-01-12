import { useRouter } from "next/navigation";
import { format } from "date-fns";

const ChatBox = ({ chat, currentUser }) => {
  const router = useRouter();

  const otherMembers = chat.members.filter(
    (member) => member._id !== currentUser._id
  );

  const lastMessage = chat.messages[chat.messages.length - 1];

  return (
    <div className="chat-box" onClick={() => router.push(`/chats/${chat._id}`)}>
      <div className="chat-info">
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
              <div className="flex flex-col gap-1">
                <p className="text-base-bold">{person.username}</p>
                {lastMessage.photo ? (
                  <p className="text-small-medium text-grey-3">A photo</p>
                ) : (
                  <p className="text-small-medium text-grey-3">
                    {lastMessage.text}
                  </p>
                )}
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
            <div className="flex flex-col gap-1">
              <p className="text-base-bold">{chat.name}</p>
              {lastMessage.photo ? (
                lastMessage.sender._id === currentUser._id ? (
                  <p className="text-small-medium text-grey-3">
                    You sent a photo
                  </p>
                ) : (
                  <p className="text-small-medium text-grey-3">
                    {lastMessage.sender.username} sent a photo
                  </p>
                )
              ) : (
                <p className="text-small-medium text-grey-3">
                  {lastMessage.text}
                </p>
              )}
            </div>
          </>
        )}
      </div>

      <div>
        <p className="text-base-light text-grey-3">
          {format(new Date(lastMessage.createdAt), "p")}
        </p>
      </div>
    </div>
  );
};

export default ChatBox;
