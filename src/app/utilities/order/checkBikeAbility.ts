import { Bike } from "../../modules/bike/bike.model";

export const checkBikeAvailability = async (productId: string, quantity: number) => {
    const bike = await Bike.findOne({ _id: productId });
  
    if (!bike) return 'The bike does not exist.';
    if (!bike.inStock) return 'The bike is out of stock.';
    if (bike.quantity < quantity) 
      return `Insufficient stock. Only ${bike.quantity} items are available.`;
  
    return null; 
  };