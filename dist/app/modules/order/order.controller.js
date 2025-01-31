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
exports.orderController = void 0;
const order_service_1 = require("./order.service");
const bike_model_1 = require("../bike/bike.model");
const mongoose_1 = __importDefault(require("mongoose"));
const checkBikeAbility_1 = require("../../utilities/order/checkBikeAbility");
// Make order 
const createOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, product, quantity, totalPrice: orderTotalPrice } = req.body;
        // Check bike availability
        const availabilityError = yield (0, checkBikeAbility_1.checkBikeAvailability)(product, quantity);
        if (availabilityError) {
            return res
                .status(404)
                .json({ message: availabilityError, success: false });
        }
        const [bike] = yield bike_model_1.Bike.aggregate([
            { $match: { _id: new mongoose_1.default.Types.ObjectId(product) } },
            {
                $project: {
                    price: 1,
                    quantity: 1,
                    isStock: 1,
                    totalPrice: { $multiply: ['$price', quantity] },
                },
            },
        ]);
        const totalPrice = orderTotalPrice || bike.totalPrice;
        // Update bike quantity and stock status
        const updatedQuantity = bike.quantity - quantity;
        yield bike_model_1.Bike.updateOne({ _id: product }, { $set: { quantity: updatedQuantity, inStock: updatedQuantity > 0 } });
        const orderInfo = { email, product: bike._id, quantity, totalPrice };
        const result = yield order_service_1.orderService.createOrder(orderInfo);
        return res.status(201).json({
            message: 'Order created successfully',
            success: true,
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
});
// Get total revenue
const getTotalRevenueController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalRevenue = yield order_service_1.orderService.getTotalRevenue();
        return res.status(200).json({
            message: 'Revenue calculated successfully',
            status: true,
            data: {
                totalRevenue,
            },
        });
    }
    catch (err) {
        next(err);
    }
});
//Get All Order data
const getAllOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield order_service_1.orderService.getAllOrderFromDB();
        if (result.length === 0) {
            return res.status(404).json({
                message: 'Not Order Found',
                status: false,
                data: result,
            });
        }
        return res.status(200).json({
            message: 'Orders retrieved successfully',
            status: true,
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.orderController = {
    createOrder,
    getTotalRevenueController,
    getAllOrder,
};
