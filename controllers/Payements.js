const {instance} = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");

//capture the payement and initiate the razorpay order
exports.capturePayment = async(req,res)=>{
    
        //get courseId and UserId
        const {course_id} = req.body;
        const userId = req.user.id;
        
        //validation
        //valid courseId
        if(!course_id){
            return res.json({
                success:false,
                message: "Please Provide valid Course ID",
            })
        }
    
        //validCourseDetail
        let course;
        try {
            course = await Course.findById(course_id);
            if(!course){
                return res.json({
                    success:false,
                    message:'Could not find the course',
                })
            }

             //user already paid for the same course
             //converting uid from string to objectid
             const uid = new mongoose.Types.ObjectId(userId);
             
             if(course.studentsEnrolled.includes(uid)){
                return res.json({success:false,
                message:"Could not find the course",
                })
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                success:false,
                message:error.message,
            })
        }
       
        //create order
        const amount = course.price;
        const currency = "INR";

        const options = {
            amount: amount * 100,
            currency,
            receipt: Math.random(Date.now()).toString(),
            notes:{
                courseId: course_id,
                userId,
            }
        }
        
    };

    try {
        //initiate the payment using razorpay
        const paymentResponse = await instance.orders.create(options);
        console.log(paymentResponse);

        //return res
        return res.status(200).json({
            success: true,
            courseName:Course.courseName,
            courseDescription: Course.courseDescription,
            thumbnail: Course.thumbnail,
            orderId: paymentResponse.id,
            currency: paymentResponse.currency,
            amount: paymentResponse.amount,
        })
    } catch (error) {
        console.log(error);
        res.json({
            success:false,
            message:"Could not initiate order",
        });
    }
    
    //verify signature
    exports.verifySignature = async(req,res)=>{
        const webhookSecret = '12345678';

        const signature = req.headers["x-razorpay-signature"];

        const shasum = crypto.createHmac("sha256", webhookSecret);
        shasum.update(JSON.stringify(req.body));
        const digest = shasum.digest("hex");

        if(signature == digest){
            console.log("Payment is Authorised");

            const {courseID, userId} = req.body.payload.entity.notes;

            try {
                //fulfil the action
                //find the course and enroll the student in it
                const enrolledCourse = await Course.findOneAndUpdate({_id: courseId},
                    {$push:{studentsEnrolled:userId}},
                    {new:true},
                )

                if(!enrolledCourse){
                    return res.status(500).json({
                        success:false,
                        message:"Course not found",
                    })
                }
                console.log(enrolledCourse);

                //find the sudent and add the course to their list enrolled courses mein
                const enrolledStudent = await User.findOneAndUpdate({_id:userId},
                    {$push:{courses:courseId}},
                    {new:true},
                );

                console.log(enrolledStudent);

                //mail send karo
                const emailResponse = await mailSender(
                     enrolledStudent.email,
                     "Congractukations from CodeHelp",
                     "Congratulations, you are onboarded into new CodeHelp Course",
                );
                console.log(emailResponse);
                return res.status(200).json({
                    status: true,
                    message:"Signature verified and Course Added",
                })
            } catch (error) {
                console.log(error);
                return res.status(500).json({
                    success:false,
                    message:error.message,
                })
            }
        }
        else{
            return res.status(400).json({
                success:false,
                message:'Invalid request',
            })
        }
    };