const express=require('express')
const routes=express.Router()
const {registerUser,loginUser}=require('../controllers/authControllers')
const authMiddleware=require('../middlewares/authMiddleware')
const User=require('../models/User')

routes.post('/register-user',registerUser)
routes.post('/login-user',loginUser)
routes.get('/profile',authMiddleware,async(req,res)=>{
    const {_id}=req.user
    const exist=await User.findById(_id)
    if(!exist)
        return res.status(404).json({msg:'user not found!'})
    return res.status(200).json({msg:'user is verified',exist})
})

module.exports=routes