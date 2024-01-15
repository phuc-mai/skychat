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

export const POST = async (req, { params }) => {
  try {
    await connectToDB();

    const { id: currentUserId } = params;

    const body = await req.json();

    const { username, profileImage } = body;

    const user = await User.findByIdAndUpdate(
      currentUserId,
      {
        username,
        profileImage,
      },
      { new: true }
    ).exec(
    );

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("Failed to update profile", { status: 500 });
  }
}
