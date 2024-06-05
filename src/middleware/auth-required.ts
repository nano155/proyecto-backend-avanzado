import { NextFunction, Request, Response } from "express";
import { JwtAdapter, Validators } from "../config";

export interface AuthenticatedRequest extends Request {
    user?: ValidToken; // ValidToken es la interfaz que contiene el contenido del token JWT
}

interface ValidToken {
    payload: {
      id:string,
      first_name: string;
      last_name: string;
      email: string;
      age: number;
      password: string;
      cart: string;
      role: string;
    };
    iat: number;
    exp: number;
  }

export class AuthRequired {

  static authRequired = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { token } = req.cookies;
      if (!token)
        return res
          .status(401)
          .json({ message: "No token, autorization denied!" });
      const validToken:ValidToken |null = await JwtAdapter.validateToken(token);
      if (!validToken){
        return res
          .status(401)
          .json({ message: "Invalid Token, autorization denied!" });
      }
      

          req.user = validToken
          
          next()

    } catch (error) {
        return res.status(500).send('Internal server error!')
    }
    
  };

  static mongoIdValidate = (req:Request, res:Response, next:NextFunction)=>{
    try {     
      const validateId =  Validators.validatorMongoId(req.params.id)
      if(!validateId) return res.status(400).send('Id not valid!')

        next()
    } catch (error) {
      return res.status(500).send('Internal server error!')
    }
    
  }

}