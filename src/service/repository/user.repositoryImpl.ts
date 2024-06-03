import { LoginUserDto, RegisterUserDto } from "../../domain/dtos";
import { UserEntity } from "../../domain/entity/user.entity";
import { UserRepository } from "../../domain/repository";
import { UserService } from "../dao/mongo";



export class UserRepositoryImpl implements UserRepository{

    constructor(
        readonly userService:UserService
    ){}
    loginUser(loginDto: LoginUserDto): Promise<{ userEntity: UserEntity; token: any; }> {
        return this.userService.loginUser(loginDto)
    }
    registerUser(registerDto: RegisterUserDto): Promise<{ userEntity: UserEntity; token: any; }> {
        return this.userService.registerUser(registerDto)
    }
    validateUser(): Promise<{ userEntity: UserEntity; token: any; }> {
        return this.validateUser()
    }
    forgetPassword(): Promise<{ userEntity: UserEntity; token: any; }> {
        return this.forgetPassword()
    }

}