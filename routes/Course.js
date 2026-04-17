const express = require("express");
const router = express.Router()

//Import controllers

//Course Controllers Import
const{
    createCourse,
    showAllCourses,
    getCourseDetails,
} = require("../controllers/Course.js");

//categories Controllers
const{
    showAllCategories,
    createCategory,
    categoryPageDetails,
} = require("../controllers/Category.js");

//Sections Controlles Import
const{
    createSection,
    updateSection,
    deleteSection,
} = require("../controllers/Section.js")

//Sub-sections controllers Import
const{
    createRating,
    getAverageRating,
    getAllRating,
} = require("../controllers/RatingAndReview.js");

//Importing middlewares
const{auth,isInstructor,isStudent,isAdmin} = require("../middlewares/auth.js");


//routes
//Course
router.post("/createCourse",auth,isInstructor,createCourse)
router.get("/getAllCourses", showAllCourses)
router.get("/getCourseDetails",getCourseDetails)

//Section
router.post("/createSection",auth,isInstructor,createSection)
router.patch("/updateSection/:sectionId", auth, isInstructor, updateSection)
router.delete("/deleteSection/:sectionId", auth, isInstructor,deleteSection)

//categories
router.post("/createCategory", auth,isAdmin,createCategory)
router.get("/showAllCategories", showAllCategories)
router.post("/getCategoryPageDetails", categoryPageDetails)

//Rating and Review
router.post("/createRating",auth,isStudent,createRating)
router.get("/getAverageRating", getAverageRating)
router.get("/getReviews", getAllRating)

module.exports = router