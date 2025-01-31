import { model, Schema } from 'mongoose';
import { TUser, UserModel } from './user.interface';
import config from '../../config';
import bcrypt from 'bcrypt';
import { AppError } from '../../error/AppError';
import httpStatus from 'http-status';

const userSchema = new Schema<TUser, UserModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      select: false,
    },
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer',
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Hash Password before save in DB
userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, Number(config.slat));
  next();
});

// set '' after saving password
userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

// Static method to check if user exists
userSchema.statics.validateUser = async function (email?: string) {
  if (!email) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Please provide a valid email!');
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      `No user found with email: ${email}!`,
    );
  }

  if (user.isBlocked) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      `User with email ${email} is blocked!`,
    );
  }

  return user;
};

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword: string,
  hashedPassword: string,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

userSchema.statics.isUserExists = async function (payload: string) {
  // Check if the payload is an email
  if (payload.includes('@')) {
    return await User.findOne({ email: payload }).select('+password');
  } else {
    // Otherwise, treat it as an ID
    return await User.findById(payload).select('+password');
  }
};

export const User = model<TUser, UserModel>('User', userSchema);
