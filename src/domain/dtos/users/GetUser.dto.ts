import { CustomError } from "../../error/custom-error"



export class GetUserDto{
    public name:string
    public email:string
    public rol:string

    constructor(name:string, email:string, rol:string){
        this.name=name
        this.email=email
        this.rol=rol
    }

    static createUser(user:{[key:string]:string}):GetUserDto{

        const {name, email, rol} = user
        if(!name)throw CustomError.badRequest('Debe proporcionar un nombre')
        if(!email)throw CustomError.badRequest('Debe proporcionar un email')
        if(!rol)throw CustomError.badRequest('Debe proporcionar un rol')

        return new GetUserDto(name, email, rol)
    }
}