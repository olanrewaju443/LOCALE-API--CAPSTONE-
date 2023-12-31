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
exports.cache = exports.client = void 0;
const redis_1 = require("redis");
const config_1 = __importDefault(require("./config"));
exports.client = (0, redis_1.createClient)({
    url: `redis://${config_1.default.REDIS_USERNAME}:${config_1.default.REDIS_PASSWORD}@${config_1.default.REDIS_HOST}:${config_1.default.REDIS_PORT}/#11821362`,
});
// export const client = createClient({});
//Cache middleware
const cache = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let value;
    //checks if the route is the root route or a predefined route
    if (req.route.path.length > 1) {
        value = yield exports.client.get(req.route.path);
    }
    else if (req.query.state) {
        value = yield exports.client.get(req.query.state);
    }
    else {
        return next();
    }
    if (value) {
        const data = JSON.parse(value);
        console.log("from redis");
        return res.status(200).json(data);
    }
    else {
        console.log("from db");
        next();
    }
});
exports.cache = cache;
