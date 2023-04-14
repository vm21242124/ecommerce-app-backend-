import express from 'express'
import dotenv from 'dotenv'
import { connection } from './Config/DB.js';
import User from './Routes/UserRoute.js'
const app=express();
//middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
dotenv.config();
connection();
try {
    
    app.listen(process.env.PORT,()=>console.log(`server on ${process.env.PORT}`))
} catch (error) {
    console.log(`listning error ${error}`)
    
}
//Routes
app.use('api/v1/auth',User);
