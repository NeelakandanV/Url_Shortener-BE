// Importing neccessary components

import mongoose from "mongoose";

// Validation Schema
const UrlSchema = new mongoose.Schema({
    Original_Url:{
        type : String,
        required : true
    },
    Short_Url:{
        type : String,
        required : true
    },
    Url_id : {
        type : String,
        required : true
    },
    UrlName:{
        type : String
    },
    createdAt : {
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

const urls = mongoose.model("urls",UrlSchema)
export default urls