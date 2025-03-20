const mongoose=require('mongoose')

const movieSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    image:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    likes:[ {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    }
    ],
    comments:[{
        user:{
            type:mongoose.Schema.Types.ObjectId,
            reg:"User"
        },
        text:{
            type:String
        },
        date:{
            type:Date,
            default:Date.now
        }
    }
    ]
},{timestamps:true,versionKey:false})

module.exports=mongoose.model("Movie",movieSchema)