"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const config_1 = require("../../../../config");
const dtos_1 = require("../../../../domain/dtos");
const user_entity_1 = require("../../../../domain/entity/user.entity");
const custom_error_1 = require("../../../../domain/error/custom-error");
const models_1 = require("../models");
const cart_service_1 = require("./cart.service");
class UserService {
    constructor(emailService) {
        this.emailService = emailService;
    }
    async deteletUsers() {
        try {
            const users = await models_1.userModel.find();
            const diferencia = 172800000;
            const horaActual = new Date().getTime();
            const lastConnectionUsers = users.filter((user) => {
                const horaCreated = new Date(user.createdAt).getTime();
                if (user.last_connection === null) {
                    return horaActual - horaCreated >= diferencia;
                }
                const horaConnection = new Date(user.last_connection).getTime();
                return horaActual - horaConnection >= diferencia;
            });
            const html = `
      <h3>Eliminacion del correo!</h3>
      <p> Su correo ha sido eliminado por inactividad! </p>
      `;
            const createOption = (email) => {
                const options = {
                    to: email,
                    subject: "Usuario eliminado",
                    htmlBody: html,
                };
                return options;
            };
            for (const user of lastConnectionUsers) {
                const deleteUser = await models_1.userModel.findByIdAndDelete(user._id);
                if (!deleteUser)
                    throw custom_error_1.CustomError.internalServer("Error al eliminar el usuario!");
                const opciones = createOption(deleteUser.email);
                const isSent = await this.emailService.sendEmail(opciones);
                if (!isSent)
                    throw custom_error_1.CustomError.internalServer("Error sending email");
            }
            return lastConnectionUsers.map(user => {
                const { id, email } = user;
                return {
                    id,
                    email,
                };
            });
        }
        catch (error) {
            if (error instanceof custom_error_1.CustomError) {
                throw error;
            }
            else {
                throw custom_error_1.CustomError.internalServer(`${error}`);
            }
        }
    }
    async getUsers() {
        try {
            const users = await models_1.userModel.find();
            if (users.length < 1)
                throw custom_error_1.CustomError.notFound("Users is empty!");
            return users.map((user) => {
                const { first_name, last_name, email, role, id, last_connection, createdAt } = user;
                const lastConnectionDate = last_connection === null ? new Date(createdAt) : new Date(last_connection);
                return dtos_1.GetUserDto.createUser({
                    name: `${first_name} ${last_name}`,
                    email,
                    rol: role,
                    id,
                    lastConnection: lastConnectionDate
                });
            });
        }
        catch (error) {
            if (error instanceof custom_error_1.CustomError) {
                throw error;
            }
            else {
                throw custom_error_1.CustomError.internalServer(`${error}`);
            }
        }
    }
    async loginUser(loginDto) {
        try {
            const userFind = await models_1.userModel.findOne({ email: loginDto.email });
            if (!userFind)
                throw custom_error_1.CustomError.badRequest(`Invalid credentials`);
            const isMatch = config_1.BcryptAdapter.compare(loginDto.password, userFind.password);
            if (!isMatch)
                throw custom_error_1.CustomError.badRequest("Invalid credentials");
            const userEntity = user_entity_1.UserEntity.fromObject({
                id: userFind._id,
                first_name: userFind.first_name,
                last_name: userFind.last_name,
                email: userFind.email,
                validateEmail: userFind.emailValidate,
                age: userFind.age,
                password: userFind.password,
                cart: userFind.cart._id.toString(),
                role: userFind.role,
            });
            const token = await config_1.JwtAdapter.generateToken(userEntity);
            if (!token)
                throw custom_error_1.CustomError.internalServer("Problem with generation token!");
            if (userFind.emailValidate === false) {
                await this.sendEmailValidationLink(userFind.email);
            }
            userFind.last_connection = loginDto.connection;
            await userFind.save();
            return {
                userEntity,
                token: token,
            };
        }
        catch (error) {
            if (error instanceof custom_error_1.CustomError) {
                throw error;
            }
            else {
                throw custom_error_1.CustomError.internalServer(`${error}`);
            }
        }
    }
    async registerUser(registerDto) {
        try {
            const cartService = new cart_service_1.CartService();
            const userFind = await models_1.userModel.findOne({ email: registerDto.email });
            if (userFind) {
                throw custom_error_1.CustomError.badRequest(`Ya existe un usuario con el correo electrónico ${registerDto.email}`);
            }
            const cart = await cartService.createCart();
            if (!cart)
                throw new Error("Internal server error");
            const validatorId = config_1.Validators.validatorMongoId(cart.id);
            if (!validatorId)
                throw custom_error_1.CustomError.badRequest("Mongo Id is not valregisterDto");
            const user = new models_1.userModel({
                first_name: registerDto.first_name,
                last_name: registerDto.last_name,
                email: registerDto.email,
                age: registerDto.age,
                password: config_1.BcryptAdapter.hash(registerDto.password),
                cart: cart.id.toString(),
                role: registerDto.role,
            });
            if (!user)
                throw custom_error_1.CustomError.internalServer("Internal server error");
            await user.save();
            await this.sendEmailValidationLink(user.email);
            const userEntity = user_entity_1.UserEntity.fromObject({
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                age: user.age,
                password: config_1.BcryptAdapter.hash(user.password),
                cart: cart.id.toString(),
                role: user.role === user_entity_1.Role.admin ? user_entity_1.Role.admin : user_entity_1.Role.user,
            });
            const token = await config_1.JwtAdapter.generateToken(userEntity);
            return {
                userEntity,
                token: token,
            };
        }
        catch (error) {
            if (error instanceof custom_error_1.CustomError) {
                throw error;
            }
            else {
                throw custom_error_1.CustomError.internalServer(`${error}`);
            }
        }
    }
    async changeRoleToUser(id) {
        try {
            const userFind = await models_1.userModel.findById(id);
            if (!userFind)
                throw custom_error_1.CustomError.badRequest("Not found user with id");
            if (userFind.role === "admin")
                throw custom_error_1.CustomError.unauthorized("if user is admin, you dont change the role.");
            if (userFind.role === "user") {
                userFind.role = "premium";
            }
            else {
                userFind.role = "user";
            }
            await userFind.save();
            return user_entity_1.UserEntity.fromObject(userFind);
        }
        catch (error) {
            if (error instanceof custom_error_1.CustomError) {
                throw error;
            }
            else {
                throw custom_error_1.CustomError.internalServer(`${error}`);
            }
        }
    }
    async sendEmailValidationLink(email) {
        const token = await config_1.JwtAdapter.generateToken({ email });
        if (!token)
            throw custom_error_1.CustomError.internalServer("Error obteniendo token!");
        const link = `${config_1.envs.WEBSERVICE_URL}/users/validate-email/${token}`;
        const html = `
    <h1> Valida tu email</h1>
      <p> Click en el enlace para validar tu email! </p>
      <a  href="${link}">Valida tu email: ${email}</a> 
      `;
        const options = {
            to: email,
            subject: "Valida tu email",
            htmlBody: html,
        };
        const isSent = await this.emailService.sendEmail(options);
        if (!isSent)
            throw custom_error_1.CustomError.internalServer("Error sending email");
    }
    async validateUser(token) {
        const payload = await config_1.JwtAdapter.validateToken(token);
        if (!payload)
            throw custom_error_1.CustomError.badRequest("Invalid token");
        const { email } = payload.payload;
        if (!email)
            throw custom_error_1.CustomError.notFound("Email not in token");
        const user = await models_1.userModel.findOne({ email: email });
        if (!user)
            throw custom_error_1.CustomError.notFound("Email no existe");
        user.emailValidate = true;
        await user.save();
        return true;
    }
    async validateTimeToken(token) {
        const payload = await config_1.JwtAdapter.validateToken(token);
        if (!payload)
            return { ok: false, message: "Token expired" };
        const { email } = payload.payload;
        if (!email)
            return { ok: false, message: "Email dont exist in this token" };
        return { ok: true, message: "Change your password", email };
    }
    async sendChangePassword(email) {
        try {
            const findEmail = await models_1.userModel.findOne({ email: email });
            if (!findEmail)
                throw custom_error_1.CustomError.notFound("Email not found");
            const token = await config_1.JwtAdapter.generateToken({ email });
            if (!token)
                throw custom_error_1.CustomError.internalServer("Error obteniendo token!");
            const link = `${config_1.envs.WEBSERVICE_URL}/users/validate-time/${token}`;
            const html = `
        <p> Click en el enlace para cambiar tu password! </p>
        <a  href="${link}">Cambia tu password</a> 
        `;
            const options = {
                to: email,
                subject: "Cambia tu password!",
                htmlBody: html,
            };
            const isSent = await this.emailService.sendEmail(options);
            if (!isSent)
                throw custom_error_1.CustomError.internalServer("Error sending email");
            return {
                message: "Email sent",
            };
        }
        catch (error) {
            if (error instanceof custom_error_1.CustomError) {
                throw error;
            }
            else {
                throw custom_error_1.CustomError.internalServer(`${error}`);
            }
        }
    }
    async changePassword(password, email) {
        try {
            const findEmail = await models_1.userModel.findOne({ email: email });
            if (!findEmail)
                throw custom_error_1.CustomError.badRequest("Email not found");
            findEmail.password = config_1.BcryptAdapter.hash(password);
            findEmail.save();
            return "Password change succesfull";
        }
        catch (error) {
            if (error instanceof custom_error_1.CustomError) {
                throw error;
            }
            else {
                throw custom_error_1.CustomError.internalServer(`${error}`);
            }
        }
    }
    async renewToken(token) {
        try {
            const payload = await config_1.JwtAdapter.validateToken(token);
            if (!payload)
                return { ok: false, message: "Token expired" };
            const { email } = payload.payload;
            if (!email)
                return { ok: false, message: "Email dont exist in this token" };
            const userFind = await models_1.userModel.findOne({ email });
            if (!userFind)
                throw custom_error_1.CustomError.badRequest(`Don't exist this account in DB`);
            const userEntity = user_entity_1.UserEntity.fromObject({
                id: userFind._id,
                first_name: userFind.first_name,
                last_name: userFind.last_name,
                email: userFind.email,
                validateEmail: userFind.emailValidate,
                age: userFind.age,
                password: userFind.password,
                cart: userFind.cart._id.toString(),
                role: userFind.role,
            });
            const newToken = await config_1.JwtAdapter.generateToken(userEntity);
            if (!newToken)
                throw custom_error_1.CustomError.internalServer("Problem with generation token!");
            return {
                ok: true,
                userEntity,
                token: newToken,
            };
        }
        catch (error) {
            if (error instanceof custom_error_1.CustomError) {
                throw error;
            }
            else {
                throw custom_error_1.CustomError.internalServer(`${error}`);
            }
        }
    }
    async loggoutUser(token) {
        const userToken = await config_1.JwtAdapter.validateToken(token);
        if (!userToken)
            throw custom_error_1.CustomError.unauthorized("The User isn't login.");
        const { payload: { id }, } = userToken;
        try {
            const userConnection = await models_1.userModel.findById(id);
            if (!userConnection)
                throw custom_error_1.CustomError.notFound("We don't find user with id");
            userConnection.last_connection = new Date();
            await userConnection.save();
            return {
                message: "Usuario desconectado.",
            };
        }
        catch (error) {
            if (error instanceof custom_error_1.CustomError) {
                throw error;
            }
            else {
                throw custom_error_1.CustomError.internalServer(`${error}`);
            }
        }
    }
}
exports.UserService = UserService;
