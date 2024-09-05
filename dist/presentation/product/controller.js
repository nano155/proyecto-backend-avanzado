"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const entity_1 = require("../../domain/entity");
const dtos_1 = require("../../domain/dtos");
class ProductController {
    constructor(productRepository) {
        this.productRepository = productRepository;
        this.createProduct = (req, res) => {
            var _a;
            const userAuthorized = (_a = req.user) === null || _a === void 0 ? void 0 : _a.payload;
            if ((userAuthorized === null || userAuthorized === void 0 ? void 0 : userAuthorized.role) !== entity_1.Role.admin && (userAuthorized === null || userAuthorized === void 0 ? void 0 : userAuthorized.role) !== entity_1.Role.premium)
                return res.status(401).json({ message: "Unauthorized operation" });
            const thumb = [];
            if (req.file !== undefined) {
                thumb.push(req.file.path);
            }
            if (req.files !== undefined && Array.isArray(req.files)) {
                req.files.forEach(img => (thumb.push(img.path)));
            }
            console.log(req.body.status);
            const precio = +req.body.price;
            const statusB = typeof req.body.status === 'boolean'
                ? req.body.status
                : req.body.status === 'true';
            const stockP = +req.body.stock;
            const _b = req.body, { price, status, stock } = _b, rest = __rest(_b, ["price", "status", "stock"]);
            console.log(statusB);
            const [error, createDto] = dtos_1.CreateProductDto.create(Object.assign({ owner: userAuthorized.role === 'premium' ? userAuthorized === null || userAuthorized === void 0 ? void 0 : userAuthorized.id : null, price: precio, status: statusB, stock: stockP }, rest));
            if (error)
                return res.status(400).json({ error: error });
            this.productRepository
                .createProduct(createDto)
                .then((product) => res.json(product))
                .catch((error) => res.status(400).send(error.message));
        };
        this.uploadImages = (req, res) => {
            const images = [];
            const id = req.params.id;
            if (!id)
                return res.status(400).send("Bad request");
            if (req.file !== undefined) {
                images.push(req.file.path);
            }
            if (req.files !== undefined && Array.isArray(req.files)) {
                req.files.forEach(image => (images.push(image.path)));
            }
            this.productRepository.uploadImages(id, images)
                .then(product => (res.json(product)))
                .catch((error) => res.status(400).send(error.message));
        };
        this.getProducts = (req, res) => {
            const { page = 1, limit = 10, sort } = req.query;
            try {
                const [error, paginationDto] = dtos_1.PaginationDto.create(+page, +limit, sort);
                if (error)
                    return res.status(400).json({ error: error });
                this.productRepository
                    .getProducts(paginationDto)
                    .then((product) => res.json(product))
                    .catch((error) => res.status(400).send(error.message));
            }
            catch (error) {
                return res.status(400).send(error);
            }
        };
        this.getProductById = (req, res) => {
            const id = req.params.id;
            if (!id)
                return res.status(400).send("Bad request");
            this.productRepository
                .getProductById(id)
                .then((product) => res.json(product))
                .catch((error) => res.status(400).json({ error: error.message }));
        };
        this.deleteProductById = (req, res) => {
            var _a;
            const userAuthorized = (_a = req.user) === null || _a === void 0 ? void 0 : _a.payload;
            if ((userAuthorized === null || userAuthorized === void 0 ? void 0 : userAuthorized.role) !== entity_1.Role.admin && (userAuthorized === null || userAuthorized === void 0 ? void 0 : userAuthorized.role) !== entity_1.Role.premium)
                return res.status(401).json({ message: "Unauthorized operation" });
            const id = req.params.id;
            if (!id)
                return res.status(400).send("Bad request");
            this.productRepository
                .deleteProductById(id, userAuthorized.id)
                .then((product) => res.json(product))
                .catch((error) => res.status(400).json({ error: error.message }));
        };
        this.updateProductById = (req, res) => {
            var _a;
            const userAuthorized = (_a = req.user) === null || _a === void 0 ? void 0 : _a.payload;
            if ((userAuthorized === null || userAuthorized === void 0 ? void 0 : userAuthorized.role) !== entity_1.Role.admin && (userAuthorized === null || userAuthorized === void 0 ? void 0 : userAuthorized.role) !== entity_1.Role.premium)
                return res.status(401).json({ message: "Unauthorized operation" });
            console.log(req.body);
            const _b = req.body, { stock, price } = _b, rest = __rest(_b, ["stock", "price"]);
            const [error, updateProduct] = dtos_1.UpdateProductDto.create(Object.assign({ stock: +stock, price: +price }, rest));
            if (error)
                return res.status(400).json({ error: error });
            const id = req.params.id;
            if (!id)
                return res.status(400).json({ error: "ID is required." });
            this.productRepository
                .updateProductById(id, updateProduct, userAuthorized.id)
                .then((product) => res.json(product))
                .catch((error) => res.status(400).send(error.message));
        };
    }
}
exports.ProductController = ProductController;
//# sourceMappingURL=controller.js.map