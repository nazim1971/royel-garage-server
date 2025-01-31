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
exports.bikeService = void 0;
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const bike_const_1 = require("./bike.const");
const bike_model_1 = require("./bike.model");
const createBike = (bikeData) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield bike_model_1.Bike.create(bikeData);
    return result;
});
const getAllBikeFromDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const productQuery = new QueryBuilder_1.default(bike_model_1.Bike.find(), payload)
        .search(bike_const_1.productSrcField)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield productQuery.modelQuery;
    const meta = yield productQuery.countTotal();
    return { meta, result };
});
const getSingleBikeFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield bike_model_1.Bike.findById({ _id: id });
    return result;
});
const updateSingleBikeInfo = (id, updatedData) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield bike_model_1.Bike.findByIdAndUpdate({ _id: id }, updatedData, {
        new: true,
        runValidators: true,
    });
    return result;
});
const deleteSingleBikeFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield bike_model_1.Bike.findOneAndDelete({ _id: id });
    return result;
});
exports.bikeService = {
    createBike,
    getAllBikeFromDB,
    getSingleBikeFromDB,
    updateSingleBikeInfo,
    deleteSingleBikeFromDB
};
