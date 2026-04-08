const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("../models/User");

//authentication middleware
exports.auth = async (req, res, next) => {
    try {
        //fetch token from header
        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer", ""); 
        
        //if token is missing, then return response
        if(!token){
            return res.status(401).json({
                success: false,
                message: "Token is missing",
            });
        }

        //verify token
        try{
          const decode = jwt.verify(token,process.env.JWT_SECRET);
          console.log("Decoded token:", decode);
          req.user = decode;
        }catch(error){
            //verification issue 
            return res.status(401).json({
                success:false,
                message:"Token is invalid",
            });
        }
        next();

    } catch (error) {
        console.log("Error in auth middleware:", error);
        return res.status(401).json({
            success: false,
            message: "Something went wrong while validating the token",
        });
    }} ;


    //isStudent middleware
    exports.isStudent = async(req,res,next)=>{
       try {
       if(req.user.accountType !== "Student"){
        return res.status(401).json({
            success:false,
            message:"This route is only for students",
        });
       }
       next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"User role cannot be verified, please try again",
        });
       }
    }

    //isInstructor middleware
    exports.isInstructor = async(req,res,next)=>{
       try {
       if(req.user.accountType !== "Instructor"){
        return res.status(401).json({
            success:false,
            message:"This route is only for instructors",
        });
       }
       next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"User role cannot be verified, please try again",
        });
       }
    }

    //isAdmin middleware
    exports.isAdmin = async(req,res,next)=>{
       try {
       if(req.user.accountType !== "Admin"){
        return res.status(401).json({
            success:false,
            message:"This route is only for admins",
        });
       }
       next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"User role cannot be verified, please try again",
        });
       }
    }