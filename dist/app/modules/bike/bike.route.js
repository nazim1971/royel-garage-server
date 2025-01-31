"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bikeRoutes = void 0;
const express_1 = __importDefault(require("express"));
const bike_controller_1 = require("./bike.controller");
const router = express_1.default.Router();
router.post('/api/products', bike_controller_1.BikeControllers.createBike);
router.get('/api/products', bike_controller_1.BikeControllers.getAllBike);
router.get('/api/products/:bikeId', bike_controller_1.BikeControllers.getSingleBike);
router.put('/api/products/:bikeId', bike_controller_1.BikeControllers.updateSingleBike);
router.delete('/api/products/:bikeId', bike_controller_1.BikeControllers.deleteSingleBike);
exports.bikeRoutes = router;
