"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BcryptAdapter = void 0;
const bcrypt_1 = require("bcrypt");
class BcryptAdapter {
    static hash(password) {
        const salt = (0, bcrypt_1.genSaltSync)();
        return (0, bcrypt_1.hashSync)(password, salt);
    }
    static compare(password, hashed) {
        const compare = (0, bcrypt_1.compareSync)(password, hashed);
        return compare;
    }
}
exports.BcryptAdapter = BcryptAdapter;
