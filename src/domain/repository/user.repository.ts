import { LoginUserDto, RegisterUserDto } from "../dtos";
import { UserEntity } from '../entity/user.entity';

export abstract class UserRepository{
    
    abstract loginUser(loginDto:LoginUserDto):Promise<{userEntity:UserEntity; token:any}> 
    abstract registerUser(registerDto: RegisterUserDto):Promise<{userEntity:UserEntity; token:any}> 
    abstract validateUser():Promise<{ userEntity:UserEntity; token: any }>
    abstract forgetPassword():Promise<{userEntity:UserEntity; token: any}>

}