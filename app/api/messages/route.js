import Chat from "@models/Chat";
import Message from "@models/Message";
import { connectToDB } from "@mongodb";

export const POST = async (req) => {
  try {
    await connectToDB();

    const body = await req.json();

    const { chatId, currentUserId, text, photo } = body;

    const newMessage = await Message.create({
      chat: chatId,
      sender: currentUserId,
      text,
      photo,
      seenBy: currentUserId,
    });

    // Update the chat by pushing the new message to the messages array
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { 
        $push: { messages: newMessage._id }, 
        $set: { lastMessageAt: newMessage.createdAt } 
      },
      { new: true }
    );

    return new Response(JSON.stringify(newMessage), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("Failed to create a message", { status: 500 });
  }
};
