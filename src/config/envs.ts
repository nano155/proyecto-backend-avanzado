import "dotenv/config";
import { get } from "env-var";

export const envs = {
  PORT: get("PORT").required().asPortNumber(),
  MONGO_URL: get("MONGO_URL").required().asString(),
  JWT_SEED: get("JWT_SEED").required().asString(),
  DB_NAME: get("DB_NAME").required().asString(),
  EMAIL_ADMIN: get("EMAIL_ADMIN").required().asEmailString(),
  PASSWORD_ADMIN: get("PASSWORD_ADMIN").required().asString(),
  WEBSERVICE_URL:get('WEBSERVICE_URL').required().asString()
};
