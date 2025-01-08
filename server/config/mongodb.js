import mongoose from "mongoose";

const connectDB = async () => {

    mongoose.connection.on("connected", () => {
        console.log("MongoDB connected")
    })
    
    mongoose.connection.on("error", (err) => {
        console.error(`MongoDB connection error: ${err.message}`)
        process.exit(1)
    })
    
    mongoose.connection.on("disconnected", () => {
        console.log("MongoDB disconnected")
    })

    await mongoose.connect(`${process.env.MONGODB_URI}/imager`)
}

export default connectDB