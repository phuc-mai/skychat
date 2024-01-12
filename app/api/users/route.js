import User from "@models/User"
import { connectToDB } from "@mongodb"

export const GET = async (req) => {
  try {
    await connectToDB()

    const allUsers = await User.find().exec()

    return new Response(JSON.stringify(allUsers), { status: 200 })
  } catch (err) {
    return new Response("Failed to get all users", { status: 500 })
  }
}
