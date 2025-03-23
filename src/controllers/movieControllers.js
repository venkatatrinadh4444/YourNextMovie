const Movie=require('../models/Movie')
const cloudinary=require('../middlewares/cloudinary')
const fs=require('fs')

const addMovie=async(req,res)=> {
    try {
        const {title,rating,description}=req.body;
        const imagePath=req.file?.path

        if(!imagePath || !title || !rating || !description)
            return res.status(400).json({msg:"All fields are required!"})

        const uploadResponse=await cloudinary.uploader.upload(imagePath)
        const imageUrl=uploadResponse.secure_url;
        
        const newMovie=new Movie({
            user:req.user._id,
            image:imageUrl,
            title,
            rating,
            description
        })
        await newMovie.save()
        fs.unlinkSync(imagePath)
        return res.status(200).json({msg:"Movie added successfully!"})
    }
    catch(err) {
        console.log("Error occured at addMovie",err)
        return res.status(500).json({msg:"server error"})
    }
}

const getMovies=async(req,res)=> {
    try {
        const page=Number(req.query.page) || 1
        const limit=Number(req.query.limit) || 5
        const skip=(page-1)*limit

        const movies=await Movie.find().sort({createdAt:-1}).skip(skip).limit(limit).populate("user","username profileImg")

        const totalMovies=await Movie.countDocuments();

        return res.status(200).json({
            movies,
            currentPage:page,
            totalMovies,
            totalPages:Math.ceil(totalMovies/limit)
        })

    } catch (error) {
        console.log('Error occured at getMovies',err)
        return res.status(500).json({msg:"server error"})
    }
}

const fetchingRecommendedMovies=async(req,res)=> {
    try {
        const {_id}=req.user
        const movies=await Movie.find({user:_id}).sort({createdAt:-1})

        return res.status(200).json({yourRecommendedMovies:movies})
    } catch (error) {
        console.log("Error occured at fetching recommended movies",err)
        return res.status(500).json({msg:"server error"})
    }
}

const deleteRecommendedMovie=async(req,res)=> {
    try {
        const id=req.params.id
        const {_id}=req.user
        const movie=await Movie.findById(id)
        const publicId=movie.image.split('/').pop().split('.')[0]
        await cloudinary.uploader.destroy(publicId)

        await Movie.findByIdAndDelete(id)

        return res.status(200).json({msg:"movie deleted successfully!",updatedMovies:await Movie.find({user:_id}).sort({createdAt:-1})})
    }
    catch(err) {
        console.log('Error occured at deleting recommended movies',err)
        return res.status(500).json({msg:'server error'})
    }
}

const addLike=async(req,res)=> {
    try {
        const {_id}=req.user
        const {id}=req.params

        const likedMovie=await Movie.findById(id)
        const isLiked=likedMovie.likes.some(eachLike=>eachLike.user.toString()===_id)

        if(isLiked) {
            const updatedMovie=await Movie.findByIdAndUpdate(id,{$pull:{likes:{user:_id}}},{new:true})
            return res.status(200).json({msg:'like removed',updatedLikes:updatedMovie.likes.length})
        }
        else {
            const updatedMovie=await Movie.findByIdAndUpdate(id,{$push:{likes:{user:_id}}},{new:true})
            return res.status(200).json({msg:'like added',updatedLikes:updatedMovie.likes.length})
        }
            
    } catch (err) {
        console.log('Error occured at like funtion',err)
        return res.status(500).json({msg:"server error"})
    }
}


const addComment=async(req,res)=> {
    try {
        const {_id}=req.user
        const {text}=req.body;
        const {id}=req.params
        const currentMovie=await Movie.findByIdAndUpdate(id,{$push:{
            comments:{
                user:_id,
                text
            }
        }},{new:true}).populate('comments.user','username')

        return res.status(200).json({msg:'comment added',updatedComments:currentMovie.comments})
    } catch (error) {
        console.log('Error occured at comment funtion',error)
        return res.status(500).json({msg:"server error"})
    }
}

const fetchingLikes=async(req,res)=> {
    try {
        const {id}=req.params
        const currentMovie=await Movie.findById(id)
        return res.status(200).json({likedCount:currentMovie.likes.length})
    } catch (error) {
        console.log('Error occured at fetching likes',error)
        return res.status(500).json({msg:'server eroor'})
    }
}

const fetchingComments=async(req,res)=> {
    try {
        const {id}=req.params
        const currentMovie=await Movie.findById(id).populate({
            path:'comments.user',
            select:'username'
        })

        return res.status(200).json({comments:currentMovie.comments})
    } catch (error) {
        console.log("Error occured at fetching movie comments",error)
        return res.status(500).json({msg:"server error"})
    }
}



module.exports={addMovie,getMovies,fetchingRecommendedMovies,deleteRecommendedMovie,addLike,addComment,fetchingLikes,fetchingComments}