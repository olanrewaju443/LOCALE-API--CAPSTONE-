"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const mongoose = __importStar(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./utils/config"));
const cacheMiddleware_1 = require("./utils/cacheMiddleware");
const option = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: config_1.default.DBNAME,
};
function connectMongo(server) {
    const uri = config_1.default.MONGO_URI;
    mongoose.set("strictQuery", false);
    mongoose
        .connect(uri, option)
        .then(() => {
        cacheMiddleware_1.client.connect().then(() => __awaiter(this, void 0, void 0, function* () {
            console.log("Redis connected");
        }));
        cacheMiddleware_1.client.on("error", (err) => {
            console.log("Redis Client Error", err);
            throw err;
        });
        server.listen(config_1.default.PORT, () => {
            console.log(`Server and MongoDB are listening on port ${config_1.default.PORT}`);
        });
    })
        .catch((err) => console.log(err));
}
connectMongo(app_1.default);
