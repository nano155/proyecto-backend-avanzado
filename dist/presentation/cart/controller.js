"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartController = void 0;
const uuid_1 = require("uuid");
const user_model_1 = require("../../service/dao/mongo/models/user.model");
const entity_1 = require("../../domain/entity");
const dtos_1 = require("../../domain/dtos");
class CartController {
    constructor(cartRepository) {
        this.cartRepository = cartRepository;
        this.createCart = (req, res) => __awaiter(this, void 0, void 0, function* () {
            this.cartRepository
                .createCart()
                .then((cart) => res.json(cart))
                .catch((error) => res.status(400).send(error.message));
        });
        this.getCartById = (req, res) => {
            const id = req.params.id;
            if (!id)
                return res.status(400).send("Id don't received.");
            this.cartRepository
                .getCartByid(id)
                .then((cart) => res.json(cart))
                .catch((error) => res.status(400).send(error.message));
        };
        this.addProductToCart = (req, res) => {
            var _a;
            const cartUser = (_a = req.user) === null || _a === void 0 ? void 0 : _a.payload;
            if (!cartUser)
                return res.status(401).json({ message: "Unauthorized operation!" });
            const cid = req.params.cid;
            if (!cid)
                return res.status(400).send("Id from cart don't received.");
            const pid = req.params.pid;
            if (!pid)
                return res.status(400).send("Id from product don't received.");
            if ((cartUser === null || cartUser === void 0 ? void 0 : cartUser.role) === entity_1.Role.user && cartUser.cart === cid) {
                return this.cartRepository
                    .addProductToCart(cid, pid)
                    .then((cart) => res.json(cart))
                    .catch((error) => res.status(400).send(error.message));
            }
            return res.status(401).json({ message: "Unauthorized operation!" });
        };
        this.deleteProductToCart = (req, res) => {
            const cid = req.params.cid;
            if (!cid)
                return res.status(400).send("Id from cart don't received.");
            const pid = req.params.pid;
            if (!pid)
                return res.status(400).send("Id from product don't received.");
            this.cartRepository
                .deleteProductToCart(cid, pid)
                .then((cart) => res.json(cart))
                .catch((error) => res.status(400).send(error.message));
        };
        this.deleteAllProduct = (req, res) => {
            const id = req.params.id;
            if (!id)
                return res.status(400).send("Id from cart don't received.");
            this.cartRepository
                .deleteAllProduct(id)
                .then((cart) => res.json(cart))
                .catch((error) => res.status(400).send(error.message));
        };
        this.updateCartQuantity = (req, res) => {
            const { pid, cid } = req.params;
            const { quantity } = req.body;
            if (!cid)
                return res.status(400).send("Id from cart don't received.");
            if (!pid)
                return res.status(400).send("Id from product don't received.");
            if (!quantity)
                return res.status(400).send("Quantity don't received.");
            this.cartRepository
                .updateCartQuantity(cid, pid, quantity)
                .then((cart) => res.json(cart))
                .catch((error) => res.status(400).send(error.message));
        };
        this.generateTicket = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { cid } = req.params;
            if (!cid)
                return res.status(404).json({ error: "Id not found!!" });
            const user = yield user_model_1.userModel.findOne({ cart: cid });
            if (!user)
                return res.status(404).json({ error: "User not found" });
            this.cartRepository
                .getCartByid(cid)
                .then((cart) => __awaiter(this, void 0, void 0, function* () {
                let totalPrice = 0; // Inicializar el precio total
                const newCart = cart.products
                    .map((productInfo) => {
                    const quantity = productInfo.quantity;
                    const product = productInfo.product;
                    if (!product || !product.price || !quantity)
                        return null; // Verificar si hay valores nulos o si el stock es menor que la cantidad
                    const productTotalPrice = product.price * quantity;
                    totalPrice += productTotalPrice; // Agregar el precio total del producto al precio total general
                    return {
                        quantity: quantity,
                        product: product,
                        totalPrice: productTotalPrice, // Incluir el precio total del producto individual en el resultado
                    };
                })
                    .filter((item) => item !== null); // Filtrar los elementos nulos
                const [error, createTicket] = dtos_1.CreateTicket.create({
                    code: (0, uuid_1.v4)(),
                    amount: totalPrice,
                    purchase_datetime: new Date(),
                    purchaser: user.email,
                });
                if (error)
                    return res.status(500).json({ error: error });
                return this.cartRepository
                    .generateTicket(createTicket)
                    .then((ticket) => res.json(ticket))
                    .catch((error) => res.status(400).send(error.message));
            }))
                .catch((error) => res.status(500).json(error));
        });
        this.getTicket = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            if (!id)
                return res.status(404).json({ error: "Id not found!!" });
            return this.cartRepository
                .getTicket(id)
                .then((ticket) => res.json(ticket))
                .catch((error) => res.status(400).send(error.message));
        });
    }
}
exports.CartController = CartController;
//# sourceMappingURL=controller.js.map