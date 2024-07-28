// Importing dependencies
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import DBconnect from "./utils/config.js";
import UserRouter from "./routers/UserRouter.js";
import UrlRouter from "./routers/UrlRouter.js";


//Applying Middelewares
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// Connecting to Database
DBconnect();

app.use("/users",UserRouter)
app.use("/",UrlRouter)

//Port Setup
const Port = process.env.Port || 9000;
app.listen(Port,()=>console.log(`App is listening on ${Port}`))