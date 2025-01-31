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
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderService = void 0;
const order_model_1 = require("./order.model");
const createOrder = (orderData) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_model_1.Order.create(orderData);
    return result;
});
// Calculate the total revenue
const getTotalRevenue = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_model_1.Order.aggregate([
        {
            $lookup: {
                from: 'bikes',
                localField: 'product',
                foreignField: '_id',
                as: 'bikeData',
            },
        },
        {
            $unwind: {
                path: '$bikeData',
                preserveNullAndEmptyArrays: false,
            },
        },
        {
            $addFields: {
                totalPrice: { $multiply: ['$bikeData.price', '$quantity'] },
            },
        },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: '$totalPrice' },
            },
        },
        {
            $project: {
                _id: 0,
                totalRevenue: 1,
            },
        },
    ]);
    const totalRevenue = result.length > 0 ? result[0].totalRevenue : 0;
    return totalRevenue;
});
const getAllOrderFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_model_1.Order.find().populate('product');
    return result;
});
const deleteOrderById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_model_1.Order.findByIdAndDelete(id);
    return result;
});
const updateOrderById = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_model_1.Order.findByIdAndUpdate(id, updateData, { new: true });
    return result;
});
const getOrderById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield order_model_1.Order.findById(id).populate('product'); // Fetch the order and populate the product
        return order;
    }
    catch (error) {
        throw new Error("Error fetching the order by ID");
    }
});
const getAllOrdersByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_model_1.Order.find({ email }).populate('product');
    return result;
});
exports.orderService = {
    createOrder,
    getTotalRevenue,
    getAllOrderFromDB,
    deleteOrderById,
    updateOrderById,
    getOrderById,
    getAllOrdersByEmail
};
