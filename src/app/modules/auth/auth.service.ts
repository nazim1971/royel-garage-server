import config from '../../config';
import { AppError } from '../../error/AppError';
import { TUser } from '../user/user.interface';
import { User } from '../user/user.model';
import { TLogin, TSingleUser } from './auth.interface';
import jwt, { JwtPayload } from 'jsonwebtoken';
import httpStatus from 'http-status';
import bcrypt from 'bcrypt';

const registerUserIntoDB = async (payload: TUser) => {
  const user = await User.isUserExists(payload?.email);
  if (user) {
    throw new AppError(httpStatus.CONFLICT, 'Customer Already Exist');
  }
  const data = await User.create(payload);

  const { _id, name, email, image } = data;

  const result = { _id, name, email, image };

  return result;
};

const loginUser = async (payload: TLogin) => {
  // checking if the user is exist
  const user = await User.validateUser(payload.email);

  // Check if the password matches
  const isPasswordMatch = await User.isPasswordMatched(
    payload?.password,
    user?.password,
  );
  if (!isPasswordMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
  }

  //create token and send to the client
  const jwtPayload = {
    email: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt, { expiresIn: '30d' });
  const refreshToken = jwt.sign(jwtPayload, config.jwtRef, {
    expiresIn: '365d',
  });

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string): Promise<{ token: string }> => {
  // * Verify and decode token
  const decoded = jwt.verify(token, config.jwtRef) as JwtPayload;

  // * Validate and extract user from DB.
  const user = await User.validateUser(decoded.email);

  // * Create token and send to the  client.
  const jwtPayload = {
    email: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(jwtPayload, config.jwt, { expiresIn: '30d' });

  return { token: accessToken };
};

const getSingleUser = async (email: string): Promise<TSingleUser> => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (user?.isBlocked) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is blocked');
  }

  return user;
};

const updateUserName = async (email: string, newName: string): Promise<TUser> => {
  // Find the user by email and update the name, returning the updated document
  const user = await User.findOneAndUpdate(
    { email },         // Query condition: find user by email
    { name: newName },
    { new: true }      // Ensure we get the updated user object back
  );

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (user.isBlocked) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is blocked');
  }

  return user;
};


export const changePassword  = async (email: string,currentPassword: string, newPassword: string) => {
  // Find the user
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }


  const userStatus = user?.isBlocked;
  // check if the user is already deleted
  if (userStatus === true) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked!!!');
  }
 
    // Verify current password
    const isPasswordCorrect = await User.isPasswordMatched(currentPassword, user.password);
    if (!isPasswordCorrect) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Current password is incorrect');
    }

    const newHashedPassword = await bcrypt.hash(newPassword, Number(config.slat));

    await User.findOneAndUpdate({ email }, { password: newHashedPassword });

  return { message: 'Password updated successfully' };
};


const getAllUsers = async (): Promise<TSingleUser[]> => {
  const users = await User.find();
  if (!users.length) {
    throw new AppError(httpStatus.NOT_FOUND, 'No users found');
  }
  return users.map((user) => ({
    name: user.name,
    email: user.email,
    isBlocked: user.isBlocked,
    role: user.role
  }));
};

// Update isBlocked field
const updateUserBlockedStatus = async (email: string, isBlocked: boolean): Promise<TSingleUser> => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (user.isBlocked && isBlocked) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User is already blocked');
  }
  
  const result = await User.findOneAndUpdate(
    { email },
    { isBlocked },
    { new: true }
  );

  return {
    name: result?.name,
    email: result?.email,
    isBlocked: result?.isBlocked,
  };
};

export const AuthService = { registerUserIntoDB, loginUser, refreshToken, getSingleUser, updateUserName ,changePassword, getAllUsers, updateUserBlockedStatus };
