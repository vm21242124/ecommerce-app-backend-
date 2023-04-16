export const asyncHandler=(fn)=>async(req,res,next)=>{
    try {
        await fn(req,res,next);
    } catch (error) {
        if(error.code===11000){
            error.code=409
        }
        res.status(error.code).json({
            success:false,
            message:error.message
        })
    }
}