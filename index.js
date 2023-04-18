import express from 'express'
import dotenv from 'dotenv'
import { connection } from './Config/DB.js';
import cookieParser from 'cookie-parser';
import userRoute from "./Routes/userRoute.js"
import collectionroute from './Routes/collections.route.js'
import ProductRoute from './Routes/product.route.js'

const app=express();
//middleware
app.use(express.json())
app.use(express.urlencoded({extended: true }))
app.use(cookieParser())
dotenv.config();
connection();
try {
    
    app.listen(process.env.PORT,()=>console.log(`server on ${process.env.PORT}`))
} catch (error) {
    console.log(`listning error ${error}`)
    
}
//Routes
app.use("/api/user", userRoute);
app.use("/api/collections",collectionroute)
app.use("/api/product",ProductRoute)