import mongoose from "mongoose";
import dotenv from 'dotenv'
import CategoryModel from "../models/category.model.js";
dotenv.config()

if(!process.env.MONGODB_URI){
    throw new Error(
        "Please provide MONGODB_URI in the .env file"
    )
}

async function connectDB(){
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("connect DB")

        // Auto-fix Paan Corner image if it exists in database
        try {
            const paanCategory = await CategoryModel.findOne({ name: { $regex: /paan|pan/i } });
            if (paanCategory) {
                paanCategory.image = "https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=800&auto=format&fit=crop&q=80";
                await paanCategory.save();
                console.log("Automatically updated Paan Corner category image to a premium design");
            }
        } catch (dbErr) {
            console.log("Could not update Paan Corner image on start:", dbErr.message);
        }
    } catch (error) {
        console.log("Mongodb connect error",error)
        process.exit(1)
    }
}

export default connectDB