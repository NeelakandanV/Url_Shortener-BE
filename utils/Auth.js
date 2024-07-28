// Importing neccessary components
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Password Hashing
export const hashPassword = async(password)=>{
    const salt = await bcrypt.genSalt(10)
    let hashedPassword = await bcrypt.hash(password,salt)
    return hashedPassword
}

export const hashCompare = async(password,hashed) =>{
    let comparePassword = await bcrypt.compare(password,hashed)
    return comparePassword
}


// JWT token - Login
export const LoginToken = async(payload)=>{
    const secretkey = process.env.SECRETKEY_LOGIN
    const token = await jwt.sign(payload,secretkey,{expiresIn:'15m'})
    return token
}

// JWT token - Reset or Activate
export const ResetToken =async(payload)=>{
    const secretkey = process.env.SECRETKEY_RESET
    const token = await jwt.sign(payload,secretkey,{expiresIn:'5m'});
    return token
}

// Validate JWT token 
export const Validate =async(req,res,next)=>{
    if(req.headers.authorization){
        let token = req.headers.authorization.split(" ")[1]
        let data = await jwt.decode(token)
        if(Math.floor((+new Date())/1000) < data.exp){
            next()
        }
        else{
            res.status(400).send({message:"Token Expired"})
        }
    }
    else{
        res.status(400).send({message:"Token not found"})
    }
}