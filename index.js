const express = require('express');
const app = express();
const cors = require('cors');
require('./db/config');
const Users = require('./db/users');
const jwt = require("jsonwebtoken");
const jwtKey = "my_secret_key";
// const bodyParser = require('body-parser');
// this is for the frontend to access the backend
const PORT = process.env.PORT || 8000;
app.use(express.json());
// this is to allow across the frontend and backend
app.use(cors());
// this is for sign up api:
app.post("/register",async(req,res)=>{
    const data = req.body;
    // console.log(data.name);
    if( !data.name || !data.email || !data.phone || !data.password || !data.dob || !data.address || !data.city){
        res.send({result:"Plz Enter All Fields"});
    }else{
            let userEmailExists = await Users.find({email:data.email}).exec();
            let userPhoneExists = await Users.find({phone:data.phone}).exec();
            if(userEmailExists.length>0 || userPhoneExists.length>0){
                res.send({result:"User Already Exists"});
            }else{
                try {
                const userData = new Users(data);
                let result = await userData.save();
                result = result.toObject();
                delete result.password;
                // console.log(result);
                    if(result){
                        jwt.sign({result},jwtKey,{expiresIn:"2h"},(err,token)=>{
                            if(err){
                                res.status(404).send({result:"Error in Token"});
                            }else{
                                res.status(200).send({result,token});
                            }
                        })
                        // res.status(200).send(result);
                    }else{
                        res.status(409).send({result:"Error in registering user"});
                    }
                } catch (error) {
                    res.send({error});
                }
            }
    }
})
app.post("/login",async(req,res)=>{
    const data =req.body;
    if(!data.email || !data.password){
        res.send({result:"Plz Enter All Fields"});
    }else{
        let result = await Users.findOne(data)
        if(result){
            jwt.sign({result},jwtKey,{expiresIn:"2h"},(err,token)=>{
                if(err){
                    res.status(409).send({result:"Error in JWT Token"});
                }else{
                    res.status(200).send({result,token});
                }
            })
            // res.status(200).send({result});
        }else{
            res.status(404).send({result:"User Not Found"});
        }
    }
})
app.listen(8000,()=>{
    console.log(`Server started at port http://localhost:${PORT}`);
})