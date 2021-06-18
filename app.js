const express=require('express')
var bodyParser = require('body-parser')
 
var app = express()
 
// create application/json parser
var jsonParser = bodyParser.json()
 app.use(jsonParser)
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })
const mongoose = require("mongoose");

require('dotenv').config()     //for accessing env variables
require('./db/conn')
require('./models/userSchema')
require('./models/postSchema')

app.use(require('./route/auth'))
app.use(require('./route/post'))
app.use(require('./route/user'))



app.use(express.json())
const PORT=process.env.PORT||5000

if(process.env.NODE_ENV=="production"){
    app.use(express.static('client/build'))
    const path = require('path')
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

app.listen(PORT,()=>{
    console.log(`server running at ${PORT}`)
})