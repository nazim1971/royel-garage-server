
import { catchAsync } from '../../utilities/catchAsync';
import { sendResponse } from '../../utilities/sendResponse';
import { AdminService } from './admin.service';
import httpStatus from 'http-status';

const loginAdmin = catchAsync(async (req, res) => {
  const result = await AdminService.loginAdmin(req.body);
  const { refreshToken, accessToken } = result;
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
  });
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
  });

  const data = { token: accessToken };
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Admin login successfully!',
    data: data,
  });
});

const blockUser = catchAsync(async (req, res) => {
  await AdminService.blockUser(req.params.userId, req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User blocked successfully!',
  });
});



export const AdminController = {
  loginAdmin,
  blockUser
};
