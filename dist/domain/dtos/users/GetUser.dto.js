"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserDto = void 0;
const custom_error_1 = require("../../error/custom-error");
class GetUserDto {
    constructor(name, email, rol, id, lastConnection) {
        this.name = name;
        this.email = email;
        this.rol = rol;
        this.id = id;
        this.lastConnection = lastConnection;
    }
    static createUser(user) {
        const { name, email, rol, id, lastConnection } = user;
        if (!name)
            throw custom_error_1.CustomError.badRequest('Debe proporcionar un nombre');
        if (!email)
            throw custom_error_1.CustomError.badRequest('Debe proporcionar un email');
        if (!rol)
            throw custom_error_1.CustomError.badRequest('Debe proporcionar un rol');
        if (!id)
            throw custom_error_1.CustomError.badRequest('Debe proporcionar un id');
        if (!lastConnection)
            throw custom_error_1.CustomError.badRequest('Debe proporcionar una última conexión');
        // Asegúrate de que lastConnection sea un Date
        if (typeof lastConnection === 'string') {
            const parsedDate = new Date(lastConnection);
            if (isNaN(parsedDate.getTime())) {
                throw custom_error_1.CustomError.badRequest('La última conexión debe ser una fecha válida');
            }
            return new GetUserDto(name, email, rol, id, parsedDate);
        }
        if (!(lastConnection instanceof Date)) {
            throw custom_error_1.CustomError.badRequest('La última conexión debe ser una fecha válida');
        }
        return new GetUserDto(name, email, rol, id, lastConnection);
    }
}
exports.GetUserDto = GetUserDto;
//# sourceMappingURL=GetUser.dto.js.map