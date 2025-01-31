import { Router } from 'express';
import { USER_ROLE } from '../user/user.constants';
import auth from '../../middlewire/auth';
import { AdminController } from './admin.controller';

export const AdminRoute = Router();

AdminRoute.post('/login', AdminController.loginAdmin);

AdminRoute.patch(
  '/users/:userId/block',
  auth(USER_ROLE.ADMIN),
  AdminController.blockUser,
);

