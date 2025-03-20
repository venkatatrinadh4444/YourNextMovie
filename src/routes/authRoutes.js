const express=require('express')
const routes=express.Router()
const {registerUser,loginUser}=require('../controllers/authControllers')

routes.post('/register-user',registerUser)
routes.post('/login-user',loginUser)

module.exports=routes