const User = require("../models/User.js");
const mailSender = require("../utils/mailSender.js");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");


//resetPasswordToken model
exports.resetPasswordToken = async (req,res) => {
    try {
        //get email from req body
    const email = req.body.email;
    //check if user is present or not
    const user = await User.findOne({email: email});
    if(!user){
        return res.status(404).json({
            success:false,
            message:"Your email is not registered",
        });
    }
    //generate Token
    const token = crypto.randomUUID();

    //update user by adding token and expiration time
    const updatedDetails = await User.findOneAndUpdate(
        {email:email},
        {token:token,
        resetPasswordExpires: Date.now() + 5*60*1000,
    },
    {new:true});

    //create url
    const url = `http://localhost:3000/update-password/${token}`;
    
    //send mail containing the url
    await mailSender(email,
        "Password Reset Link",
        `Password Reset Link: ${url}`
    );

    //return response
   return res.json({
    success:true,
    message:'Email sent successsfully, please change your password',
   })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Something went wrong while resetting password",
        });
        
    }
   
}


//reset password controller
exports.ResetPassword = async(req,res)=>{
    try {
        //data fetch from req body
        const {password,confirmPassword ,token} = req.body;
        //validation of data
        if(password !== confirmPassword){
            return res.json({
                success:false,
                message:'Password not matching',
            });
        }
        //get user details from token
        const userDetails = await User.findOne({token:token});

        //if no entry - invalid token
        if(!userDetails){
            return res.json({
                success:false,
                message:"Invalid Token",
            });
        }
        //Token time check
        if (userDetails.resetPasswordExpires <  Date.now()){
            return res.json({
                success:false,
                message:"Token expired, please try again",
            });
        }
        
        //hash pwd
        const hashedPassword = await bcrypt.hash(password, 10);
        
        //password update
        await User.findOneAndUpdate(
            {token:token},
            {password:hashedPassword},
            {new:true},
        );

        //return response
        return res.status(200).json({
            success:true,
            message:"Password reset successfully",
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Something went wrong while resetting password",
        });
    }
}
