"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateProductDto = void 0;
const config_1 = require("../../../config");
class UpdateProductDto {
    constructor(titleUpdate, descriptionUpdate, codeUpdate, priceUpdate, statusUpdate, stockUpdate, categoryUpdate, thumbnailsUpdate, deletedFile) {
        this.titleUpdate = titleUpdate;
        this.descriptionUpdate = descriptionUpdate;
        this.codeUpdate = codeUpdate;
        this.priceUpdate = priceUpdate;
        this.statusUpdate = statusUpdate;
        this.stockUpdate = stockUpdate;
        this.categoryUpdate = categoryUpdate;
        this.thumbnailsUpdate = thumbnailsUpdate;
        this.deletedFile = deletedFile;
    }
    static create(productDto) {
        try {
            config_1.Validators.validatorUpdateProductDataType(productDto);
            const { title, description, code, price, status, stock, category, thumbnails, deletedFile } = productDto;
            return [
                undefined,
                new UpdateProductDto(title, description, code, price, status, stock, category, thumbnails, deletedFile),
            ];
        }
        catch (error) {
            if (error instanceof Error) {
                return [error.message, undefined];
            }
            return ['Unknow Error'];
        }
    }
}
exports.UpdateProductDto = UpdateProductDto;
