// Importing neccessary components
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import User from "../model/UserSchema.js"
import { hashPassword,hashCompare,LoginToken,ResetToken} from "../utils/Auth.js";

dotenv.config();

// Checking credentials of a User  - Login - Post
export const LoginUser = async(req,res)=>{
    try{
        const find_User = await User.findOne({Email:req.body.Email})
        if(find_User){
            if(req.body.Password){
                const Password_Status = await hashCompare(req.body.Password,find_User.Password)
                if(Password_Status){
                    let token = await LoginToken({
                        First_Name:find_User.First_Name,
                        Last_Name:find_User.Last_Name,
                        Email:find_User.Email,
                        Status:find_User.Status,
                        Id : find_User._id
                    })
                    res.status(200).send({message:"Login Successful",token})
                }
                else{
                    res.status(401).send({message:"Incorrect Password!"})
                }
            }
            else{
                res.status(400).send({message:"Password required"})
            }
        }
        else{
            res.status(400).send({message:"User not registered yet!"})
        }
    }
    catch(err){
        res.status(500).send({message:"Internal server error",err})
    }
}


// Creating a User - Signup - Post

export const CreateUser = async(req,res)=>{
    try{
        const find_User = await User.findOne({Email:req.body.Email})
        if(!find_User){
            let hashedPassword = await hashPassword(req.body.Password)
            req.body.Password = hashedPassword;
            const UserData = await User.create(req.body);
            await UserData.save();
            res.status(200).send({message:"User Signup Successful"})
        }
        else{
            res.status(400).send({message:"Email Id already exists!"})
        }
    }
    catch(err){
        res.status(400).send({message:"Try to send with First_Name,Last_Name,Email,Password",err})
    }
}


// Verifying User - PUT
export const VerifyUserLink = async(req,res)=>{
    try{
        const find_User = await User.findOne({Email: req.body.Email})
        if(!find_User){
            res.status(400).send({message:"User not found,Kindly Signup first"})
        }
        else{
            if(find_User.Status=="Active"){
                res.status(400).send({message:"User Account already Activated"})
            }
            else{
            // Generating a random string
            const String = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
            const ResetStringLength = 6;  //string length we want
            const StringLength = String.length;
            let ResetString ="";
            for(let i=0;i<ResetStringLength;i++){
                ResetString = ResetString + String.charAt(Math.floor(Math.random()*StringLength))
            }

            //Updating Reset String in Db
            const UpdateResetString = await User.updateOne({Email :req.body.Email},{$set:{VerifyPin : ResetString}})

            // Generating reset link
            let token = await ResetToken({
                Name : find_User.First_Name,
                Email : find_User.Email
            })
            const link = `https://miniurl-noru.onrender.com/users/verifyUser/${find_User._id}/${ResetString}/${token}`

            // for Sending mails - nodemailer
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                      user: 'hari1507hari@gmail.com',
                      pass: process.env.MAILPASS
                    }
                  });
                  
                  var mailOptions = {
                    from: 'hari1507hari@gmail.com',
                    to: find_User.Email,
                    subject: 'Verify Your MiniUrl Account ',
                    html:`<p>Kindly click the below link or copy and paste the link in your browser to verify your MiniUrl Account.<b>Your Link is valid for only 5 minutes</b></p><a href=${link}>Click here to verify account</a></br><p></p>copy and paste the link in your browser<p>${link}</p>`
                  };
                  
                  transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                      res.status(400).send(error)
                    } else {
                        res.status(200).send({message : `Verification Link sent to ${find_User.Email}`, "Mail" : info.response})
                    }
                });
            }
        }
    }
    catch(err){
        res.status(500).send({message : "Internal server error",err})
    }
}


// VerifyUser - GET
export const verifyUser =async(req,res)=>{
    try{
        const {id,pin,token} = req.params;
        // Validating the reset link
        const find_User = await User.findOne({_id: id})
        if(pin===find_User.VerifyPin){
            const verifyToken = await jwt.verify(token,process.env.SECRETKEY_RESET)
            if(Math.floor((+new Date())/1000) < verifyToken.exp){
                // Updating New Password
                const changeStatus = await User.updateOne({_id:id},{$set:{Status:"Active"}})
                const deleteResetPin = await User.updateOne({_id:id},{$unset:{VerifyPin:""}})
                res.status(200).send({message:"User Verified Successfully!"})
            }
            else{
                res.status(401).send({message:"Token expired or Token not found"})
            }
        }
        else{
            res.status(401).send({Error:"Unauthorized",message: "Token Expired or Token not found"})
        }
    }
    catch(err){
        res.status(500).send({message:"Internal Server Error",data :"Invalid Link",err})
    }
}


