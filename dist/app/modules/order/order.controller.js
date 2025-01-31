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
const user_model_1 = require("../user/user.model");
// Make order 
const createOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, product, quantity, totalPrice: orderTotalPrice } = req.body;
        //is user exist
        const userExists = yield user_model_1.User.findOne({ email });
        if (!userExists) {
            return res.status(404).json({ message: 'User not found', success: false });
        }
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
const deleteOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params; // Extract order ID from the route parameter
        const result = yield order_service_1.orderService.deleteOrderById(id);
        if (!result) {
            return res.status(404).json({
                message: 'Order not found',
                status: false,
            });
        }
        return res.status(200).json({
            message: 'Order deleted successfully',
            status: true,
        });
    }
    catch (err) {
        next(err);
    }
});
const updateOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { id } = req.params; // Extract order ID from the route parameter
        const { status, isCancel } = req.body; // Get status and isCancel from request body
        const userRole = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role; // Use req.user populated by auth middleware
        const userEmail = (_b = req.user) === null || _b === void 0 ? void 0 : _b.email; // Use req.user populated by auth middleware
        // Fetch the order to verify ownership and role-based access
        const order = yield order_service_1.orderService.getOrderById(id);
        if (!order) {
            return res.status(404).json({
                message: 'Order not found',
                status: false,
            });
        }
        const updateData = {};
        // Check if the status or isCancel fields are provided in the request body
        if (status)
            updateData.status = status;
        if (typeof isCancel !== 'undefined')
            updateData.isCancel = isCancel; // Check for boolean value explicitly
        // If no fields to update were provided, return an error
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                message: "No valid fields to update",
                status: false,
            });
        }
        // Update the order based on user role and access level
        if (userRole === 'customer') {
            // Allow customer to cancel their order, but not change status
            if ((order === null || order === void 0 ? void 0 : order.email) !== userEmail) {
                return res.status(403).json({
                    message: "You can only cancel your own orders",
                    status: false,
                });
            }
            if (typeof isCancel !== 'undefined') {
                updateData.isCancel = isCancel;
            }
            else {
                return res.status(403).json({
                    message: "Customers cannot change the status",
                    status: false,
                });
            }
        }
        // Admins can update both status and isCancel
        if (userRole === 'admin') {
            if (status)
                updateData.status = status;
            if (typeof isCancel !== 'undefined')
                updateData.isCancel = isCancel;
        }
        // Perform the update
        const updatedOrder = yield order_service_1.orderService.updateOrderById(id, updateData);
        return res.status(200).json({
            message: 'Order updated successfully',
            status: true,
            data: updatedOrder,
        });
    }
    catch (err) {
        next(err);
    }
});
const getSingleOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params; // Extract order ID from the route parameter
        // Fetch the order by ID
        const order = yield order_service_1.orderService.getOrderById(id);
        if (!order) {
            return res.status(404).json({
                message: "Order not found",
                status: false,
            });
        }
        return res.status(200).json({
            message: "Order retrieved successfully",
            status: true,
            data: order,
        });
    }
    catch (err) {
        next(err); // Pass errors to the next middleware
    }
});
const getOrdersByEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userEmail = (_a = req.params) === null || _a === void 0 ? void 0 : _a.email; // Get the email from the authenticated user
        if (!userEmail) {
            return res.status(400).json({
                message: 'Email is required',
                status: false,
            });
        }
        // Call the service to get all orders by email
        const orders = yield order_service_1.orderService.getAllOrdersByEmail(userEmail);
        // If no orders found, respond accordingly
        if (!orders || orders.length === 0) {
            return res.status(404).json({
                message: 'No orders found for this email',
                status: false,
            });
        }
        // Return the orders
        return res.status(200).json({
            message: 'Orders retrieved successfully',
            status: true,
            data: orders,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.orderController = {
    createOrder,
    getTotalRevenueController,
    getAllOrder,
    deleteOrder,
    updateOrder,
    getSingleOrder,
    getOrdersByEmail
};
