import { Router } from 'express';
import { validateMiddlewire } from '../../middlewire/validateRequest';
import { UserValidation } from '../user/user.validation';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validate';

const router = Router();

router.post(
  '/register',
  validateMiddlewire(UserValidation.userCreationSchema),
  AuthController.registerUser,
);

router.post(
  '/login',
  validateMiddlewire(AuthValidation.loginValidationSchema),
  AuthController.loginUser,
);

router.get('/user/:email', AuthController.getSingleUserFromDB );

router.put('/user/:email', AuthController.updateUserNameFromDB)

router.put('/reset-password',  AuthController.resetPassword);

router.post('/refresh-token', AuthController.refreshToken);

router.get('/user', AuthController.getAllUsersFromDB);

router.patch('/user/block-status', AuthController.updateUserBlockedStatusFromDB);

export const AuthRoute = router;
