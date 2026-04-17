const express = require("express")
const router = express.Router()

const {capturePayment, verifySignature} = require("../controllers/Payments.js")
const {auth, isInstructor, isStudent, isAdmin} = require("../middlewares/auth.js")
// const { default: payments } = require("razorpay/dist/types/payments.js")

router.post("/capturePayment", auth,isStudent,capturePayment)
router.post("/verifySignature", verifySignature)

module.exports = router