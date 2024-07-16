import { NextFunction, Request, Response } from "express";
import { JwtAdapter, Validators } from "../config";
import { MulterAdapter } from "../config/multer-adapter";
import multer from "multer";

export interface AuthenticatedRequest extends Request {
  user?: ValidToken; // ValidToken es la interfaz que contiene el contenido del token JWT
}

interface ValidToken {
  payload: {
    id: string;
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

const storage = multer.memoryStorage(); // Usamos memoryStorage para propósitos de prueba

const upload = multer({ storage });

export class AuthRequired {
  static authRequired = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { token } = req.cookies;
      if (!token)
        return res
          .status(401)
          .json({ message: "No token, autorization denied!" });
      const validToken: ValidToken | null = await JwtAdapter.validateToken(
        token
      );
      if (!validToken) {
        return res
          .status(401)
          .json({ message: "Invalid Token, autorization denied!" });
      }

      req.user = validToken;

      next();
    } catch (error) {
      return res.status(500).send("Internal server error!");
    }
  };

  static mongoIdValidate = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const validateId = Validators.validatorMongoId(req.params.id);
      if (!validateId) return res.status(400).send("Id not valid!");

      next();
    } catch (error) {
      return res.status(500).send("Internal server error!");
    }
  };

  static uploadCloudinary =(folder:string)=> (req:Request, res:Response, next:NextFunction) => {
    const upload = MulterAdapter.uploader(folder).single('thumbnails');

    upload(req, res, (err) =>{
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ status: 'error', message: 'El tamaño del archivo excede el límite permitido' });
        }
        return res.status(400).json({ status: 'error', message: err.message });
      } else if (err) { 
        return res.status(500).json({ status: 'error', message: err.message });
      }

      next();
    })
    
  }

  static uploadCloudinaryMultiple =(folder:string)=> (req: Request, res: Response, next: NextFunction) => {
    const upload = MulterAdapter.uploader(folder).array('thumbnails', 10); // Hasta 10 archivos
    upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ status: 'error', message: 'El tamaño del archivo excede el límite permitido' });
        }
        return res.status(400).json({ status: 'error', message: err.message });
      } else if (err) {
        return res.status(500).json({ status: 'error', message: err.message });
      }
      next();
    });
  };
}
