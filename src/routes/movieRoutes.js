const express=require('express')
const routes=express.Router()
const {addMovie,getMovies,fetchingRecommendedMovies,deleteRecommendedMovie,addLike,addComment,fetchingLikes,fetchingComments}=require('../controllers/movieControllers')
const authMiddleware=require('../middlewares/authMiddleware')
const upload=require('../middlewares/multer')

routes.post('/add-movie',authMiddleware,upload.single('image'),addMovie)
routes.get('/all-movies',getMovies)
routes.get('/your-recommendations',authMiddleware,fetchingRecommendedMovies)
routes.delete('/delete-your-recommendation/:id',authMiddleware,deleteRecommendedMovie)
routes.post('/add-like/:id',authMiddleware,addLike)
routes.post('/add-comment/:id',authMiddleware,addComment)
routes.get('/fetching-likes/:id',fetchingLikes)
routes.get('/fetching-comments/:id',fetchingComments)

module.exports=routes
