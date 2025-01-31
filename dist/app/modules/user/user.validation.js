"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidation = void 0;
const zod_1 = require("zod");
const userCreationSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .trim()
        .min(2)
        .max(20),
    email: zod_1.z.string().email(),
    password: zod_1.z
        .string()
        .trim()
        .min(6, { message: 'Password must be at least 6 characters long!' })
        .max(20, { message: 'Password cannot be more than 20 characters!' }),
    role: zod_1.z.enum(['customer', 'admin']).default('customer'),
    isBlocked: zod_1.z.boolean().optional().default(false),
});
/** User Validation Schema */
exports.UserValidation = { userCreationSchema };
