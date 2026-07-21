import { Router } from 'express'
import auth from '../middleware/auth.js'
import { CashOnDeliveryOrderController, getOrderDetailsController, createRazorpayOrderController, verifyPaymentController } from '../controllers/order.controller.js'

const orderRouter = Router()

orderRouter.post("/cash-on-delivery",auth,CashOnDeliveryOrderController)
orderRouter.get("/order-list",auth,getOrderDetailsController)

orderRouter.post("/razorpay-create", auth, createRazorpayOrderController)
orderRouter.post("/razorpay-verify", auth, verifyPaymentController)

export default orderRouter