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
exports.AdminService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AppError_1 = require("../../error/AppError");
const user_model_1 = require("../user/user.model");
const config_1 = __importDefault(require("../../config"));
const http_status_1 = __importDefault(require("http-status"));
const loginAdmin = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield user_model_1.User.validateUser(payload.email);
    const isPasswordCorrect = yield user_model_1.User.isPasswordMatched(payload === null || payload === void 0 ? void 0 : payload.password, admin === null || admin === void 0 ? void 0 : admin.password);
    if (!isPasswordCorrect) {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, 'Your password in incorrect ');
    }
    const jwtPayload = {
        email: admin.email,
        role: admin.role,
    };
    const accessToken = jsonwebtoken_1.default.sign(jwtPayload, config_1.default.jwt, { expiresIn: '10d' });
    const refreshToken = jsonwebtoken_1.default.sign(jwtPayload, config_1.default.jwtRef, {
        expiresIn: '365d',
    });
    return {
        accessToken,
        refreshToken,
    };
});
const blockUser = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id);
    if (!user) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'User is not found');
    }
    if (user === null || user === void 0 ? void 0 : user.isBlocked) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'User is already blocked');
    }
    const result = yield user_model_1.User.findByIdAndUpdate(id, payload, {
        new: true,
    });
    return result;
});
exports.AdminService = {
    loginAdmin,
    blockUser,
};
