import Chat from "@models/Chat";
import User from "@models/User";
import { connectToDB } from "@mongodb";

export const POST = async (req) => {
  try {
    await connectToDB();

    const body = await req.json();

    const { currentUserId, partnerId, name, members, isGroup } = body;

    // Defind "query" to find the chat
    const query = isGroup
      ? { isGroup, name, members: [currentUserId, ...members] }
      : { members: { $all: [currentUserId, partnerId], $size: 2 } };

    let chat = await Chat.findOne(query);

    if (!chat) {
      chat = new Chat(
        isGroup ? query : { members: [currentUserId, partnerId] }
      );
      await chat.save();
    }

    return new Response(JSON.stringify(chat), { status: 200 });
  } catch (err) {
    return new Response("Failed to create a new chat", { status: 500 });
  }
};

