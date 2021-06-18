const express=require('express')
const router= express.Router()
const mongoose=require('mongoose')

const requireLogin=require("../middleware/requireLogin")
const Post=mongoose.model("Post")



router.get('/allpost',requireLogin,(req,res)=>{
    Post.find()
    .populate("postedBy","_id name profilePic")
    .populate("comments.postedBy","_id name profilePic")
    .sort('-createdAt')
    .then(posts=>{
        
        res.json({posts})
    })
    .catch(err=>{console.log(err)})
})

router.get('/feed',requireLogin,(req,res)=>{
    Post.find({postedBy:{$in:req.user.following}})  // if the postedBy user is in user's following list  
    .populate("postedBy","_id name profilePic")
    .populate("comments.postedBy","_id name profilePic")
    .sort('-createdAt')
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{console.log(err)})
})
router.get('/feed/:userId',requireLogin,(req,res)=>{
    console.log(req.params.userId)
    Post.find({postedBy:req.params.userId})  // if the postedBy user is in user's following list  
    .populate("postedBy","_id name profilePic")
    .populate("comments.postedBy","_id name profilePic")
    .sort('-createdAt')
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{console.log(err)})
})


router.get('/mypost',requireLogin,(req,res)=>{
    Post.find({postedBy:req.user._id})
    .populate("postedBy","_id name profilePic")
    .populate("comments.postedBy","_id name profilePic")
    .sort('-createdAt')
    .then(myposts=>{
        res.json({myposts})
    })
    .catch(err=>{console.log(err)})
})

router.post('/createpost',requireLogin,(req,res)=>{
    const {title,body,url}=req.body
    if(!title || !body || !url){
        return res.status(422).json({error:"Please add all fields"})
    }
    // https://res.cloudinary.com/demo/image/upload/w_400,h_120,c_scale/turtles.jpg
    const resize_url=url.replace("upload/","upload/w_498,h_498,c_scale/")
        req.user.password=undefined
        req.user.__v=undefined
        const post =new Post({
            title,
            body,
            photo:resize_url,
            postedBy:req.user
        })
        post.save()
        .then(saved=>{return res.json({message:"Posted Successfully"})})
        .catch(err=>{console.log(err)})
          
})

router.put('/like',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id} //pushing id of the user who liked the post
    },{
        new:true
    })
    .populate("comments.postedBy","_id name profilePic")
    .populate("postedBy","_id name profilePic")
    .exec((err,result)=>{
            if(err){
                return res.status(422).json({error:err})
            }else{
                res.json(result)
            }
        })
})
router.put('/dislike',requireLogin,(req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id} //pulling id of the user who disliked the post
    },{
        new:true
    })
    .populate("comments.postedBy","_id name profilePic")
    .populate("postedBy","_id name profilePic")
    .exec((err,result)=>{
            if(err){
                return res.status(422).json({error:err})
            }else{
                res.json(result)
            }
        })
})

router.put('/comment',requireLogin,(req,res)=>{
    const comment = {
        text:req.body.text,
        postedBy:req.user._id,
        createdAt:Date.now()
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate("comments.postedBy","_id name profilePic")
    .populate("postedBy","_id name profilePic")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})

router.delete('/deletepost/:postId',requireLogin,(req,res)=>{

    Post.findById(req.params.postId)
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err || !post){
            return res.status(422).json({error:err})
        }else{
            if(post.postedBy._id.toString()===req.user._id.toString()){
                post.remove()
                .then(result=>{
                    res.json(result)
                }).catch(err=>{
                    console.log(err)
                })
            }
        }
    })
})
router.delete('/deletecomment/:postId/:commentId',(req,res)=>{
    const comment={
        _id:req.params.commentId
    }
    Post.findByIdAndUpdate(req.params.postId,{
        $pull:{comments:comment}
    },{
        new:true
    })
    .populate("comments.postedBy","_id name profilePic")
    .populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err || !result){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
    
})


module.exports=router