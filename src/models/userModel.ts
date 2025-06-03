import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    id:{
        type: String,
        unique: true,
    },
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

const User = mongoose.models.users || mongoose.model("user", userSchema);

export default User;