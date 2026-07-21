import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import helmet from 'helmet'
import connectDB from './config/connectDB.js'
import userRouter from './route/user.route.js'
import categoryRouter from './route/category.route.js'
import uploadRouter from './route/upload.router.js'
import subCategoryRouter from './route/subCategory.route.js'
import productRouter from './route/product.route.js'
import cartRouter from './route/cart.route.js'
import addressRouter from './route/address.route.js'
import orderRouter from './route/order.route.js'

const app = express()
const allowedOrigins = [
    process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/$/, "") : null,
    "http://localhost:5173",
    "http://127.0.0.1:5173"
].filter(Boolean);

app.use(cors({
    credentials : true,
    origin : function (origin, callback) {
        if (!origin) return callback(null, true);
        const normalizedOrigin = origin.replace(/\/$/, "");
        if (allowedOrigins.includes(normalizedOrigin) || normalizedOrigin.startsWith("http://localhost:") || normalizedOrigin.startsWith("http://127.0.0.1:")) {
            return callback(null, true);
        }
        console.error("CORS Blocked for Origin:", origin, "Allowed Origins:", allowedOrigins);
        return callback(new Error('CORS not allowed: ' + origin), false);
    }
}))
app.use(express.json())
app.use(cookieParser())
app.use(morgan())
app.use(helmet({
    crossOriginResourcePolicy : false
}))

const PORT = process.env.PORT || 8080 

app.get("/",(request,response)=>{
    ///server to client
    response.json({
        message : "Server is running Hello " + PORT
    })
})

app.use('/api/user',userRouter)
app.use("/api/category",categoryRouter)
app.use("/api/file",uploadRouter)
app.use("/api/subcategory",subCategoryRouter)
app.use("/api/product",productRouter)
app.use("/api/cart",cartRouter)
app.use("/api/address",addressRouter)
app.use('/api/order',orderRouter)

// Connect to Database
connectDB()

// Start local server if not on Vercel
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log("Server is running on port", PORT)
    })
}

export default app;

