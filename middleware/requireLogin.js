const jwt=require('jsonwebtoken')
const SECRET=process.env.SECRET_KEY
const mongoose=require('mongoose')
const User = mongoose.model("User")


module.exports=(req,res,next)=>{
    
    const {authorization}=req.headers
    if(!authorization){
        return res.status(401).json({error:"Login first"})
    }
    const token=authorization.replace("Bearer ","")
    jwt.verify(token,SECRET,(err,payload)=>{
        if(err){
            return res.status(401).json({error:"Invalid token"})
        }
        const {_id}=payload;
        User.findById(_id).then(userData=>{
            req.user=userData
            next()
        })
    })
}