"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProductDto = void 0;
const config_1 = require("../../../config");
class CreateProductDto {
    constructor(title, description, code, price, status, stock, category, owner, thumbnails = []) {
        this.title = title;
        this.description = description;
        this.code = code;
        this.price = price;
        this.status = status;
        this.stock = stock;
        this.category = category;
        this.owner = owner;
        this.thumbnails = thumbnails;
    }
    static create(productDto) {
        try {
            config_1.Validators.validatorProductDataType(productDto);
            const { title, description, code, price, status, stock, category, owner, thumbnails, } = productDto;
            return [
                undefined,
                new CreateProductDto(title, description, code, price, status, stock, category, owner, thumbnails),
            ];
        }
        catch (error) {
            if (error instanceof (Error)) {
                return [error.message, undefined];
            }
            else {
                return ['Error unknow', undefined];
            }
        }
    }
}
exports.CreateProductDto = CreateProductDto;
//# sourceMappingURL=create-product.dto.js.map