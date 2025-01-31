import express from 'express';
import { BikeControllers } from './bike.controller';


const router = express.Router();

router.post('/', BikeControllers.createBike);
router.get('/', BikeControllers.getAllBike);
router.get('/:bikeId', BikeControllers.getSingleBike);
router.put('/:bikeId', BikeControllers.updateSingleBike);
router.delete('/:bikeId', BikeControllers.deleteSingleBike);

export const bikeRoutes = router;
