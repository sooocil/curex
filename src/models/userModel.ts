import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    
    username:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password:{
        type: String,
        required: true,
        trim: true
    },
    isVerified:{
        type: Boolean,
        default: true
    },
    isAdmin:{
        type: Boolean,
        default: false          
    },
    forgetPasswordToken: String,
    forgetPasswordExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date,
    

})

export default mongoose.models.user || mongoose.model("user", userSchema);

