"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoute = void 0;
const express_1 = require("express");
const user_constants_1 = require("../user/user.constants");
const auth_1 = __importDefault(require("../../middlewire/auth"));
const admin_controller_1 = require("./admin.controller");
exports.AdminRoute = (0, express_1.Router)();
exports.AdminRoute.post('/login', admin_controller_1.AdminController.loginAdmin);
exports.AdminRoute.patch('/users/:userId/block', (0, auth_1.default)(user_constants_1.USER_ROLE.ADMIN), admin_controller_1.AdminController.blockUser);
