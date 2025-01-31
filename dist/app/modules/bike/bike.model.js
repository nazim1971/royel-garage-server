"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bike = exports.ValidationTypeError = void 0;
const mongoose_1 = require("mongoose");
class ValidationTypeError extends Error {
    constructor(errors) {
        super("Validation failed");
        this.name = "ValidationTypeError";
        this.errors = errors;
    }
}
exports.ValidationTypeError = ValidationTypeError;
// Updated validateType function that uses Mongoose's error details
function validateType(value, expectedType) {
    if (typeof value !== expectedType) {
        const error = {
            message: `Value must be a ${expectedType}`,
            path: '',
            value: value,
            kind: expectedType,
        };
        throw new ValidationTypeError(error);
    }
    return value;
}
const bikeSchema = new mongoose_1.Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Bike name is required'],
        set: (value) => validateType(value, 'string'),
    },
    brand: {
        type: String,
        trim: true,
        required: [true, 'Brand name is required'],
        set: (value) => validateType(value, 'string'),
    },
    model: {
        type: String,
        trim: true,
        required: [true, 'Model name is required'],
        set: (value) => validateType(value, 'string'),
    },
    image: {
        type: String,
        trim: true,
    },
    price: {
        type: Number,
        required: [true, 'Bike price is required'],
        min: [1, 'Bike price must be higher then 0'],
        max: [1000, 'Bike price can not more then 1000'],
    },
    category: {
        type: String,
        enum: ['Mountain', 'Road', 'Hybrid', 'Electric'],
        required: [true, 'Bike category is required'],
    },
    description: {
        type: String,
        required: [true, 'Bike description is required'],
        minlength: [10, 'Description must be at least 10 characters long'],
        set: (value) => validateType(value, 'string'),
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [0, 'Quantity cannot be negative'],
    },
    inStock: {
        type: Boolean,
        default: true,
        required: [true, 'Stock status is required'],
    },
}, {
    timestamps: true
});
exports.Bike = (0, mongoose_1.model)('bikes', bikeSchema);
