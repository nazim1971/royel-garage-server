"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleErrors = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bike_model_1 = require("../modules/bike/bike.model");
const handleErrors = (err, req, res, next) => {
    // Check if the error is a Mongoose ValidationError
    if (err instanceof mongoose_1.default.Error.ValidationError) {
        return res.status(400).json({
            message: "Validation failed",
            success: false,
            error: {
                name: err.name,
                errors: err.errors,
            },
            stack: err.stack,
        });
    }
    // Handle custom ValidationTypeError
    if (err instanceof bike_model_1.ValidationTypeError) {
        return res.status(400).json({
            message: "Validation failed",
            success: false,
            error: {
                name: err.name,
                message: err.errors,
            },
            stack: err.stack,
        });
    }
    // If it's a different kind of known error, handle it
    if (err instanceof Error) {
        return res.status(500).json({
            message: "Something went wrong",
            success: false,
            error: err.message,
            stack: err.stack,
        });
    }
    // If error is of an unknown type, return generic server error
    return res.status(500).json({
        message: "An unknown error occurred",
        success: false,
        error: JSON.stringify(err),
    });
};
exports.handleErrors = handleErrors;
