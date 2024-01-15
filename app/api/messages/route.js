import Chat from "@models/Chat";
import Message from "@models/Message";
import { connectToDB } from "@mongodb";
import { pusherServer } from "@lib/pusher";
import User from "@models/User";

export const POST = async (req) => {
  try {
    await connectToDB();

    const body = await req.json();

    const { chatId, currentUserId, text, photo } = body;

    // Get the user who sent the message
    const currentUser = await User.findById(currentUserId);

    const newMessage = await Message.create({
      chat: chatId,
      sender: currentUser,
      text,
      photo,
      seenBy: currentUserId,
    });

    // Update the chat by pushing the new message to the messages array
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { messages: newMessage._id },
        $set: { lastMessageAt: newMessage.createdAt },
      },
      { new: true }
    )
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

    /* Triggers a Pusher event for a specific chat about the new message */
    await pusherServer.trigger(chatId, "new-messages", newMessage);

    /* Triggers a Pusher event for each member of the chat about the chat update with the latest message */
    const lastMessage = updatedChat.messages[updatedChat.messages.length - 1];

    updatedChat.members.forEach(async (member) => {
      try {
        // Trigger the event for each member
        await pusherServer.trigger(member._id.toString(), "update-chat", {
          id: chatId,
          messages: [lastMessage],
        });
      } catch (error) {
        console.error(`Failed to trigger updated chat for all members`);
      }
    });

    return new Response(JSON.stringify(newMessage), { status: 200 });
  } catch (err) {
    console.log(err);
    return new Response("Failed to create a message", { status: 500 });
  }
};
