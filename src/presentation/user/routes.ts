
import { Router } from "express";
import { UserRepositoryImpl } from "../../service/repository";
import { UserService } from "../../service/dao/mongo";
import { EmailService } from "../../service/dao/mongo/service/email.service";
import { envs } from "../../config";
import { AuthController } from "./controller";
import { AuthRequired } from "../../middleware/auth-required";


export class AuthRoutes{

    static get routes(){
        const router = Router()

        const emailService = new EmailService(envs.MAILER_SERVICE,envs.MAILER_EMAIL, envs.MAILER_SECRET)
        const userService = new UserService(emailService)
        const userRepository= new UserRepositoryImpl(userService)
        const userController = new AuthController(userRepository)

        router.post('/login', userController.loginUser)
        router.post('/register', userController.registerUser)
        router.post('/change-role/:id',[AuthRequired.mongoIdValidate],  userController.changeRole)
        router.post('/send-recover', userController.sendRecoverPassword)
        router.get('/validate-email/:token',userController.validateUser)
        router.get('/validate-time/:token', userController.validateTimeToken)
        router.post('/change-password', userController.changePassword )
        router.post('/logout', userController.logout)
        router.get('/renew-token', userController.renewToken)

        return router
    }
}