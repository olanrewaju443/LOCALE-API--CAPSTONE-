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
exports.LoginValidation = exports.RegisterValidation = void 0;
const joi_1 = __importDefault(require("joi"));
const UserRegSchema = joi_1.default.object({
    email: joi_1.default.string().trim().email().required(),
    name: joi_1.default.string().max(20).required().trim(),
    password: joi_1.default.string().required(),
    repeat_password: joi_1.default.ref("password"),
}).with("password", "repeat_password");
const UserLoginSchema = joi_1.default.object({
    email: joi_1.default.string().trim().required(),
    password: joi_1.default.string().required(),
});
function RegisterValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = req.body;
        try {
            yield UserRegSchema.validateAsync(user);
            next();
        }
        catch (error) {
            next({
                message: error.details[0].message,
                status: 400,
            });
        }
    });
}
exports.RegisterValidation = RegisterValidation;
function LoginValidation(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = req.body;
        try {
            yield UserLoginSchema.validateAsync(user);
            next();
        }
        catch (error) {
            next({
                message: error.details[0].message,
                status: 400,
            });
        }
    });
}
exports.LoginValidation = LoginValidation;
