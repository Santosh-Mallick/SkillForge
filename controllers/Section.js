const Section = require("../models/Section");
const Course = require("../models/Course");

exports.createSection = async(req,res)=>{
    try {
        //data fetch
        const {sectionName,courseId} = req.body;

        //data validation
        if(!sectionName || !courseId){
            return res.status(400).json({
                success: false,
                message:'Missing Properties'
            })
        }
        
        //create section
        const newSection = await Section.create({sectionName});

        //update course with section Objectid
        const updatedCourseDetails = await Course.findByIdAndUpdate(
            courseId,{
                $push:{
                    courseContent:newSection._id,
                }
            },
            {new:true},
        ).populate({
             path: "courseContent",   //HW: use populate to replace sections and subsections both in the UpdatedCourseDetails
             populate: {
             path: "subSection",
             },
            });

                
        //return response
        return res.status(200).json({
            success:true,
            message:'Section created successfully',
            updatedCourseDetails,
        })
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Unable to create Section, please try again",
            error:error.message,
        })
    }
}

exports.updateSection = async (req,res)=>{
    try {
        //data input
        const {sectionId} = req.params;
        const {sectionName} = req.body;

        //data validation
         if(!sectionName || !sectionId){
            return res.status(400).json({
                success: false,
                message:'Missing Properties'
            })
        }

        //update data
         const section = await Section.findByIdAndUpdate(sectionId,{sectionName},{new:true});

        //return res
        return res.status(200).json({
            success:true,
            message:'Section Updated Successfully',
        })

    } catch (error) {
         return res.status(500).json({
            success:false,
            message:"Unable to create Section, please try again",
            error:error.message,
        })
    }
}

//delete

exports.deleteSection = async(req,res)=>{
    try {
        //get id - assuming that we are sending ID in params
        const {sectionId} = req.params;

        //delete data
        await Section.findByIdAndDelete(sectionId);

        //return res
        return res.status(200).json({
            success:true,
            message:"Sucessfully Deleted",
        })
        
    } catch (error) {
         return res.status(500).json({
            success:false,
            message:"Unable to Delete Section, please try again",
            error:error.message,
        })
    }
}