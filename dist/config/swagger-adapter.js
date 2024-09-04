"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwaggerAdapter = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
class SwaggerAdapter {
    static create(swaggerOptions) {
        const specs = (0, swagger_jsdoc_1.default)(swaggerOptions);
        return {
            swaggerUiServe: swagger_ui_express_1.default.serve,
            swaggerUiSetup: swagger_ui_express_1.default.setup(specs)
        };
    }
}
exports.SwaggerAdapter = SwaggerAdapter;
