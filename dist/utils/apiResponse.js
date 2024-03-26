"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = __importDefault(require("http-status-codes"));
class ApiResponse {
}
ApiResponse.result = (res, message, data, status = 200) => {
    res.status(status);
    res.json({
        message: message,
        data,
    });
};
ApiResponse.error = (res, status = 400, error = http_status_codes_1.default.getStatusText(status)) => {
    res.status(status).json({
        error: {
            message: error,
        },
    });
};
exports.default = ApiResponse;
//# sourceMappingURL=apiResponse.js.map