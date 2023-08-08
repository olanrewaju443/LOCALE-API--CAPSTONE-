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
exports.getLgas = exports.getStates = exports.getRegions = exports.getLocale = void 0;
const localeModel_1 = __importDefault(require("../models/localeModel"));
const cacheMiddleware_1 = require("../utils/cacheMiddleware");
const getLocale = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { state, region, page = 1, statesPerPage = 10 } = req.query;
    const findQuery = {};
    if (state) {
        findQuery.state = { $regex: state, $options: "i" };
    }
    if (region) {
        findQuery.region = { $regex: region, $options: "i" };
    }
    if (+page < 1) {
        return next({ status: 400, message: `Invalid page number` });
    }
    let locale;
    if (findQuery.state) {
        locale = yield localeModel_1.default.find(findQuery)
            .select("+lgas +senatorial_districts +past_governors +borders +known_for")
            .skip((Number(page) - 1) * Number(statesPerPage))
            .limit(Number(statesPerPage));
    }
    else {
        locale = yield localeModel_1.default.find(findQuery)
            .skip((Number(page) - 1) * Number(statesPerPage))
            .limit(Number(statesPerPage));
    }
    if (locale.length === 0) {
        return next({ status: 404, message: `No result found` });
    }
    const resp = { message: `Success`, results: locale.length, data: { locale } };
    if (state) {
        cacheMiddleware_1.client.set(state, JSON.stringify(resp));
    }
    res.status(200).json(resp);
});
exports.getLocale = getLocale;
const getRegions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const regionsAndData = yield localeModel_1.default.aggregate([
        {
            $group: {
                _id: "$region",
                states: { $push: "$state" },
                lgas: { $push: "$lgas" },
            },
        },
    ]);
    const regions = regionsAndData.map((locale) => locale._id).sort();
    const resp = {
        message: `Success`,
        results: regionsAndData.length,
        data: { regions, regionsAndData },
    };
    //Send to Redis
    cacheMiddleware_1.client.set("/regions", JSON.stringify(resp));
    res.status(200).json(resp);
});
exports.getRegions = getRegions;
const getStates = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const statesAndData = yield localeModel_1.default.aggregate([
        { $group: { _id: "$state", lgas: { $push: "$lgas" } } },
    ]);
    const states = statesAndData.map((locale) => locale._id).sort();
    const resp = {
        message: `Success`,
        results: statesAndData.length,
        data: { states, statesAndData },
    };
    //Send to Redis
    cacheMiddleware_1.client.set("/states", JSON.stringify(resp));
    res.status(200).json(resp);
});
exports.getStates = getStates;
const getLgas = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { page = 1, lgasPerPage = 20 } = req.query;
    if (+page < 1) {
        return next({ status: 400, message: `Invalid page number` });
    }
    const lgaData = yield localeModel_1.default.find({}).select("+lgas");
    const lgaArray = lgaData.map((lga) => lga.lgas);
    const localGovts = lgaArray.flat().sort();
    // Calculate the starting and ending indices of the current page
    const startIndex = (+page - 1) * +lgasPerPage;
    const endIndex = +startIndex + +lgasPerPage;
    // Get the paginated results using the slice() method
    const paginatedData = localGovts.slice(startIndex, endIndex);
    if (paginatedData.length === 0) {
        return next({ status: 404, message: `No result found` });
    }
    const resp = {
        message: `Success`,
        results: paginatedData.length,
        data: { localGovts: paginatedData },
    };
    res.status(200).json(resp);
});
exports.getLgas = getLgas;
