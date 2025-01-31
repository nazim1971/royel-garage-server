"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRoutes = void 0;
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("./order.controller");
const router = express_1.default.Router();
//All Order related routes
router.post('/', order_controller_1.orderController.createOrder);
router.get('/', order_controller_1.orderController.getAllOrder);
router.get("/:id", order_controller_1.orderController.getSingleOrder);
router.get("/user-order/:email", order_controller_1.orderController.getOrdersByEmail);
router.delete('/:id', order_controller_1.orderController.deleteOrder);
router.put('/:id', order_controller_1.orderController.updateOrder);
router.get('/revenue', order_controller_1.orderController.getTotalRevenueController);
exports.orderRoutes = router;
