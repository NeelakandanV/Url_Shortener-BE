// Importing neccessary components
import express from "express";
import { CreateUser,LoginUser,ForgotPassword,VerifyResetLink,PasswordReset,DeleteUser, VerifyUserLink, verifyUser } from "../controllers/UserController.js";


// Middleware
const router = express.Router();

// Setting routes
router.post("/",LoginUser)
router.post("/Signup",CreateUser)
router.put("/UserVerification",VerifyUserLink)
router.get("/verifyUser/:id/:pin/:token",verifyUser)
router.put("/ForgotPassword",ForgotPassword)
router.get("/ResetPassword/:id/:pin/:token",VerifyResetLink)
router.put("/ResetPassword/:id/:pin/:token",PasswordReset)
router.delete("/delete/:id",DeleteUser)

export default  router;