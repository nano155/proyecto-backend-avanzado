"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterUserDto = void 0;
const config_1 = require("../../../config");
class RegisterUserDto {
    constructor(first_name, last_name, email, age, password, role) {
        this.first_name = first_name,
            this.last_name = last_name,
            this.email = email,
            this.age = age,
            this.password = password;
        this.role = role;
    }
    static create(object) {
        try {
            const userDto = config_1.Validators.validatorsDataTypeRegister(object);
            const { first_name, last_name, age, email, password, role } = userDto;
            return [undefined, new RegisterUserDto(first_name, last_name, email, age, password, role)];
        }
        catch (error) {
            if (error instanceof Error) {
                return [error.message, undefined];
            }
            else {
                return ['Unknow error', undefined];
            }
        }
    }
}
exports.RegisterUserDto = RegisterUserDto;
