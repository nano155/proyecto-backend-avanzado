"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productModel = exports.productSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const stringTypeSchemaUniqueRequired = {
    type: String,
    unique: true,
    required: true
};
const stringTypeSchemaNonUniqueRequired = {
    type: String,
    required: true
};
exports.productSchema = new mongoose_1.default.Schema({
    title: stringTypeSchemaUniqueRequired,
    description: stringTypeSchemaNonUniqueRequired,
    code: stringTypeSchemaUniqueRequired,
    price: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    stock: {
        type: Number,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: [
            'computadoras',
            'telefonos',
            'televisores',
            'accesorios',
            'electrodomesticos'
        ],
        required: true,
        index: true
    },
    thumbnails: {
        type: [],
        default: []
    }
});
exports.productSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret, options) {
        delete ret._id;
    },
});
exports.productModel = mongoose_1.default.model('products', exports.productSchema);
