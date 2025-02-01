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
exports.AuthController = void 0;
const config_1 = __importDefault(require("../../config"));
const catchAsync_1 = require("../../utilities/catchAsync");
const sendResponse_1 = require("../../utilities/sendResponse");
const auth_service_1 = require("./auth.service");
const http_status_1 = __importDefault(require("http-status"));
const registerUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.AuthService.registerUserIntoDB(req.body);
    const { _id, name, email, image } = result;
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: 'User registered successfully',
        statusCode: http_status_1.default.CREATED,
        data: {
            _id,
            name,
            email,
            image
        },
    });
}));
const loginUser = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tokens = yield auth_service_1.AuthService.loginUser(req.body);
    const { refreshToken, accessToken } = tokens;
    res.cookie('refreshToken', refreshToken, {
        secure: config_1.default.nodeEnv === 'production',
        httpOnly: true,
    });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Login successful',
        data: {
            token: accessToken,
            RToken: refreshToken,
        },
    });
}));
const refreshToken = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.cookies;
    const result = yield auth_service_1.AuthService.refreshToken(refreshToken);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Access token is retrieved successfully!',
        data: result,
    });
}));
const getSingleUserFromDB = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield auth_service_1.AuthService.getSingleUser(req.params.email);
    const userResponse = {
        name: user.name,
        email: user.email,
    };
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User retrieved successfully!',
        data: userResponse,
    });
}));
const updateUserNameFromDB = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params; // Get email from request params
    const { newName } = req.body; // Get newName from request body
    // Validate that newName is provided
    if (!newName) {
        return (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_1.default.BAD_REQUEST,
            success: false,
            message: 'New name is required',
        });
    }
    // Call the service to update the user's name
    const user = yield auth_service_1.AuthService.updateUserName(email, newName);
    const userResponse = {
        name: user.name,
        email: user.email,
    };
    // Send success response
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User name updated successfully!',
        data: userResponse,
    });
}));
const resetPassword = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { currentPassword, email, newPassword } = req.body;
    const result = yield auth_service_1.AuthService.changePassword(email, currentPassword, newPassword);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: result.message,
        data: null
    });
}));
// Get all users
const getAllUsersFromDB = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield auth_service_1.AuthService.getAllUsers();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'All users retrieved successfully!',
        data: users,
    });
}));
// Update isBlocked status
const updateUserBlockedStatusFromDB = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, isBlocked } = req.body;
    if (!email) {
        return (0, sendResponse_1.sendResponse)(res, {
            statusCode: http_status_1.default.BAD_REQUEST,
            success: false,
            message: 'Email is required',
        });
    }
    yield auth_service_1.AuthService.updateUserBlockedStatus(email, isBlocked);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User block status updated successfully!',
    });
}));
exports.AuthController = {
    registerUser,
    loginUser,
    refreshToken,
    getSingleUserFromDB,
    resetPassword,
    updateUserNameFromDB,
    getAllUsersFromDB,
    updateUserBlockedStatusFromDB
};
