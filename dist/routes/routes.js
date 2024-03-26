"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allRoutes = void 0;
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
//authentication
const commonMiddlewares_1 = require("../middleware/commonMiddlewares");
//validations
const User_1 = require("../validation/User");
//controllers
const userController_1 = require("../users/controller/userController");
router.get("/", userController_1.initialRoute);
router.post("/signup", User_1.registerSchemaValidation, userController_1.createUser);
router.post("/signin", User_1.loginSchemaValidation, userController_1.loginUser);
router.post("/verify-email", User_1.verifyEmailSchemaValidation, commonMiddlewares_1.verifyToken, userController_1.verifyEmailCode);
exports.allRoutes = router;
//# sourceMappingURL=routes.js.map