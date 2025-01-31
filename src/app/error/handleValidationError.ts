import mongoose from 'mongoose';
import { TErrorSources, TGenericErrorResponse } from '../interface/error';



const handleValidationError = (err: mongoose.Error.ValidationError): TGenericErrorResponse => {
  const error: TErrorSources = Object.values(err.errors).map(
    (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      // Updated types
      return {
        path: val?.path,
        message: val?.message,
      };
    },
  );

 
  const statusCode = 400;

  return {
    statusCode,
    message: 'validation Error',
    error,
  }; // Return the array of error sources
};

export default handleValidationError;
