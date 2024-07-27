import { CustomError } from "../../error/custom-error";

export class GetUserDto {
  public name: string;
  public email: string;
  public rol: string;
  public id: string;
  public lastConnection: Date;

  constructor(name: string, email: string, rol: string, id: string, lastConnection: Date) {
    this.name = name;
    this.email = email;
    this.rol = rol;
    this.id = id;
    this.lastConnection = lastConnection;
  }

  static createUser(user: { [key: string]: any }): GetUserDto {
    const { name, email, rol, id, lastConnection } = user;
    if (!name) throw CustomError.badRequest('Debe proporcionar un nombre');
    if (!email) throw CustomError.badRequest('Debe proporcionar un email');
    if (!rol) throw CustomError.badRequest('Debe proporcionar un rol');
    if (!id) throw CustomError.badRequest('Debe proporcionar un id');
    if (!lastConnection) throw CustomError.badRequest('Debe proporcionar una última conexión');

    // Asegúrate de que lastConnection sea un Date
    if (typeof lastConnection === 'string') {
      const parsedDate = new Date(lastConnection);
      if (isNaN(parsedDate.getTime())) {
        throw CustomError.badRequest('La última conexión debe ser una fecha válida');
      }
      return new GetUserDto(name, email, rol, id, parsedDate);
    }

    if (!(lastConnection instanceof Date)) {
      throw CustomError.badRequest('La última conexión debe ser una fecha válida');
    }

    return new GetUserDto(name, email, rol, id, lastConnection);
  }
}