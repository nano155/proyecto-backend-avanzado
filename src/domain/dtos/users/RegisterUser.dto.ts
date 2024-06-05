import { Validators } from "../../../config";

export class RegisterUserDto {
  public first_name: string;
  public last_name: string;
  public email: string;
  public age: number;
  public password: string;
  public role?: string
  private constructor(
    first_name: string,
    last_name: string,
    email: string,
    age: number,
    password: string,
    role?:string
  ) {
    this.first_name = first_name,
    this.last_name = last_name,
    this.email = email,
    this.age = age,
    this.password = password
    this.role = role
  }

    static create(object:{[key:string]:any}):[string?, RegisterUserDto?]{
        try {
            const userDto = Validators.validatorsDataTypeRegister(object)
            const {first_name, last_name, age, email, password, role} = userDto

            return [undefined, new RegisterUserDto(first_name, last_name, email, age, password, role)]            
        } catch (error) {
          if(error instanceof Error){
            return [error.message, undefined]
          }else{
            return ['Unknow error', undefined]
          }
            
        }
    }
}



