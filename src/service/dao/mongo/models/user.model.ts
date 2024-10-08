import { timeStamp } from "console";
import mongoose from "mongoose";



const userSchema = new mongoose.Schema({
    first_name:{
        type:String,
        required:true
    },
    last_name:{
        type:String,
        required:true
    },
    email:{
        type: String,
        required:true,
        unique: true,
    },
    emailValidate:{
        type:Boolean,
        default:false
    },
    age:{
        type: Number,
        required:true,
    },
    password: {
        type: String,
        required: true,
    },
    cart:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts',
        required: true
    },
    role:{
        type:String,
        enum:['admin', 'user', 'premium'],
        default: 'user'
    },
    documents:{
        type:[
            {
                name:String,
                reference:String
            }
        ],
        default:[]
    },
    last_connection:{
        type:Date,
        default:null
    },
    payment_intentId:{
        type:String,
        default:null
    },
},
{
    timestamps:true
})

userSchema.pre('findOne', function() {
    this.populate("cart");
});

export const userModel = mongoose.model('users', userSchema)