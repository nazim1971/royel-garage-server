import { Torder } from './order.interface';
import { Order } from './order.model';

const createOrder = async (orderData: Torder) => {
  const result = await Order.create(orderData);
  return result;
};

// Calculate the total revenue
const getTotalRevenue = async () => {
  const result = await Order.aggregate([
    {
      $lookup: {
        from: 'bikes', 
        localField: 'product', 
        foreignField: '_id', 
        as: 'bikeData', 
      },
    },
    {
      $unwind: {
        path: '$bikeData',
        preserveNullAndEmptyArrays: false, 
      },
    },
    {
      $addFields: {
        totalPrice: { $multiply: ['$bikeData.price', '$quantity'] }, 
      },
    },
    {
      $group: {
        _id: null, 
        totalRevenue: { $sum: '$totalPrice' }, 
      },
    },
    {
      $project: {
        _id: 0, 
        totalRevenue: 1,
      },
    },
  ]);

  const totalRevenue = result.length > 0 ? result[0].totalRevenue : 0;
  return totalRevenue;
};

const getAllOrderFromDB = async () => {
  const result = await Order.find().populate('product');
    return result;
};

const deleteOrderById = async (id: string) => {
  const result = await Order.findByIdAndDelete(id);
  return result;
};

const updateOrderById = async (id: string, updateData: { status?: string, isCancel?: boolean }) => {
  const result = await Order.findByIdAndUpdate( id , updateData, { new: true });
  return result;
};

const getOrderById = async (id: string) => {
  try {
    const order = await Order.findById(id).populate('product'); // Fetch the order and populate the product
    return order;
  } catch (error) {
    throw new Error("Error fetching the order by ID");
  }
};

const getAllOrdersByEmail = async (email: string) => {
  const result = await Order.find({ email }).populate('product');
  return result;
};


export const orderService = {
  createOrder,
  getTotalRevenue,
  getAllOrderFromDB,
  deleteOrderById,
  updateOrderById,
  getOrderById,
  getAllOrdersByEmail
};
