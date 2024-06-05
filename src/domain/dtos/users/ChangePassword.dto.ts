import { regularExps } from "../../../config"


export class ChangePasswordDto{

    public password:string;
    public email:string;

    private constructor(password:string, email:string){
        this.password = password
        this.email = email
    }

    static create (object:{[key:string]:any}):[string?, ChangePasswordDto?]{
      const {password, email} = object
      
      if(!email) return [('email is required')]
      if(!regularExps.email.test(email)) return[('email is not valid')]
      if(!password) return[('password is required')]
      if(password.length <5) return[('password is too short')] 
        
        return [undefined, new ChangePasswordDto(password, email)]
    }
}