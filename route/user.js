const express=require('express')
const router= express.Router()
const mongoose=require('mongoose')

const requireLogin=require("../middleware/requireLogin")
const Post=mongoose.model("Post")
const User=mongoose.model("User")

router.get('/profile/:userId',(req,res)=>{
	User.findOne({_id:req.params.userId})
	.select("-password")
	.then(user=>{
		Post.find({postedBy:req.params.userId})
		.populate("postedBy","_id name")
		.exec((err,posts)=>{
			if(err){
				return res.status(404).json({error:err})
			}
			res.json({user,posts})
		})
	})
	.catch(err=>{
		return res.status(404).json({error:"User not found"})
	})
})


router.put('/follow',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.followId,{
        $push:{followers:req.user._id} //pushing id of the user whom current user is following
    },{
        new:true
    }).exec((err,result)=>{
            if(err || ! result){
                return res.status(422).json({error:err})
            }
            User.findByIdAndUpdate(req.user._id,{
            	$push:{following:req.body.followId}
            },{
		        new:true
		    }).select("-password").exec((err,result)=>{
		    	if(err || ! result){
	                return res.status(422).json({error:err})
	            }else{
	            	res.json(result)
	            }
		    })
        })
})

router.put('/unfollow',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.unFollowId,{
        $pull:{followers:req.user._id} //pushing id of the user whom current user is following
    },{
        new:true
    }).exec((err,result)=>{
            if(err || ! result){
                return res.status(422).json({error:err})
            }
            User.findByIdAndUpdate(req.user._id,{
            	$pull:{following:req.body.unFollowId}
            },{
		        new:true
		    }).select("-password").exec((err,result)=>{
		    	if(err || ! result){
	                return res.status(422).json({error:err})
	            }else{
	            	res.json(result)
	            }
		    })
        })
})


router.put('/updateProfilePic',requireLogin,(req,res)=>{
	// console.log(req.body)
	// console.log(req.user)
	// console.log(5)
	// res.json({message:"working"})
	User.findByIdAndUpdate(req.user._id,{
        profilePic: req.body.url //pulling id of the user who disliked the post
    },{
        new:true
    })
    .select("-password")
    .populate("postedBy","_id name")
    .exec((err,result)=>{
            if(err){
                return res.status(422).json({error:err})
            }else{
                res.json(result)
            }
        })
})


router.post('/search-users',(req,res)=>{
	console.log(req.body.query)
    let userPattern = new RegExp("^"+req.body.query)
    User.find({email:{$regex:userPattern}})
    .select("_id email")
    .then(user=>{
        res.json({user})
    }).catch(err=>{
        console.log(err)
    })

})

module.exports=router