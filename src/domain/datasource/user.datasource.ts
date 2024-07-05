import { LoginUserDto, RegisterUserDto } from "../dtos";
import { UserEntity } from '../entity';

export abstract class UserDatasource{
    
    abstract loginUser(loginDto:LoginUserDto):Promise<{userEntity:UserEntity; token:any}> 
    abstract registerUser(registerDto: RegisterUserDto):Promise<{userEntity:UserEntity; token:any}> 
    abstract changeRoleToUser(id:string):Promise<UserEntity>
    abstract validateUser(token:string):Promise<Boolean>
    abstract validateTimeToken(token:string):Promise<{ok:Boolean, message:string, email?:string}>
    abstract sendChangePassword(email:string):Promise<any>
    abstract changePassword(password:string, email:string):Promise<string>
    abstract renewToken(token: string): Promise<{ ok: Boolean; message?: string; userEntity?:UserEntity; token?:any}>
    abstract loggoutUser(token: string):Promise<{message:string}>
}