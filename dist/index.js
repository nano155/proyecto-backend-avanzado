"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const envs_1 = require("./config/envs");
const routes_1 = require("./presentation/routes");
const server_1 = require("./presentation/server");
const mongo_connect_1 = require("./service/dao/mongo/mongo-connect");
(() => {
    main();
})();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const swaggerOptions = {
            definition: {
                openapi: '3.0.1',
                info: {
                    title: 'Documentacion del poder',
                    description: 'API pensada para clase de Swagger',
                    version: '1.0.0'
                }
            },
            apis: [`./src/docs/**/*.yml`]
        };
        const server = new server_1.Server({
            port: envs_1.envs.PORT,
            public_path: path_1.default.join(__dirname, "../public"),
            routes: routes_1.AppRoutes.routes,
            swaggerOptions: swaggerOptions
        });
        try {
            yield mongo_connect_1.MongoConnect.start({ mongo_url: envs_1.envs.MONGO_URL, dbName: envs_1.envs.DB_NAME }); // Primera llamada
        }
        catch (error) {
            console.error('Error al conectar a MongoDB', error);
            return;
        }
        server.start();
    });
}
//# sourceMappingURL=index.js.map