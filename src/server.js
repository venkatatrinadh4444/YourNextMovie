require('dotenv').config()
const express=require('express')
const mongoose=require('mongoose')
const authRoutes=require('./routes/authRoutes')
const movieRoutes=require('./routes/movieRoutes')
const cors=require('cors')

const PORT=process.env.PORT || 5000
const app=express()
app.use(cors({origin:"*"}))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/auth',authRoutes)
app.use('/movies',movieRoutes)

mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("MONGO DB connected successfully!")
}).catch(err=>console.log("Error occured at database connetion",err))

app.listen(process.env.PORT,()=> {
    console.log(`Server started and running at ${PORT}`)
})
