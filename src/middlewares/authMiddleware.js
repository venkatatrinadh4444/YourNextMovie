const jwt=require('jsonwebtoken')

const authMiddleware=async(req,res,next)=> {
    try {
        const authHeaders=req.headers.authorization
        if(!authHeaders)
            return res.status(404).json({msg:"token not found!"})
        const token=authHeaders.split(" ")[1]
        if(!token)
            return res.status(404).json({msg:"token not found!"})
        jwt.verify(token,process.env.SCECRET_KEY,(err,decoded)=>{
            if(err)
                return res.status(404).json({msg:"Invalid or expired token"})
            req.user=decoded
            next()
            return res.status(200)
        })
    }
    catch(err) {
        console.log("Error occured at token verification",err)
        return res.status(500).json({msg:"server error"})
    }
}

module.exports=authMiddleware