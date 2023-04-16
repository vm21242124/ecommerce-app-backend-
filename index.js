import express from 'express'
import dotenv from 'dotenv'
import { connection } from './Config/DB.js';
import userRoute from "./Routes/userRoute.js"

const app=express();
//middleware
app.use(express.json())
app.use(express.urlencoded({extended: true }))
app.use(cookieparser())
dotenv.config();
connection();
try {
    
    app.listen(process.env.PORT,()=>console.log(`server on ${process.env.PORT}`))
} catch (error) {
    console.log(`listning error ${error}`)
    
}
//Routes
app.use("/api/user", userRoute);
