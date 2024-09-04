"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    emailValidate: {
        type: Boolean,
        default: false
    },
    age: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    cart: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'carts',
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'user', 'premium'],
        default: 'user'
    },
    documents: {
        type: [
            {
                name: String,
                reference: String
            }
        ],
        default: []
    },
    last_connection: {
        type: Date,
        default: null
    },
    payment_intentId: {
        type: String,
        default: null
    },
}, {
    timestamps: true
});
userSchema.pre('findOne', function () {
    this.populate("cart");
});
exports.userModel = mongoose_1.default.model('users', userSchema);
