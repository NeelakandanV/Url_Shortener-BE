// Importing neccessary components

import mongoose from "mongoose";
import validator from "validator";

// Validation Schema

const UserSchema = new mongoose.Schema({
    First_Name : {
        type : String,
        required : true
    },
    Last_Name : {
        type : String,
        required : true
    },
    Email : {
        type : String,
        required : true ,
        lowercase : true,
        validate : (value) =>{
            return validator.isEmail(value);
        }
    },
    Password : {
        type : String,
        required : true
    },
    VerifyPin : {
        type : String
    },
    ResetPin : {
        type : String
    },
    Status : {
        type : String,
        default : "Inactive"
    },
    Created_Urls : [{
        type : mongoose.Schema.Types.ObjectId,ref:'urls'
    }],
    CreatedAt : {
        type : Date,
        default : Date.now
    },
    updatedAt : {
        type : String,
        default : Date.now
    }
},{
    versionKey : false
})

const User = mongoose.model("users",UserSchema);
export default User;