const express = require("express");
const router = express.Router();
const {auth} = require("../middlewares/auth.js");
const{
    deleteAccount,
    updateProfile,
    getUserDetails
    // updateDisplayPicture,   //Not Created
    // getEnrolledCourses,     //Not Created
} = require("../controllers/Profile.js");


//routes
router.delete("/deleteProfile",deleteAccount)
router.put("/updateProfile",auth,updateProfile)
router.get("/getUserDetils",auth,getUserDetails)
// router.get("/getEnrolledCourses",auth,getEnrolledCourses) //Not Created
// router.put("/updateDisplayPicture",auth,updateDisplayPicture) //Not Created

module.exports = router