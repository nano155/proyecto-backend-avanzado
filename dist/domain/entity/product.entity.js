"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductEntity = exports.Category = void 0;
var Category;
(function (Category) {
    Category["computadoras"] = "computadoras";
    Category["telefonos"] = "telefonos";
    Category["televisores"] = "televisores";
    Category["accesorios"] = "accesorios";
    Category["electrodomesticos"] = "electrodomesticos";
})(Category || (exports.Category = Category = {}));
class ProductEntity {
    constructor(id, title, description, code, price, status, stock, category, owner, thumbnails) {
        this.id = id;
        this.category = category;
        this.title = title;
        this.description = description;
        this.code = code;
        this.price = price;
        this.status = status;
        this.owner = owner;
        this.stock = stock;
        this.thumbnails = thumbnails ? thumbnails : [];
    }
    static fromObject(obj) {
        const { id, title, description, code, price, status, stock, category, owner, thumbnails } = obj;
        return new ProductEntity(id, title, description, code, price, status, stock, category, owner, thumbnails);
    }
}
exports.ProductEntity = ProductEntity;
