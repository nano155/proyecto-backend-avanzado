"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.envs = void 0;
require("dotenv/config");
const env_var_1 = require("env-var");
exports.envs = {
    PORT: (0, env_var_1.get)("PORT").required().asPortNumber(),
    MONGO_URL: (0, env_var_1.get)("MONGO_URL").required().asString(),
    JWT_SEED: (0, env_var_1.get)("JWT_SEED").required().asString(),
    DB_NAME: (0, env_var_1.get)("DB_NAME").required().asString(),
    EMAIL_ADMIN: (0, env_var_1.get)("EMAIL_ADMIN").required().asEmailString(),
    PASSWORD_ADMIN: (0, env_var_1.get)("PASSWORD_ADMIN").required().asString(),
    WEBSERVICE_URL: (0, env_var_1.get)("WEBSERVICE_URL").required().asString(),
    MAILER_SERVICE: (0, env_var_1.get)("MAILER_SERVICE").required().asString(),
    MAILER_EMAIL: (0, env_var_1.get)("MAILER_EMAIL").required().asString(),
    MAILER_SECRET: (0, env_var_1.get)("MAILER_SECRET").required().asString(),
    CLOUDINARY_CLOUD_NAME: (0, env_var_1.get)("CLOUDINARY_CLOUD_NAME").required().asString(),
    CLOUDINARY_API_KEY: (0, env_var_1.get)("CLOUDINARY_API_KEY").required().asString(),
    CLOUDINARY_API_SECRET: (0, env_var_1.get)("CLOUDINARY_API_SECRET").required().asString(),
    STRIPE_APP_SECRET_KEY: (0, env_var_1.get)("STRIPE_APP_SECRET_KEY").required().asString(),
    URL: (0, env_var_1.get)("URL").required().asString()
};
//# sourceMappingURL=envs.js.map