import Chat from "@models/Chat";
import Message from "@models/Message";
import User from "@models/User";
import { connectToDB } from "@mongodb";

export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    const currentUserId = params.id;
    const query = params.query;

    const searchedChats = await Chat.find({
      members: currentUserId,
      name: { $regex: query, $options: "i" },
    })
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

    return new Response(JSON.stringify(searchedChats), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Failed to get searched chats", { status: 500 });
  }
};
