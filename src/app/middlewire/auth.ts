import jwt, { JwtPayload } from 'jsonwebtoken';
import { TUserRole } from '../modules/user/user.interface';
import config from '../config';
import { User } from '../modules/user/user.model';
import { AppError } from '../error/AppError';
import httpStatus from 'http-status';
import { catchAsync } from '../utilities/catchAsync';

const auth = (...roles: TUserRole[]) => {
  return catchAsync(async (req, _res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    // checking if the token is missing
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED ,'You are not authorized!');
    }

    // checking if the given token is valid
    const decoded = jwt.verify(token, config.jwt) as JwtPayload;

    const { email, role } = decoded;

    await User.validateUser(email);

    if (roles && !roles.includes(role as TUserRole)) {
      throw new AppError( httpStatus.UNAUTHORIZED,'you are not authorized');
    }

    req.user = decoded;
    next();
  });
};

export default auth;
