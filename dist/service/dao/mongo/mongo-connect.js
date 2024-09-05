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
exports.MongoConnect = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
class MongoConnect {
    constructor() {
    }
    static start(options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!!MongoConnect.instance) {
                console.log('ya existe una instancia.');
                return MongoConnect.instance;
            }
            try {
                yield mongoose_1.default.connect(options.mongo_url, {
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
        });
    }
}
exports.MongoConnect = MongoConnect;
//# sourceMappingURL=mongo-connect.js.map