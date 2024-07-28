// Importing necessary components
import jwt from "jsonwebtoken";
import urls from "../model/UrlSchema.js"
import User from "../model/UserSchema.js";

// Creating a short Url -POST

export const CreateShortUrl = async(req,res)=>{
    try{
        const find_Url = await urls.findOne({Original_Url:req.body.Original_Url})
        if(!find_Url){
            let token = req.headers.authorization.split(" ")[1]
            let data = await jwt.decode(token)
            if(data.Id && data.Status=="Active"){
                //Random String Generation
                const String = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
                const ShortStringLength = 6;  //string length we want
                const StringLength = String.length;
                let ShortLink ="";
                for(let i=0;i<ShortStringLength;i++){
                    ShortLink = ShortLink + String.charAt(Math.floor(Math.random()*StringLength))
                }
                const Origin = await urls.create({
                    Original_Url : req.body.Original_Url,
                    Short_Url : `https://miniurl-noru.onrender.com/miniUrl/${ShortLink}`,
                    Url_id : ShortLink,
                    UrlName : req.body.UrlName
                })
                await Origin.save()

                await User.findByIdAndUpdate({_id:data.Id},{$push:{Created_Urls:Origin._id}})
                res.status(200).send({message:"Your Url is shortened","Short_Url" : `https://miniurl-noru.onrender.com/miniUrl/${ShortLink}`})
            }
            else{
                res.status(400).send({message:"Inactive user,Verify your Account"})
            }
        }
        else{
            res.status(400).send({message:"Url already Shortened"})
        }
    }
    catch(err){
        res.status(500).send({message:"Internal Server Error",err})
    }
}


// Getting created Urls of an User - GET 
export const getUrls = async(req,res)=>{
    try{
        const {id} = req.params;
        const user = await User.findById(id)
        if(user){
            const Url_Data = await User.findById(id).populate('Created_Urls','-_id')
            res.status(200).send({Created_Urls:Url_Data.Created_Urls})
        }
        else{
            res.status(400).send({message:"User Not found!"})
        }
    }
    catch(err){
        res.status(500).send({message:"Internal Server Error",err})
    }
}


// Updating Original Url - PUT
export const UpdateMainUrl = async(req,res)=>{
    try{
        const {id} = req.params;
        const MainUrl = await urls.findOne({Url_id:id})
        if(MainUrl){
            if(req.body.Original_Url){
                const Change_MainUrl = await urls.updateOne({Url_id:id},{$set:{Original_Url:req.body.Original_Url}})
                res.status(200).send({message:"Original Url updated"})
            }
            else{
                res.status(400).send({message :"New url required to update existing one!"})
            }
        }
        else{
            res.status(400).send({message:"Original Url does not exists!"})
        }
    }
    catch(err){
        res.status(500).send({message:"Internal Server Error",err})
    }
}


// Mini Url redirection - GET
export const redirect_MiniUrl = async(req,res)=>{
    try{
        const {id} = req.params;
        if(id){
            const MainUrl = await urls.findOne({Url_id:id})
            if(MainUrl){
                res.status(301).redirect(MainUrl.Original_Url)
            }
            else{
                res.status(400).send({message:"Mini Url not found"})
            }
        }
        else{
            res.status(400).send({message:"Url Id required"})
        }
    }
    catch(err){
        res.status(500).send({message:"Internal Server Error",err})
    }
}


//Finding Url Globally - POST
export const Existing_Urls = async(req,res)=>{
    try{
        if(req.body.Original_Url){
            const find_Url = await urls.findOne({Original_Url:req.body.Original_Url},{_id:0})
            if(find_Url){
                res.status(200).send(find_Url)
            }
            else{
                res.status(400).send({message:"Url not shortened yet!"})
            }
        }
        else{
            res.status(400).send({message:"Url required to find Mini_Url"})
        }
    }
    catch(err){
        res.status(500).send({message:"Internal Server Error",err})
    }
}


// Deleting a Url - Delete
export const deleteUrl = async(req,res)=>{
    try{
        const {id} = req.params;
        const MainUrl = await urls.findOne({Url_id:id})
        if(MainUrl){
            let token = req.headers.authorization.split(" ")[1]
            let data = await jwt.decode(token)
            const Url = await urls.deleteOne({Url_id:id})
            const updateIn_User = await User.findByIdAndUpdate({_id:data.Id},{$pull:{Created_Urls:MainUrl._id}})
            res.status(200).send({message:"Url Deleted Successfully"})
        }
        else{
            res.status(400).send({message:"Url does not exists!"})
        }
    }
    catch(err){
        res.status(500).send({message:"Internal Server Error",err})
    }
}