import express, { Router } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { SwaggerAdapter, SwaggerOptions } from "../config";
import path from "path";

interface Options {
  port: number;
  public_path: string;
  routes: Router;
  swaggerOptions: SwaggerOptions;
}
export class Server {
  public readonly app = express();
  public readonly port;
  public readonly routes;
  public readonly public_path;
  public readonly swaggerOptions;

  constructor(options: Options) {
    this.port = options.port;
    this.public_path = options.public_path;
    this.routes = options.routes;
    this.swaggerOptions = options.swaggerOptions;

    this.configureMiddleware();
    this.configureRoutes();
  }

  private configureMiddleware() {
    const { swaggerUiServe, swaggerUiSetup } = SwaggerAdapter.create(
      this.swaggerOptions
    );

    this.app.use(
      cors({
        origin: "http://localhost:5173",
        credentials: true,
      })
    );

    this.app.use("/apidocs", swaggerUiServe, swaggerUiSetup);
    this.app.use(express.json());
    this.app.use(cookieParser());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.static(this.public_path));
  }

  private configureRoutes() {

    this.app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, "../public/index.html"));
    });


    this.app.use(this.routes);
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`Escuchando en el puerto ${this.port}`);
    });
  }

}
