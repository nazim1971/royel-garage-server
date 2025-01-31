import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";
import { ValidationErrorResponse } from "./error.interface";
import { ValidationTypeError } from "../modules/bike/bike.model";


export const handleErrors = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction 
) => {
  // Check if the error is a Mongoose ValidationError
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      message: "Validation failed",
      success: false,
      error: {
        name: err.name,
        errors: err.errors, 
      },
      stack: err.stack, 
    } as ValidationErrorResponse); 
  }

    // Handle custom ValidationTypeError
    if (err instanceof ValidationTypeError) {
      return res.status(400).json({
        message: "Validation failed",
        success: false,
        error: {
          name: err.name,
          message: err.errors,
        },
        stack: err.stack,
      });
    }

  // If it's a different kind of known error, handle it
  if (err instanceof Error) {
    return res.status(500).json({
      message: "Something went wrong",
      success: false,
      error: err.message,
      stack: err.stack,
    });
    
  }
   // If error is of an unknown type, return generic server error
   return res.status(500).json({
    message: "An unknown error occurred",
    success: false,
    error: JSON.stringify(err),
  });

};
