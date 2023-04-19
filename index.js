import express from 'express'
import dotenv from 'dotenv'
import { connection } from './Config/DB.js';
import cookieParser from 'cookie-parser';
import userRoute from "./Routes/userRoute.js"
import collectionroute from './Routes/collections.route.js'
import ProductRoute from './Routes/product.route.js'
import { config } from './Config/config.js';

const app=express();
//middleware
app.use(express.json())
app.use(express.urlencoded({extended: true }))
app.use(cookieParser())
dotenv.config();
connection();
try {
    
    app.listen(config.port,()=>console.log(`server on ${config.port}`))
} catch (error) {
    console.log(`listning error ${error}`)
    
}
//Routes
app.use("/api/user", userRoute);
app.use("/api/collections",collectionroute)
app.use("/api/product",ProductRoute)