"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const config_1 = require("../config");
const path_1 = __importDefault(require("path"));
class Server {
    constructor(options) {
        this.app = (0, express_1.default)();
        this.port = options.port;
        this.public_path = options.public_path;
        this.routes = options.routes;
        this.swaggerOptions = options.swaggerOptions;
        this.configureMiddleware();
        this.configureRoutes();
    }
    configureMiddleware() {
        const { swaggerUiServe, swaggerUiSetup } = config_1.SwaggerAdapter.create(this.swaggerOptions);
        this.app.use((0, cors_1.default)({
            origin: "http://localhost:5173",
            credentials: true,
        }));
        this.app.use("/apidocs", swaggerUiServe, swaggerUiSetup);
        this.app.use(express_1.default.json({ limit: '50mb' })); // Aumentar límite de carga útil
        this.app.use((0, cookie_parser_1.default)());
        this.app.use(express_1.default.urlencoded({ extended: true, limit: '50mb' })); // Aumentar
        this.app.use(express_1.default.static(this.public_path));
    }
    configureRoutes() {
        this.app.use(this.routes);
        this.app.get('*', (req, res) => {
            res.sendFile(path_1.default.join(this.public_path, 'index.html'));
        });
    }
    start() {
        this.app.listen(this.port, () => {
            console.log(`Escuchando en el puerto ${this.port}`);
        });
    }
}
exports.Server = Server;
//# sourceMappingURL=server.js.map