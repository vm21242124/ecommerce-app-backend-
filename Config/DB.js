import mongoose from "mongoose"
export  const connection=async()=>{
    try {
        
        await mongoose.connect(process.env.DBURL)
        console.log(`connected to db`)
    } catch (error) {
        console.log("db connnection failed "+error)
        
    }
}