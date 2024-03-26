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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = exports.verifyPassword = exports.hashPassword = exports.verifyToken = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const apiResponse_1 = __importDefault(require("../utils/apiResponse"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt = __importStar(require("bcrypt"));
const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token.split(" ")[1], String(process.env.SECRET_KEY));
            req.body.user = decoded;
            next();
        }
        catch (err) {
            apiResponse_1.default.error(res, http_status_codes_1.default.BAD_REQUEST, "Invalid Token");
            return null;
        }
    }
    else {
        apiResponse_1.default.error(res, http_status_codes_1.default.BAD_REQUEST, "No token provided");
        return null;
    }
};
exports.verifyToken = verifyToken;
const hashPassword = async (password) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
};
exports.hashPassword = hashPassword;
const verifyPassword = async (arg) => {
    const passwordMatch = await bcrypt.compare(arg.inputPassword, arg.hashPassword);
    if (passwordMatch) {
        return passwordMatch;
    }
    else {
        return false;
    }
};
exports.verifyPassword = verifyPassword;
const generateToken = (arg) => {
    const token = jsonwebtoken_1.default.sign({ id: arg.id, user: arg.user }, arg.secretKey, {
        expiresIn: "24h",
    });
    return token;
};
exports.generateToken = generateToken;
//# sourceMappingURL=commonMiddlewares.js.map