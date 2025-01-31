import { Response } from 'express';

export const sendResponse = <T>(
  res: Response,
  data: {
    success: boolean;
    message?: string;
    statusCode: number;
    data?: T;
  },
) => {
    res.status(data?.statusCode).json({
        success: data.success,
        message: data.message,
        statusCode: data.statusCode,
        data: data.data,
    })
};

