const Course = require('../models/Course.js');
const Category = require("../models/Category.js");  
const User = require('../models/User.js');
const { uploadImageToCloudinary } = require('../utils/imageUpload');

// Create course
exports.createCourse = async (req, res) => {
    try {
        const { courseName, courseDescription, whatYouWillLearn, price, tag, category, instructions, status } = req.body;
        const thumbnail = req.files.thumbnailImage;

        if (!courseName || !courseDescription || !whatYouWillLearn || !price || !tag || !thumbnail || !category) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);
        if (!instructorDetails) {
            return res.status(403).json({ success: false, message: "Instructor details not found" });
        }

        const categoryDetails = await Category.findById(category);
        if (!categoryDetails) {
            return res.status(400).json({ success: false, message: "Category not found" });
        }

        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn,
            price,
            tag,                                      
            thumbnail: thumbnailImage.secure_url,     
            category: categoryDetails._id,
            instructions,
            status: status || "Draft",
        });

        // Add course to instructor's courses
        await User.findByIdAndUpdate(
            instructorDetails._id,
            { $push: { courses: newCourse._id } },
            { new: true }
        );

        await Category.findByIdAndUpdate(
            categoryDetails._id,
            { $push: { course: newCourse._id } },
            { new: true }
        );

        return res.status(201).json({
            success: true,
            message: "Course created successfully",
            data: newCourse,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Failed to create course", error: error.message });
    }
};

// Get all courses
exports.showAllCourses = async (req, res) => {
    try {
        const allCourses = await Course.find({}, {
            courseName: true,
            price: true,
            thumbnail: true,           
            instructor: true,
            ratingAndReviews: true,   
            studentsEnrolled: true,
            tag: true,
        }).populate("instructor").exec();

        return res.status(200).json({
            success: true,
            message: "All courses fetched successfully",
            data: allCourses,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Failed to fetch courses", error: error.message });
    }
};

// Get course details
exports.getCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.body;

        const courseDetails = await Course.findById(courseId)
            .populate({
                path: "instructor",         
                populate: {
                    path: "additionalDetails", 
                },
            })
            .populate("category")
            .populate("ratingAndReviews")
            .populate({
                path: "courseContent",
                populate: { path: "subSection" },
            })
            .exec();

        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: `Could not find the course with id ${courseId}`,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Course details fetched successfully",
            data: courseDetails,            
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,         
        });
    }
};