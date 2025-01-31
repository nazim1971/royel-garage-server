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
exports.checkBikeAvailability = void 0;
const bike_model_1 = require("../../modules/bike/bike.model");
const checkBikeAvailability = (productId, quantity) => __awaiter(void 0, void 0, void 0, function* () {
    const bike = yield bike_model_1.Bike.findOne({ _id: productId });
    if (!bike)
        return 'The bike does not exist.';
    if (!bike.inStock)
        return 'The bike is out of stock.';
    if (bike.quantity < quantity)
        return `Insufficient stock. Only ${bike.quantity} items are available.`;
    return null;
});
exports.checkBikeAvailability = checkBikeAvailability;
