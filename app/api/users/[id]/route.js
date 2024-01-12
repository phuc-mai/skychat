import Chat from "@models/Chat";
import Message from "@models/Message";
import User from "@models/User";
import { connectToDB } from "@mongodb";

export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    const { id: currentUserId } = params;

    const allChats = await Chat.find({ members: currentUserId })
      .sort({ lastMessageAt: -1 })
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

    return new Response(JSON.stringify(allChats), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("Failed to get all chats", { status: 500 });
  }
};
