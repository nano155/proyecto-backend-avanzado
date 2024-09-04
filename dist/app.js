"use strict";
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
async function main() {
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
        await mongo_connect_1.MongoConnect.start({ mongo_url: envs_1.envs.MONGO_URL, dbName: envs_1.envs.DB_NAME }); // Primera llamada
    }
    catch (error) {
        console.error('Error al conectar a MongoDB', error);
        return;
    }
    server.start();
}
