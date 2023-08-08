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
exports.loginUser = exports.createUser = exports.getUser = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const uuid_1 = require("uuid");
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.default.find({});
    res.status(200).json({ message: `Success`, results: user.length, data: { user } });
});
exports.getUser = getUser;
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    //generate API key
    const apiKey = (0, uuid_1.v4)();
    try {
        const newUser = yield new userModel_1.default({
            name,
            email,
            apiKey,
            password,
        });
        yield newUser.save();
        res.status(201).json({
            message: `Success. Welcome ${newUser.name}`,
            data: { apiKey },
        });
    }
    catch (error) {
        //handling mongoDB unique error
        if (error.code == 11000) {
            (error.status = 409),
                (error.message = "Email already exists! Try a different one");
        }
        next(error);
    }
});
exports.createUser = createUser;
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield userModel_1.default.findOne({ email }).select("+password");
        if (!user || !(yield user.isValidPassword(password))) {
            return next({
                status: 401,
                message: "Incorrect email or password",
            });
        }
        const { apiKey } = user;
        res.status(200).json({ message: `Success. Welcome ${user.name}`, data: { apiKey } });
    }
    catch (error) {
        next(error);
    }
});
exports.loginUser = loginUser;
