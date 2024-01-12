import { connectToDB } from "@mongodb"
import User from "@models/User"
import { hash } from "bcryptjs"

export const POST = async (req) => {
  try {
    await connectToDB()

    const body = await req.json()
    
    const { username, email, password } = body

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return new Response("User already exists!", { status: 409 })
    }

    const hashedPassword = await hash(password, 12)

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    })

    await newUser.save()

    return new Response(JSON.stringify(newUser), { status: 200 })    
  } catch (err) {
    console.log(err)
    return new Response("Failed to create a new user", { status: 500 })
  }
}