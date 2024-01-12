import mongoose from "mongoose";

let isConnected = false // Track the connection

export const connectToDB = async() => {
  mongoose.set('strictQuery', true)

  if (isConnected) {
    console.log("MongoDB is already connected!")
    return
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: "SkyChat",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    isConnected = true
    
    console.log("MongoDB is connected successfully!")
  } catch (error) {
    console.log(error)
  }
}