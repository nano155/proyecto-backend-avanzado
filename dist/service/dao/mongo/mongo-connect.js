"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoConnect = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
class MongoConnect {
    constructor() {
    }
    static async start(options) {
        if (!!MongoConnect.instance) {
            console.log('ya existe una instancia.');
            return MongoConnect.instance;
        }
        try {
            await mongoose_1.default.connect(options.mongo_url, {
                dbName: options.dbName
            });
            console.log("Conectado a mongoDB");
            MongoConnect.instance = new MongoConnect();
            return MongoConnect.instance;
        }
        catch (error) {
            console.log(error);
            throw new Error('internal error');
        }
    }
}
exports.MongoConnect = MongoConnect;
