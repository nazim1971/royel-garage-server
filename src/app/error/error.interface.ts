import mongoose from "mongoose";

export interface ValidationErrorResponse {
  message: string;
  success: boolean;
  error: {
    name: string;
    errors: Record<string, mongoose.Error.ValidatorError>;
  };
  stack?: string;
}