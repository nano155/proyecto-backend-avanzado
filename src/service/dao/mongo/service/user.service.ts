import { BcryptAdapter, envs, JwtAdapter, Validators } from "../../../../config";
import { UserDatasource } from "../../../../domain/datasource";
import { LoginUserDto, RegisterUserDto } from "../../../../domain/dtos";
import { UserEntity, Role } from "../../../../domain/entity/user.entity";
import { CustomError } from "../../../../domain/error/custom-error";
import { userModel } from "../models";
import { CartService } from "./cart.service";
import { EmailService } from "./email.service";


export class UserService implements UserDatasource{

  constructor(
    private readonly emailService:EmailService
  ){}
  async loginUser(loginDto: LoginUserDto): Promise<{ userEntity: UserEntity; token: any; }> {
    try {
      const userFind = await userModel.findOne({ email: loginDto.email });
      if (!userFind) throw new Error(`Invalid credentials`);
      
      const isMatch = BcryptAdapter.compare(
        loginDto.password,
        userFind.password
      );
      
      if (!isMatch) throw new Error("Invalid credentials");
      
      const userEntity = UserEntity.fromObject({
        first_name: userFind.first_name,
        last_name: userFind.last_name,
        email: userFind.email,
        age: userFind.age,
        password: userFind.password,
        cart: userFind.cart._id.toString(),
        role: userFind.role === Role.admin ? Role.admin : Role.user,
      });
      
      
      const token = await JwtAdapter.generateToken(userEntity);
      
      return {
        userEntity,
        token: token,
      };
    } catch (error) {
      throw Error(`${error}`);
    }
  }

  
  async registerUser(registerDto: RegisterUserDto): Promise<{ userEntity: UserEntity; token: any; }> {
    try {
      const cartService = new CartService();
      const userFind = await userModel.findOne({ email: registerDto.email });
      
      if (userFind) {
        throw new Error(
          `Ya existe un usuario con el correo electrónico ${registerDto.email}`
        );
      }
      const cart = await cartService.createCart();
      if (!cart) throw new Error("Internal server error");
      
      const validatorId = Validators.validatorMongoId(cart.id);
      
      if (!validatorId) throw new Error("Mongo Id is not valregisterDto")
        
        const user = new userModel({
          first_name: registerDto.first_name,
          last_name: registerDto.last_name,
          email: registerDto.email,
          age: registerDto.age,
          password: BcryptAdapter.hash(registerDto.password),
          cart: cart.id.toString(),
          role: registerDto.role,
        });
        
        if (!user) throw new Error("Internal server error");
        
        await user.save();
        
        
        
        await this.sendEmailValidationLink(user.email);
        
        const userEntity = UserEntity.fromObject({
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          age: user.age,
          password: BcryptAdapter.hash(user.password),
          cart: cart.id.toString(),
          role: user.role === Role.admin ? Role.admin : Role.user,
        });
        
        
        const token = await JwtAdapter.generateToken(userEntity);
        
        return {
          userEntity,
          token: token,
        };
      } catch (error) {
        throw Error(`Error${error}`);
      }
    }
    
    private async sendEmailValidationLink(email: string) {
      const token = await JwtAdapter.generateToken({ email });
      if (!token) throw new Error("Error obteniendo token!");
      
      
      const link = `${envs.WEBSERVICE_URL}/users/validate-email/${token}`;
      
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
      
      const isSent = await this.emailService.sendEmail(options);
      if (!isSent) throw new Error("Error sending email");
    }
    
    async validateUser(token: string): Promise<Boolean> {
      const payload = await JwtAdapter.validateToken(token);
      if (!payload) throw new Error("Invalid token");
      
      const { email } = (payload as { payload: { email: string } }).payload;
      
      console.log(email);
      
      
      if (!email) throw new Error("Email not in token");
      
      const user = await userModel.findOne({ email: email });
      
      if (!user) throw new Error("Email no existe");
      
      user.emailValidate = true
      
      await user.save()
      
      return true
    }
    
    async forgetPassword(token: string): Promise<{ok:Boolean, message:string, email?:string}> {
      const payload = await JwtAdapter.validateToken(token);
      if (!payload) return{ok:false, message:'Token expired'};
      const {email} = (payload as{payload:{email:string} } ).payload
      if(!email) return{ok:false, message:'Email dont exist in this token'};
      
      return{ok:true, message:'Change your password', email}
    }
    
    async sendChangePassword(email: string):Promise<any> {
      try {
        const findEmail = await userModel.findOne({email:email})
        if(!findEmail) throw CustomError.badRequest('Email not found')
        const token = await JwtAdapter.generateToken({ email });
        if (!token) throw new Error("Error obteniendo token!");
        
        
        const link = `${envs.WEBSERVICE_URL}/users/changePassword/${token}`;
        
        const html = `
        <p> Click en el enlace para cambiar tu password! </p>
        <a  href="${link}">Cambia tu password</a> 
        `;
        const options = {
          to: email,
          subject: "Cambia tu password!",
          htmlBody: html,
        };
        
        const isSent = await this.emailService.sendEmail(options);
        if (!isSent) throw new Error("Error sending email");
        
      } catch (error) {
        throw CustomError.internalServer(`unexpected error ${error}`)
      }
    } 

    async changePassword(password: string, email: string): Promise<string> {
      try {
        const findEmail = await userModel.findOne({email:email})
        if(!findEmail) throw CustomError.badRequest('Email not found')
        findEmail.password = BcryptAdapter.hash(password)
        findEmail.save()
        return 'Password change succesfull'
        
      } catch (error) {
        throw CustomError.internalServer(`unexpected error ${error}`)
      }
    }
  }