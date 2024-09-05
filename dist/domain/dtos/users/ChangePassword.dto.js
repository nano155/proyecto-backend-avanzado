"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangePasswordDto = void 0;
const config_1 = require("../../../config");
class ChangePasswordDto {
    constructor(password, email) {
        this.password = password;
        this.email = email;
    }
    static create(object) {
        const { password, email } = object;
        if (!email)
            return [('email is required')];
        if (!config_1.regularExps.email.test(email))
            return [('email is not valid')];
        if (!password)
            return [('password is required')];
        if (password.length < 5)
            return [('password is too short')];
        return [undefined, new ChangePasswordDto(password, email)];
    }
}
exports.ChangePasswordDto = ChangePasswordDto;
//# sourceMappingURL=ChangePassword.dto.js.map