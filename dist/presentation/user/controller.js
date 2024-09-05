"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const dtos_1 = require("../../domain/dtos");
const custom_error_1 = require("../../domain/error/custom-error");
class AuthController {
    constructor(userRepository) {
        this.userRepository = userRepository;
        this.handleError = (error, res) => {
            if (error instanceof custom_error_1.CustomError) {
                return res.status(error.statusCode).json({ error: error.message });
            }
            return res.status(500).json({ error: "Internal server error" });
        };
        this.loginUser = (req, res) => {
            const [error, loginUserDto] = dtos_1.LoginUserDto.create(req.body);
            if (error)
                return res.status(400).json({ error });
            this.userRepository
                .loginUser(loginUserDto)
                .then((user) => {
                res.cookie("token", user.token);
                return res.json(user);
            })
                .catch((error) => this.handleError(error, res));
        };
        this.getUsers = (req, res) => {
            this.userRepository.getUsers()
                .then(users => (res.json(users)))
                .catch((error) => this.handleError(error, res));
        };
        this.deteleUsers = (req, res) => {
            this.userRepository.deteletUsers()
                .then(users => res.json(users))
                .catch(error => this.handleError(error, res));
        };
        this.registerUser = (req, res) => {
            const [error, registerUserDto] = dtos_1.RegisterUserDto.create(req.body);
            if (error)
                return res.status(400).json({ error });
            this.userRepository
                .registerUser(registerUserDto)
                .then((user) => {
                return res.json(user);
            })
                .catch((error) => this.handleError(error, res));
        };
        this.changeRole = (req, res) => {
            const id = req.params.id;
            if (!id)
                return res.status(400).send("id dont received!");
            this.userRepository.changeRoleToUser(id)
                .then(user => res.json(user))
                .catch(error => this.handleError(error, res));
        };
        this.logout = (req, res) => {
            const { token } = req.cookies;
            if (!token)
                return res.status(400).send("token dont received!");
            this.userRepository.loggoutUser(token)
                .then(user => {
                res.cookie("token", "", {
                    expires: new Date(0),
                });
                return res.sendStatus(200);
            })
                .catch(error => this.handleError(error, res));
        };
        this.sendRecoverPassword = (req, res) => {
            const { email } = req.body;
            if (!email)
                return res.status(400).send("email dont received!");
            this.userRepository
                .sendChangePassword(email)
                .then((data) => res.json({ message: data.message }))
                .catch((error) => this.handleError(error, res));
        };
        this.validateUser = (req, res) => {
            const token = req.params.token;
            if (!token)
                return res.status(400).send("token dont received!");
            this.userRepository
                .validateUser(token)
                .then((data) => res.json(data))
                .catch((error) => this.handleError(error, res));
        };
        this.validateTimeToken = (req, res) => {
            const token = req.params.token;
            if (!token)
                return res.status(400).send("token dont received!");
            this.userRepository
                .validateTimeToken(token)
                .then((data) => res.json(data))
                .catch((error) => this.handleError(error, res));
        };
        this.changePassword = (req, res) => {
            const [error, changePasswordDto] = dtos_1.ChangePasswordDto.create(req.body);
            if (error)
                res.status(400).json({ error });
            const { password, email } = changePasswordDto;
            this.userRepository
                .changePassword(password, email)
                .then((user) => res.json(user))
                .catch((error) => this.handleError(error, res));
        };
        this.renewToken = (req, res) => {
            const { token } = req.cookies;
            if (!token)
                return res.status(400).send("token dont received!");
            this.userRepository.renewToken(token)
                .then(user => {
                res.cookie('token', user.token);
                return res.status(200).json(user);
            })
                .catch(error => this.handleError(error, res));
        };
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=controller.js.map