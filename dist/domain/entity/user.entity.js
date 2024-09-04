"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEntity = exports.Role = void 0;
var Role;
(function (Role) {
    Role["user"] = "user";
    Role["admin"] = "admin";
    Role["premium"] = "premium";
})(Role || (exports.Role = Role = {}));
class UserEntity {
    constructor(id, first_name, last_name, email, validateEmail, cart, role) {
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.validateEmail = validateEmail;
        this.cart = cart;
        this.role = role;
    }
    static fromObject(object) {
        console.log(object);
        const { id, first_name, last_name, email, validateEmail, cart, role } = object;
        return new UserEntity(id, first_name, last_name, email, validateEmail, cart, role);
    }
}
exports.UserEntity = UserEntity;
