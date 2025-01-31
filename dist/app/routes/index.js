"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = require("../modules/auth/auth.routes");
const admin_routes_1 = require("../modules/admin/admin.routes");
const order_route_1 = require("../modules/order/order.route");
const bike_route_1 = require("../modules/bike/bike.route");
const router = (0, express_1.Router)();
// Define all module-specific routes
const moduleRoutes = [
    { path: '/products', route: bike_route_1.bikeRoutes },
    { path: '/orders', route: order_route_1.orderRoutes },
    {
        path: '/auth',
        route: auth_routes_1.AuthRoute,
    },
    {
        path: '/admin',
        route: admin_routes_1.AdminRoute,
    },
];
// Register each module's routes
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
