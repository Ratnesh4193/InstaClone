
const mongoose = require("mongoose");
const {DB_USERNAME,DB_PASSWORD}=process.env

const DB=`mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@cluster0.c7iws.mongodb.net/instacloneDB?retryWrites=true&w=majority`

mongoose.connect(DB,{useNewUrlParser: true, useUnifiedTopology: true ,useFindAndModify: false }).then(()=>{
    console.log("Database connected successfully")
}).catch((err)=>{
    console.log("Database connection failed :" ,err)
});
mongoose.set("useCreateIndex",true)

