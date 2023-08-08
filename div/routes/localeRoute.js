"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const localeController_1 = require("../controllers/localeController");
const cacheMiddleware_1 = require("../utils/cacheMiddleware");
const apiKeyValidation_1 = require("../utils/apiKeyValidation");
const router = (0, express_1.Router)();
router.use(apiKeyValidation_1.verifyToken);
router.get('/', cacheMiddleware_1.cache, localeController_1.getLocale);
router.get('/regions', cacheMiddleware_1.cache, localeController_1.getRegions);
router.get('/states', cacheMiddleware_1.cache, localeController_1.getStates);
router.get('/lgas', cacheMiddleware_1.cache, localeController_1.getLgas);
exports.default = router;