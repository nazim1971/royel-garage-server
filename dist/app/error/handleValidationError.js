"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleValidationError = (err) => {
    const error = Object.values(err.errors).map((val) => {
        // Updated types
        return {
            path: val === null || val === void 0 ? void 0 : val.path,
            message: val === null || val === void 0 ? void 0 : val.message,
        };
    });
    const statusCode = 400;
    return {
        statusCode,
        message: 'validation Error',
        error,
    }; // Return the array of error sources
};
exports.default = handleValidationError;
