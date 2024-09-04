"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = require("express");
const repository_1 = require("../../service/repository");
const mongo_1 = require("../../service/dao/mongo");
const email_service_1 = require("../../service/dao/mongo/service/email.service");
const config_1 = require("../../config");
const controller_1 = require("./controller");
const auth_required_1 = require("../../middleware/auth-required");
class AuthRoutes {
    static get routes() {
        const router = (0, express_1.Router)();
        const emailService = new email_service_1.EmailService(config_1.envs.MAILER_SERVICE, config_1.envs.MAILER_EMAIL, config_1.envs.MAILER_SECRET);
        const userService = new mongo_1.UserService(emailService);
        const userRepository = new repository_1.UserRepositoryImpl(userService);
        const userController = new controller_1.AuthController(userRepository);
        router.post('/login', userController.loginUser);
        router.post('/register', userController.registerUser);
        router.get('/get-users', userController.getUsers);
        router.delete('/delete-users', userController.deteleUsers);
        router.put('/change-role/:id', [auth_required_1.AuthRequired.mongoIdValidate], userController.changeRole);
        router.post('/send-recover', userController.sendRecoverPassword);
        router.get('/validate-email/:token', userController.validateUser);
        router.get('/validate-time/:token', userController.validateTimeToken);
        router.post('/change-password', userController.changePassword);
        router.post('/logout', userController.logout);
        router.get('/renew-token', userController.renewToken);
        return router;
    }
}
exports.AuthRoutes = AuthRoutes;
