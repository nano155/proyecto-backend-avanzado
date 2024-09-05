"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUserDto = void 0;
const config_1 = require("../../../config");
class LoginUserDto {
    constructor(email, password, connection) {
        this.email = email;
        this.password = password;
        this.connection = connection;
    }
    static create(object) {
        const { email, password } = object;
        if (!email)
            return ["email is required"];
        if (!config_1.regularExps.email.test(email))
            return ["email is not valid"];
        if (!password)
            return ["password is required"];
        if (password.length < 5)
            return ["password is too short"];
        return [undefined, new LoginUserDto(email, password, new Date())];
    }
}
exports.LoginUserDto = LoginUserDto;
//# sourceMappingURL=LoginUser.dto.js.map