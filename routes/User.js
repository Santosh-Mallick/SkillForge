const express = require("express");
const router = express.Router();
const {auth} = require("../middlewares/auth");


const{
    login,
    signup,
    sendOtp,
    changePassword
} = require("../controllers/Auth");

const{
    resetPasswordToken,
    ResetPassword,
} = require("../controllers/ResetPassword")




//routes

//route for user login
router.post("/login",login)

//route for user signup
router.post("/signup",signup)

//rote for sendotp
router.post("/sendotp",sendOtp)

//route for changing password
router.post("/changepassword", auth, changePassword)

//route for generating a reset passoword token
router.post("/reset-password-token", resetPasswordToken)

//route for resetting users password after verificatiom
router.post("/reset-password", ResetPassword)

module.exports = router