// Forgot Password - ForgotPassword - put

export const ForgotPassword = async(req,res)=>{
    try{
        const find_User = await User.findOne({Email: req.body.Email})
        if(!find_User){
            res.status(400).send({message:"User not found"})
        }
        else{
            // Generating a random string
            const String = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
            const ResetStringLength = 6;  //string length we want
            const StringLength = String.length;
            let ResetString ="";
            for(let i=0;i<ResetStringLength;i++){
                ResetString = ResetString + String.charAt(Math.floor(Math.random()*StringLength))
            }
            //Updating Reset String in Db
            const UpdateResetString = await User.updateOne({Email :req.body.Email},{$set:{ResetPin : ResetString}})
            // Generating reset link
            let token = await ResetToken({
                Name : find_User.First_Name,
                Email : find_User.Email
            })
            const link = `https://miniurl-noru.onrender.com/users/ResetPassword/${find_User._id}/${ResetString}/${token}`
            // for Sending mails - nodemailer
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                  user: 'hari1507hari@gmail.com',
                  pass: process.env.MAILPASS
                }
              });
              
              var mailOptions = {
                from: 'hari1507hari@gmail.com',
                to: find_User.Email,
                subject: 'Reset your Password',
                html:`<p>Kindly click the below link or copy and paste the link in your browser to reset your password.<b>Your Link is valid for only 5 minutes</b></p><a href=${link}>Click here to reset Password</a></br><p></p>copy and paste the link in your browser<p>${link}</p>`
              };
              
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  res.status(400).send(error)
                } else {
                    res.status(200).send({message : `Reset Link sent to ${find_User.Email}`, "Mail" : info.response})
                }
            });
        }
    }
    catch(err){
        res.status(500).send({message : "Internal server error",err})
    }
}

// Reset Password - Link Verification - Get
export const VerifyResetLink =async(req,res)=>{
    try{
        const {id,pin,token} = req.params;
        // Validating the reset link
        const find_User = await User.findOne({_id: id})
        if(pin===find_User.ResetPin){
            const verifyToken = await jwt.verify(token,process.env.SECRETKEY_RESET)
            if(Math.floor((+new Date())/1000) < verifyToken.exp){
                res.status(200).send({message:"Link is Valid!"})
            }
            else{
                console.log(verifyToken)
                res.status(401).send({message:"Token expired or Token not found"})
            }
        }
        else{
            res.status(401).send({Error:"Unauthorized",message: "Token Expired or Token not found"})
        }
    }
    catch(err){
        res.status(500).send({message:"Internal Server Error",data :"Send Password in req.body",err})
    }
}

// Reset Password - ResetPassword - Put
 export const PasswordReset =async(req,res)=>{
    try{
        const {id,pin,token} = req.params;
        // Validating the reset link
        const find_User = await User.findOne({_id: id})
        if(pin===find_User.ResetPin){
            const verifyToken = await jwt.verify(token,process.env.SECRETKEY_RESET)
            if(Math.floor((+new Date())/1000) < verifyToken.exp){
                // Updating New Password
                let hashedPassword = await hashPassword(req.body.Password)
                req.body.Password = hashedPassword;
                const updateNewPassword = await User.updateOne({_id:id},{$set:{Password:req.body.Password}});
                const deleteResetPin = await User.updateOne({_id:id},{$unset:{ResetPin:""}})
                res.status(200).send({message:"New Password Created Successfully!"})
            }
            else{
                res.status(401).send({message:"Token expired or Token not found"})
            }
        }
        else{
            res.status(401).send({Error:"Unauthorized",message: "Token Expired or Token not found"})
        }
    }
    catch(err){
        res.status(500).send({message:"Internal Server Error",data :"Send Password in req.body",err})
    }
}


// Delete a User - delete

export const DeleteUser = async(req,res)=>{
    try{
        const {id} = req.params;
        const find_User = await User.findOne({Email: id})
        if(find_User){
            const user = await User.deleteOne({Email:id})
            res.status(200).send({message:"User deleted successfully!"})
        }
        else{
            res.status(400).send({message:"User not found"})
        }
    }
    catch(err){
        res.status(500).send({message : "Internal server error",err})
    }
}