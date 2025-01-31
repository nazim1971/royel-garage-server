"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
const zod_1 = require("zod");
const loginValidationSchema = zod_1.z.object({
    email: zod_1.z.string().trim().email(),
    password: zod_1.z
        .string()
        .trim()
        .min(6, { message: 'Password must be at least 6 characters long!' })
        .max(20, { message: 'Password cannot be more than 20 characters!' }),
});
const refreshTokenValidationSchema = zod_1.z.object({
    refreshToken: zod_1.z.string({
        required_error: 'Refresh token is required!',
    }),
});
exports.AuthValidation = {
    loginValidationSchema,
    refreshTokenValidationSchema,
};
