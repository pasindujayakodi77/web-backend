import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function createUser(req,res){


    const passwordHash = bcrypt.hashSync(req.body.password,10)
    


    const userData = {
        firstName : req.body.firstName,
        lastName : req.body.lastName,
        email : req.body.email,
        password : passwordHash,
    }

    const user = new User(userData)

    user.save().then(
        ()=>{
            res.json({
                message : "User created successfully"
            })
        }
    ).catch(
        ()=>{
            res.json({
                message : "Failed to create user"
            })
        }
    )
}

export function loginUser(req,res){
    const email = req.body.email
    const password = req.body.password

    User.findOne(
        {
            email: email
        }
    ).then(
        (user) => {
            if(user==null){
                res.status(404).json({
                    message: "User not found"
                })
            }else{
                const isPasswordValid = bcrypt.compareSync(password, user.password)
                if(isPasswordValid){
                    const token = jwt.sign(
                        {
                            firstName: user.firstName,
                            lastName: user.lastName,
                            email: user.email,
                            role : user.role,
                            isBlocked : user.isBlocked,
                            isEmailVerified : user.isEmailVerified,
                            Image : user.image
                        },
                        process.env.JWT_SECRET,
                    )
                    res.json({
                        token: token,
                        message: "Login successful"
                        
                    })
                }else{
                    res.status(401).json({
                        message: "Invalid password"
                    })
                }
            }
        }
    )
}

export function isAdmin(req){
    
    if(req.user == null){
        return false;
    }

    if(req.user.role == "admin"){
        return true;
    }else{
        return false;
    }
}
    