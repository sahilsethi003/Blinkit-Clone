import mongoose from "mongoose";
import dotenv from 'dotenv'
import CategoryModel from "../models/category.model.js";
import OrderModel from "../models/order.model.js";
import PromoCodeModel from "../models/promocode.model.js";
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

        // Drop legacy unique index on orderId if it exists in MongoDB database
        try {
            await OrderModel.collection.dropIndex("orderId_1")
            console.log("Successfully dropped legacy unique orderId index")
        } catch (idxError) {
            // Index doesn't exist or already dropped
        }

        // Auto-seed default promo codes if collection is empty
        try {
            const count = await PromoCodeModel.countDocuments();
            if (count === 0) {
                await PromoCodeModel.insertMany([
                    { code: "GROCIFY10", type: "percentage", value: 10, minOrder: 0, maxDiscount: 0, description: "Flat 10% OFF on all grocery orders", status: true },
                    { code: "SUPER50", type: "flat", value: 50, minOrder: 199, maxDiscount: 0, description: "Flat ₹50 OFF on orders above ₹199", status: true },
                    { code: "FRESH20", type: "percentage", value: 20, minOrder: 299, maxDiscount: 150, description: "20% OFF up to ₹150 on fresh items", status: true }
                ]);
                console.log("Seeded default promo codes to database");
            }
        } catch (promoErr) {
            console.log("Could not auto-seed promo codes:", promoErr.message);
        }

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