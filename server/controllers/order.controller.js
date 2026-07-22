import CartProductModel from "../models/cartproduct.model.js";
import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";
import mongoose from "mongoose";
import Razorpay from "razorpay";
import crypto from "crypto";

 export async function CashOnDeliveryOrderController(request,response){
    try {
        const userId = request.userId // auth middleware 
        const { list_items, totalAmt, addressId,subTotalAmt } = request.body 

        const checkoutOrderId = `ORD-${new mongoose.Types.ObjectId()}`

        const payload = list_items.map(el => {
            return({
                userId : userId,
                orderId : checkoutOrderId,
                productId : el.productId._id, 
                product_details : {
                    name : el.productId.name,
                    image : el.productId.image
                } ,
                paymentId : "",
                payment_status : "CASH ON DELIVERY",
                delivery_address : addressId ,
                subTotalAmt  : subTotalAmt,
                totalAmt  :  totalAmt,
            })
        })

        const generatedOrder = await OrderModel.insertMany(payload)

        ///remove from the cart
        const removeCartItems = await CartProductModel.deleteMany({ userId : userId })
        const updateInUser = await UserModel.updateOne({ _id : userId }, { shopping_cart : []})

        return response.json({
            message : "Order successfully",
            error : false,
            success : true,
            data : generatedOrder
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error ,
            error : true,
            success : false
        })
    }
}

export const pricewithDiscount = (price,dis = 1)=>{
    const discountAmout = Math.ceil((Number(price) * Number(dis)) / 100)
    const actualPrice = Number(price) - Number(discountAmout)
    return actualPrice
}



export async function getOrderDetailsController(request,response){
    try {
        const userId = request.userId // order id

        const orderlist = await OrderModel.find({ userId : userId }).sort({ createdAt : -1 }).populate('delivery_address')

        return response.json({
            message : "order list",
            data : orderlist,
            error : false,
            success : true
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

// Razorpay: Create Order Controller
export async function createRazorpayOrderController(request, response) {
    try {
        const userId = request.userId; // auth middleware
        const { amount } = request.body; // amount in INR or paise? The frontend will send total price in INR (e.g. 10.50). 
        // We must convert to paise (total * 100). Let's accept amount in paise (e.g. totalAmt * 100) or check.
        // Wait, standard Razorpay API requires amount in paise (integers).
        // Let's validate the amount.
        if (!amount || amount < 100) {
            return response.status(400).json({
                message: "Amount is required and must be at least 100 paise (1 INR).",
                error: true,
                success: false
            });
        }

        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const options = {
            amount: Math.round(amount), // in paise
            currency: "INR",
            receipt: `rcpt_${new mongoose.Types.ObjectId().toString().substring(0, 15)}`,
        };

        const order = await razorpay.orders.create(options);

        if (!order) {
            return response.status(500).json({
                message: "Error creating Razorpay order",
                error: true,
                success: false
            });
        }

        return response.json({
            order_id: order.id,
            amount: order.amount,
            currency: order.currency,
            success: true,
            error: false
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

// Razorpay: Verify Payment and Save Order Controller
export async function verifyPaymentController(request, response) {
    try {
        const userId = request.userId; // auth middleware
        const {
            razorpay_payment_id,
            razorpay_order_id,
            razorpay_signature,
            list_items,
            addressId,
            subTotalAmt,
            totalAmt
        } = request.body;

        if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
            return response.status(400).json({
                message: "Missing required payment fields",
                error: true,
                success: false
            });
        }

        // Verify HMAC-SHA256 signature
        const generated_signature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest('hex');

        if (generated_signature !== razorpay_signature) {
            return response.status(400).json({
                message: "Signature verification failed. Mismatch.",
                error: true,
                success: false
            });
        }

        // Signature is valid. Create orders in DB
        const checkoutOrderId = `ORD-${new mongoose.Types.ObjectId()}`
        const payload = list_items.map(el => {
            return {
                userId : userId,
                orderId : checkoutOrderId,
                productId : el.productId._id, 
                product_details : {
                    name : el.productId.name,
                    image : el.productId.image
                } ,
                paymentId : razorpay_payment_id,
                payment_status : "PAID",
                delivery_address : addressId ,
                subTotalAmt  : subTotalAmt,
                totalAmt  :  totalAmt,
            };
        });

        const generatedOrder = await OrderModel.insertMany(payload);

        // Clear user's shopping cart in DB
        await CartProductModel.deleteMany({ userId : userId });
        await UserModel.updateOne({ _id : userId }, { shopping_cart : [] });

        return response.json({
            message: "Payment verified and order created successfully",
            error: false,
            success: true,
            data: generatedOrder
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}
