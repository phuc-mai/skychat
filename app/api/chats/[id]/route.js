import Chat from "@models/Chat"
import Message from "@models/Message"
import User from "@models/User"
import { connectToDB } from "@mongodb"

export const GET = async (req, { params }) => {
  try {
    await connectToDB()

    const { id: chatId } = params

    const chat = await Chat.findById(chatId).sort({ lastMessageAt: 1 })
    .populate({
      path: "messages",
      model: Message,
      populate: { path: "sender seenBy", model: User },
    })
    .populate({
      path: "members",
      model: User,
    })
    .exec()

    return new Response(JSON.stringify(chat), { status: 200 })
  } catch (err) {
    return new Response("Failed to get the chat by Id", { status: 500 })
  }
}

export const POST = async (req, { params }) => {
  try {
    await connectToDB()

    const { id: chatId } = params

    const body = await req.json()

    const { currentUserId } = body

    await Message.updateMany(
      { chat: chatId },
      { $addToSet: { seenBy: currentUserId } },
      { new: true }
    ).populate("seenBy")

    return new Response("Seen all messages of chat", { status: 200 })
  } catch (err) {
    return new Response("Failed to get the chat by Id", { status: 500 })
  }
}