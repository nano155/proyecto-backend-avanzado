import { Request, Response } from "express";
import {
  ChangePasswordDto,
  LoginUserDto,
  RegisterUserDto,
} from "../../domain/dtos";
import { CustomError } from "../../domain/error/custom-error";
import { UserRepository } from "../../domain/repository";

export class AuthController {
  constructor(public readonly userRepository: UserRepository) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(500).json({ error: "Internal server error" });
  };

  public loginUser = (req: Request, res: Response) => {
    const [error, loginUserDto] = LoginUserDto.create(req.body);
    if (error) return res.status(400).json({ error });

    this.userRepository
      .loginUser(loginUserDto!)
      .then((user) => {
        res.cookie("token", user.token);
        return res.json(user);
      })
      .catch((error) => this.handleError(error, res));
  };

  public getUsers = (req:Request, res:Response) =>{
    this.userRepository.getUsers()
    .then(users =>(res.json(users)))
    .catch((error) => this.handleError(error, res));
  }

  public deteleUsers = (req:Request, res:Response)=>{
    this.userRepository.deteletUsers()
    .then(users => res.json(users))
    .catch(error => this.handleError(error, res))
  }

  public registerUser = (req: Request, res: Response) => {
    const [error, registerUserDto] = RegisterUserDto.create(req.body);
    if (error) return res.status(400).json({ error });

    this.userRepository
      .registerUser(registerUserDto!)
      .then((user) => {
        return res.json(user);
      })
      .catch((error) => this.handleError(error, res));
  };

  public changeRole = (req:Request, res:Response) =>{
    const id = req.params.id
    
    if(!id) return res.status(400).send("id dont received!");

    this.userRepository.changeRoleToUser(id)
    .then(user => res.json(user))
    .catch(error => this.handleError(error, res))
  }

  public logout = (req: Request, res: Response) => {
    const {token} = req.cookies
    if(!token) return res.status(400).send("token dont received!");    

    this.userRepository.loggoutUser(token)
    .then(user => {
      res.cookie("token", "", {
        expires: new Date(0),
      });
      return res.sendStatus(200)
    }
  )
    .catch(error => this.handleError(error, res))  
  };

  public sendRecoverPassword = (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) return res.status(400).send("email dont received!");

    this.userRepository
      .sendChangePassword(email)
      .then((data) => res.json({ message: data.message }))
      .catch((error) => this.handleError(error, res));
  };

  public validateUser = (req: Request, res: Response) => {
    const token = req.params.token;
    if (!token) return res.status(400).send("token dont received!");

    this.userRepository
      .validateUser(token)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(error, res));
  };
  public validateTimeToken = (req: Request, res: Response) => {
    const token = req.params.token;
    if (!token) return res.status(400).send("token dont received!");

    this.userRepository
      .validateTimeToken(token)
      .then((data) => res.json(data))
      .catch((error) => this.handleError(error, res));
  };

  public changePassword = (req: Request, res: Response) => {
    const [error, changePasswordDto] = ChangePasswordDto.create(req.body);
    if (error) res.status(400).json({ error });
    const { password, email } = changePasswordDto!;

    this.userRepository
      .changePassword(password, email)
      .then((user) => res.json(user))
      .catch((error) => this.handleError(error, res));
  };

  public renewToken = (req:Request, res:Response) =>{
    const {token} = req.cookies;
    if (!token) return res.status(400).send("token dont received!");

    this.userRepository.renewToken(token)
    .then(user => {
      res.cookie('token', user.token)
      return res.status(200).json(user)
    })
    .catch(error => this.handleError(error, res))
  }
}
