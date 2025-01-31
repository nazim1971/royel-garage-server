import jwt from 'jsonwebtoken';
import { AppError } from '../../error/AppError';
import { TLogin } from '../auth/auth.interface';
import { User } from '../user/user.model';
import config from '../../config';
import { TUser } from '../user/user.interface';
import httpStatus from 'http-status';

const loginAdmin = async (payload: TLogin) => {
  const admin = await User.validateUser(payload.email);

  const isPasswordCorrect = await User.isPasswordMatched(
    payload?.password,
    admin?.password,
  );

  if (!isPasswordCorrect) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Your password in incorrect ');
  }

  const jwtPayload = {
    email: admin.email,
    role: admin.role,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt, { expiresIn: '10d' });

  const refreshToken = jwt.sign(jwtPayload, config.jwtRef, {
    expiresIn: '365d',
  });

  return {
    accessToken,
    refreshToken,
  };
};

const blockUser = async (id: string, payload: Pick<TUser, 'isBlocked'>) => {
  const user = await User.findById(id);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User is not found');
  }
  if (user?.isBlocked) {
    throw new AppError(httpStatus.NOT_FOUND, 'User is already blocked');
  }
  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};


export const AdminService = {
  loginAdmin,
  blockUser,
};
