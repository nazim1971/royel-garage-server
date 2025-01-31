import { Router } from 'express';
import { AuthRoute } from '../modules/auth/auth.routes';
import { AdminRoute } from '../modules/admin/admin.routes';
import { orderRoutes } from '../modules/order/order.route';
import { bikeRoutes } from '../modules/bike/bike.route';

const router = Router();

// Define all module-specific routes
const moduleRoutes = [
  { path: '/products', route: bikeRoutes },
  { path: '/orders', route: orderRoutes },
  {
    path: '/auth',
    route: AuthRoute,
  },
  {
    path: '/admin',
    route: AdminRoute,
  },
];

// Register each module's routes
moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
