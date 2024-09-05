"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const cartSchema = new mongoose_1.default.Schema({
    products: {
        type: [
            {
                product: {
                    type: mongoose_1.default.Schema.Types.ObjectId,
                    ref: "products",
                },
                quantity: {
                    type: Number,
                    default: 1,
                },
            },
        ],
        default: [],
    },
});
cartSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret, options) {
        delete ret._id;
    },
});
cartSchema.pre("findOne", function () {
    this.populate("products.product");
});
exports.cartModel = mongoose_1.default.model("carts", cartSchema);
//# sourceMappingURL=cart.model.js.map