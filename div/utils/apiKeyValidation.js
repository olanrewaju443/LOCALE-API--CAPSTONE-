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
exports.verifyToken = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
//Verify Token
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //Auth header value = > send token into header
    const bearerHeader = req.headers['authorization'];
    // console.log(bearerHeader);
    //check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        // split the space at the bearer
        const bearer = bearerHeader.split(' ');
        // Get token from string
        const bearerToken = bearer[1];
        try {
            const user = yield userModel_1.default.findOne({ apiKey: bearerToken });
            if (!user) {
                return res.status(401).json({
                    message: "Unauthorized",
                    error: "You are not authorized to access this resource, please provide a valid API key or register for one"
                });
            }
            next();
        }
        catch (error) {
            next(error);
        }
    }
    else {
        return res.status(403).json({
            message: "Forbidden",
            error: "You are not authorized to access this resource"
        });
    }
});
exports.verifyToken = verifyToken;
