import { NextFunction, Request, Response } from 'express';
import { bikeService } from './bike.service';

const createBike = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bikeInfo = req.body;
    const result = await bikeService.createBike(bikeInfo);
    return res.status(201).json({
      message: 'Bike created successfully',
      success: true,
      data: result,
    });
  } catch (err) {
    next(err)
  }
  
};

const getAllBike = async (req: Request, res: Response, next: NextFunction) => {
  
  try {
   
    const result = await bikeService.getAllBikeFromDB(req.query);
    // if(result.length === 0){
    // return  res.status(404).json({
    //     message: 'Not Bike Found',
    //     status: false,
    //     data: result,
    //   });
    // }
   return res.status(200).json({
      message: 'Bikes retrieved successfully',
      status: true,
      data: result,
    });
   

  } catch (err) {
    next(err)
  }
};

const getSingleBike = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bikeId } = req.params;

    const result = await bikeService.getSingleBikeFromDB(bikeId);
    if (!result) {
      return res.status(404).json({
        message: 'Bike not found',
        status: false,
        data: {},
      });
    }

  return  res.status(200).json({
      message: 'Bikes retrieved successfully',
      status: true,
      data: result,
    });
  } catch (err) {
    next(err)
  }
};

const updateSingleBike = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bikeId } = req.params;
    const updatedBikeData = req.body;
    if (updatedBikeData.quantity === 0) {
      updatedBikeData.inStock = false;
    } else{
      updatedBikeData.inStock = true;
    }

    const updatedBike = await bikeService.updateSingleBikeInfo(
      bikeId,
      updatedBikeData,
    );
    if (!updatedBike) {
      return res.status(404).json({
        message: 'Bike not found',
        success: false,
      });
    }
   return res.status(200).json({
      message: 'Bike updated successfully',
      success: true,
      data: updatedBike,
    });
  } catch (err) {
    next(err)
  }
};

const deleteSingleBike = async (req: Request, res: Response, next: NextFunction) => {
  try {
    //Received bike id as param
    const { bikeId } = req.params;

    const result = await bikeService.deleteSingleBikeFromDB(bikeId);

    if (!result) {
      return res.status(404).json({
        message: 'Bike not found',
        status: false,
        data: {},
      });
    }

  return  res.status(200).json({
      message: 'Bike deleted successfully',
      status: true,
      data: {},
    });
  } catch (err) {
    next(err)
  }
};

export const BikeControllers = {
  createBike,
  getAllBike,
  getSingleBike,
  updateSingleBike,
  deleteSingleBike,
};
