import mongoose from "mongoose";

const promoCodeSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, "Provide promo code"],
        unique: true,
        uppercase: true,
        trim: true
    },
    type: {
        type: String,
        enum: ["percentage", "flat"],
        default: "percentage"
    },
    value: {
        type: Number,
        required: [true, "Provide discount value"],
        min: 0
    },
    minOrder: {
        type: Number,
        default: 0
    },
    maxDiscount: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        required: [true, "Provide promo description"],
        trim: true
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const PromoCodeModel = mongoose.model("promocode", promoCodeSchema);

export default PromoCodeModel;
