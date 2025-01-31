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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const user_model_1 = require("../modules/user/user.model");
const AppError_1 = require("../error/AppError");
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = require("../utilities/catchAsync");
const auth = (...roles) => {
    return (0, catchAsync_1.catchAsync)((req, _res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        // checking if the token is missing
        if (!token) {
            throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, 'You are not authorized!');
        }
        // checking if the given token is valid
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt);
        const { email, role } = decoded;
        yield user_model_1.User.validateUser(email);
        if (roles && !roles.includes(role)) {
            throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, 'you are not authorized');
        }
        req.user = decoded;
        next();
    }));
};
exports.default = auth;
