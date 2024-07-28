// Importing Necessary components
import express from "express";
import { CreateShortUrl, deleteUrl, Existing_Urls, getUrls, redirect_MiniUrl, UpdateMainUrl } from "../controllers/UrlController.js";
import { Validate } from "../utils/Auth.js";

// Middlewares
const router = express.Router();

// Setting up routes
router.post("/CreateMiniUrl",Validate,CreateShortUrl)
router.get("/FetchUrl/:id",Validate,getUrls)
router.put("/UpdateUrl/:id",Validate,UpdateMainUrl)
router.get("/miniUrl/:id",redirect_MiniUrl)
router.post("/getMiniUrl",Validate,Existing_Urls)
router.delete("/delete/:id",Validate,deleteUrl)

export default router

