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
exports.User = void 0;
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../../config"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const AppError_1 = require("../../error/AppError");
const http_status_1 = __importDefault(require("http-status"));
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        select: false,
    },
    image: {
        type: String,
        trim: true,
    },
    role: {
        type: String,
        enum: ['customer', 'admin'],
        default: 'customer',
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
    versionKey: false,
});
// Hash Password before save in DB
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        this.password = yield bcrypt_1.default.hash(this.password, Number(config_1.default.slat));
        next();
    });
});
// set '' after saving password
userSchema.post('save', function (doc, next) {
    doc.password = '';
    next();
});
// Static method to check if user exists
userSchema.statics.validateUser = function (email) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!email) {
            throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Please provide a valid email!');
        }
        const user = yield exports.User.findOne({ email }).select('+password');
        if (!user) {
            throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, `No user found with email: ${email}!`);
        }
        if (user.isBlocked) {
            throw new AppError_1.AppError(http_status_1.default.FORBIDDEN, `User with email ${email} is blocked!`);
        }
        return user;
    });
};
userSchema.statics.isPasswordMatched = function (plainTextPassword, hashedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(plainTextPassword, hashedPassword);
    });
};
userSchema.statics.isUserExists = function (payload) {
    return __awaiter(this, void 0, void 0, function* () {
        // Check if the payload is an email
        if (payload.includes('@')) {
            return yield exports.User.findOne({ email: payload }).select('+password');
        }
        else {
            // Otherwise, treat it as an ID
            return yield exports.User.findById(payload).select('+password');
        }
    });
};
exports.User = (0, mongoose_1.model)('User', userSchema);
