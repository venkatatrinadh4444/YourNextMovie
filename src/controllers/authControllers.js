const User=require('../models/User')
const jwt=require('jsonwebtoken')


const registerUser=async(req,res)=> {
    try {
        const {username,email,password}=req.body;
        if(!username || !email || !password)
            return res.status(400).json({msg:"All fields are required"})
        const exist=await User.findOne({email})
        if(exist)
            return res.status(409).json({msg:"user already exists"})
        if(username.length<3)
            return res.status(400).json({msg:"username must container atleast 3 characters"})
        if(password.length<6)
            return res.status(400).json({msg:"password must contains atleast 6 characters"})
        const newUser=new User({
            username,
            email,
            password,
            profileImg:`https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
        })
        await newUser.save()
        return res.status(200).json({msg:"User registered successfully!"})
    }
    catch(err) {
        console.log(err)
        return res.status(500).json({msg:"server error"})
    }
}


const loginUser=async(req,res)=> {
    try {
        const {email,password}=req.body;
        const exist=await User.findOne({email})
        if(!exist)
            return res.status(404).json({msg:"Invalid credentials"})

        const isValid=await exist.comparePassword(password)
        if(!isValid)
            return res.status(400).json({msg:"Invalid credentials"})
        const token=jwt.sign({_id:exist._id},process.env.SCECRET_KEY,{expiresIn:'1h'})
        return res.status(200).json({msg:"Login successful!",token})
    }
    catch(err) {
        console.log(err)
        return res.status(500).json({msg:"server error"})
    }
}

module.exports={registerUser,loginUser}