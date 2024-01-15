import { pusherServer } from "@lib/pusher";
import Chat from "@models/Chat";
import Message from "@models/Message";
import User from "@models/User";
import { connectToDB } from "@mongodb";

export const POST = async (req) => {
  try {
    await connectToDB();

    const body = await req.json();

    const { currentUserId, members, isGroup, name, groupPhoto } = body;

    // Define "query" to find the chat
    const query = isGroup
      ? { isGroup, name, groupPhoto, members: [currentUserId, ...members] }
      : { members: { $all: [currentUserId, ...members], $size: 2 } };

    let chat = await Chat.findOne(query);

    if (!chat) {
      chat = new Chat(
        isGroup ? query : { members: [currentUserId, ...members] }
      );

      chat = await chat.save();

      const populatedChat = await Chat.findById(chat._id)
        .sort({ lastMessageAt: 1 })
        .populate({
          path: "messages",
          model: Message,
          populate: { path: "sender seenBy", model: User },
        })
        .populate({
          path: "members",
          model: User,
        })
        .exec();

      /* Adds new chat to the current user's chats array */
      await User.findByIdAndUpdate(
        currentUserId,
        { $addToSet: { chats: chat._id } },
        { new: true }
      );

      /* Triggers a Pusher event for each member of the chat, notifying them about new chat */
      chat.members.map((member) => {
        pusherServer.trigger(member._id.toString(), "new-chat", populatedChat);
      });
    }

    return new Response(JSON.stringify(populatedChat), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("Failed to create a new chat", { status: 500 });
  }
};
