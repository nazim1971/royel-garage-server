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
exports.AuthService = exports.changePassword = void 0;
const config_1 = __importDefault(require("../../config"));
const AppError_1 = require("../../error/AppError");
const user_model_1 = require("../user/user.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_1 = __importDefault(require("http-status"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const registerUserIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.isUserExists(payload === null || payload === void 0 ? void 0 : payload.email);
    if (user) {
        throw new AppError_1.AppError(http_status_1.default.CONFLICT, 'Customer Already Exist');
    }
    const data = yield user_model_1.User.create(payload);
    const { _id, name, email, image } = data;
    const result = { _id, name, email, image };
    return result;
});
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the user is exist
    const user = yield user_model_1.User.validateUser(payload.email);
    // Check if the password matches
    const isPasswordMatch = yield user_model_1.User.isPasswordMatched(payload === null || payload === void 0 ? void 0 : payload.password, user === null || user === void 0 ? void 0 : user.password);
    if (!isPasswordMatch) {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, 'Invalid credentials');
    }
    //create token and send to the client
    const jwtPayload = {
        email: user.email,
        role: user.role,
    };
    const accessToken = jsonwebtoken_1.default.sign(jwtPayload, config_1.default.jwt, { expiresIn: '30d' });
    const refreshToken = jsonwebtoken_1.default.sign(jwtPayload, config_1.default.jwtRef, {
        expiresIn: '365d',
    });
    return {
        accessToken,
        refreshToken,
    };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    // * Verify and decode token
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwtRef);
    // * Validate and extract user from DB.
    const user = yield user_model_1.User.validateUser(decoded.email);
    // * Create token and send to the  client.
    const jwtPayload = {
        email: user.email,
        role: user.role,
    };
    const accessToken = jsonwebtoken_1.default.sign(jwtPayload, config_1.default.jwt, { expiresIn: '30d' });
    return { token: accessToken };
});
const getSingleUser = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'User not found');
    }
    if (user === null || user === void 0 ? void 0 : user.isBlocked) {
        throw new AppError_1.AppError(http_status_1.default.FORBIDDEN, 'User is blocked');
    }
    return user;
});
const updateUserName = (email, newName) => __awaiter(void 0, void 0, void 0, function* () {
    // Find the user by email and update the name, returning the updated document
    const user = yield user_model_1.User.findOneAndUpdate({ email }, // Query condition: find user by email
    { name: newName }, { new: true } // Ensure we get the updated user object back
    );
    if (!user) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'User not found');
    }
    if (user.isBlocked) {
        throw new AppError_1.AppError(http_status_1.default.FORBIDDEN, 'User is blocked');
    }
    return user;
});
const changePassword = (email, currentPassword, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    // Find the user
    const user = yield user_model_1.User.findOne({ email }).select('+password');
    if (!user) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const userStatus = user === null || user === void 0 ? void 0 : user.isBlocked;
    // check if the user is already deleted
    if (userStatus === true) {
        throw new AppError_1.AppError(http_status_1.default.FORBIDDEN, 'This user is blocked!!!');
    }
    // Verify current password
    const isPasswordCorrect = yield user_model_1.User.isPasswordMatched(currentPassword, user.password);
    if (!isPasswordCorrect) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Current password is incorrect');
    }
    const newHashedPassword = yield bcrypt_1.default.hash(newPassword, Number(config_1.default.slat));
    yield user_model_1.User.findOneAndUpdate({ email }, { password: newHashedPassword });
    return { message: 'Password updated successfully' };
});
exports.changePassword = changePassword;
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_model_1.User.find();
    if (!users.length) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'No users found');
    }
    return users.map((user) => ({
        name: user.name,
        email: user.email,
        isBlocked: user.isBlocked,
        role: user.role
    }));
});
// Update isBlocked field
const updateUserBlockedStatus = (email, isBlocked) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findOne({ email });
    if (!user) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'User not found');
    }
    if (user.isBlocked && isBlocked) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'User is already blocked');
    }
    const result = yield user_model_1.User.findOneAndUpdate({ email }, { isBlocked }, { new: true });
    return {
        name: result === null || result === void 0 ? void 0 : result.name,
        email: result === null || result === void 0 ? void 0 : result.email,
        isBlocked: result === null || result === void 0 ? void 0 : result.isBlocked,
    };
});
exports.AuthService = { registerUserIntoDB, loginUser, refreshToken, getSingleUser, updateUserName, changePassword: exports.changePassword, getAllUsers, updateUserBlockedStatus };
