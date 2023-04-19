import mongoose from "mongoose"
import { config } from "./config.js"

export  const connection=async()=>{
    try {
        
        await mongoose.connect(config.dburl)
        console.log(`connected to db`)
    } catch (error) {
        console.log("db connnection failed "+error)
        
    }
}