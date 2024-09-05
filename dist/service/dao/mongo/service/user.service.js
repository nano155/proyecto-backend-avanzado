"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    deteletUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield models_1.userModel.find();
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
                    const deleteUser = yield models_1.userModel.findByIdAndDelete(user._id);
                    if (!deleteUser)
                        throw custom_error_1.CustomError.internalServer("Error al eliminar el usuario!");
                    const opciones = createOption(deleteUser.email);
                    const isSent = yield this.emailService.sendEmail(opciones);
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
        });
    }
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield models_1.userModel.find();
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
        });
    }
    loginUser(loginDto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userFind = yield models_1.userModel.findOne({ email: loginDto.email });
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
                const token = yield config_1.JwtAdapter.generateToken(userEntity);
                if (!token)
                    throw custom_error_1.CustomError.internalServer("Problem with generation token!");
                if (userFind.emailValidate === false) {
                    yield this.sendEmailValidationLink(userFind.email);
                }
                userFind.last_connection = loginDto.connection;
                yield userFind.save();
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
        });
    }
    registerUser(registerDto) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cartService = new cart_service_1.CartService();
                const userFind = yield models_1.userModel.findOne({ email: registerDto.email });
                if (userFind) {
                    throw custom_error_1.CustomError.badRequest(`Ya existe un usuario con el correo electrónico ${registerDto.email}`);
                }
                const cart = yield cartService.createCart();
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
                yield user.save();
                yield this.sendEmailValidationLink(user.email);
                const userEntity = user_entity_1.UserEntity.fromObject({
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    age: user.age,
                    password: config_1.BcryptAdapter.hash(user.password),
                    cart: cart.id.toString(),
                    role: user.role === user_entity_1.Role.admin ? user_entity_1.Role.admin : user_entity_1.Role.user,
                });
                const token = yield config_1.JwtAdapter.generateToken(userEntity);
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
        });
    }
    changeRoleToUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userFind = yield models_1.userModel.findById(id);
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
                yield userFind.save();
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
        });
    }
    sendEmailValidationLink(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = yield config_1.JwtAdapter.generateToken({ email });
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
            const isSent = yield this.emailService.sendEmail(options);
            if (!isSent)
                throw custom_error_1.CustomError.internalServer("Error sending email");
        });
    }
    validateUser(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = yield config_1.JwtAdapter.validateToken(token);
            if (!payload)
                throw custom_error_1.CustomError.badRequest("Invalid token");
            const { email } = payload.payload;
            if (!email)
                throw custom_error_1.CustomError.notFound("Email not in token");
            const user = yield models_1.userModel.findOne({ email: email });
            if (!user)
                throw custom_error_1.CustomError.notFound("Email no existe");
            user.emailValidate = true;
            yield user.save();
            return true;
        });
    }
    validateTimeToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = yield config_1.JwtAdapter.validateToken(token);
            if (!payload)
                return { ok: false, message: "Token expired" };
            const { email } = payload.payload;
            if (!email)
                return { ok: false, message: "Email dont exist in this token" };
            return { ok: true, message: "Change your password", email };
        });
    }
    sendChangePassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findEmail = yield models_1.userModel.findOne({ email: email });
                if (!findEmail)
                    throw custom_error_1.CustomError.notFound("Email not found");
                const token = yield config_1.JwtAdapter.generateToken({ email });
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
                const isSent = yield this.emailService.sendEmail(options);
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
        });
    }
    changePassword(password, email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const findEmail = yield models_1.userModel.findOne({ email: email });
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
        });
    }
    renewToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const payload = yield config_1.JwtAdapter.validateToken(token);
                if (!payload)
                    return { ok: false, message: "Token expired" };
                const { email } = payload.payload;
                if (!email)
                    return { ok: false, message: "Email dont exist in this token" };
                const userFind = yield models_1.userModel.findOne({ email });
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
                const newToken = yield config_1.JwtAdapter.generateToken(userEntity);
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
        });
    }
    loggoutUser(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const userToken = yield config_1.JwtAdapter.validateToken(token);
            if (!userToken)
                throw custom_error_1.CustomError.unauthorized("The User isn't login.");
            const { payload: { id }, } = userToken;
            try {
                const userConnection = yield models_1.userModel.findById(id);
                if (!userConnection)
                    throw custom_error_1.CustomError.notFound("We don't find user with id");
                userConnection.last_connection = new Date();
                yield userConnection.save();
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
        });
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map