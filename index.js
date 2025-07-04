import express from "express"
import mongoose from "mongoose"
import bodyParser from "body-parser"
import studentRouter from "./routers/studentRouter.js"
import userRouter from "./routers/userRouter.js"
import jwt from "jsonwebtoken"

const app = express()


app.use(bodyParser.json())

app.use(
    (req,res,next)=>{
        const value = req.header("authorization")
        if(value != null){
            const token = value.replace("Bearer ","")
            jwt.verify(token,"cbc-1220",
                (err,decoded)=>{
                    if(decoded == null){
                        res.status(403).json({
                            message : "Invalid token"
                        })
                    }else{
                        req.user = decoded
                        next()
                        
                     }
                }
            )
        }else{
            next()
        }
        
    }
    
)
const connectionString = "mongodb+srv://admin:0000@cluster0.zl6adua.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"



mongoose.connect(connectionString).then(
    ()=>{
        console.log("Connected to database")
    }
).catch(
    ()=>{
        console.log("Failed to connect to the database")
    }
)




app.use("/students",studentRouter)
app.use("/users", userRouter)




app.listen(5000, 
   ()=>{
       console.log("server started")
   }
)
