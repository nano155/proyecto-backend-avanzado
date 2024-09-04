"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepositoryImpl = void 0;
class UserRepositoryImpl {
    constructor(userService) {
        this.userService = userService;
    }
    getUsers() {
        return this.userService.getUsers();
    }
    deteletUsers() {
        return this.userService.deteletUsers();
    }
    loggoutUser(token) {
        return this.userService.loggoutUser(token);
    }
    changeRoleToUser(id) {
        return this.userService.changeRoleToUser(id);
    }
    validateUser(token) {
        return this.userService.validateUser(token);
    }
    validateTimeToken(token) {
        return this.userService.validateTimeToken(token);
    }
    sendChangePassword(email) {
        return this.userService.sendChangePassword(email);
    }
    changePassword(password, email) {
        return this.userService.changePassword(password, email);
    }
    loginUser(loginDto) {
        return this.userService.loginUser(loginDto);
    }
    registerUser(registerDto) {
        return this.userService.registerUser(registerDto);
    }
    renewToken(token) {
        return this.userService.renewToken(token);
    }
}
exports.UserRepositoryImpl = UserRepositoryImpl;
