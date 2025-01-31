import { NextFunction, Request, Response } from 'express';
import { orderService } from './order.service';
import { Bike } from '../bike/bike.model';
import mongoose from 'mongoose';
import { checkBikeAvailability } from '../../utilities/order/checkBikeAbility';
import { User } from '../user/user.model';

// Make order 
const createOrder = async (req: Request, res: Response, next: NextFunction) => {
 

  try {
    const { email, product, quantity, totalPrice: orderTotalPrice } = req.body;

    //is user exist
    const userExists = await User.findOne({email});
    if (!userExists) {
      return res.status(404).json({ message: 'User not found', success: false });
    }
    
    // Check bike availability
    const availabilityError = await checkBikeAvailability(product, quantity);
    if (availabilityError) {
      return res
        .status(404)
        .json({ message: availabilityError, success: false });
    }

    const [bike] = await Bike.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(product) } },
      {
        $project: {
          price: 1,
          quantity: 1,
          isStock: 1,
          totalPrice: { $multiply: ['$price', quantity] },
        },
      },
    ]);

    const totalPrice = orderTotalPrice || bike.totalPrice;

    // Update bike quantity and stock status
    const updatedQuantity = bike.quantity - quantity;

    await Bike.updateOne(
      { _id: product },
      { $set: { quantity: updatedQuantity, inStock: updatedQuantity > 0 } },
    );

    const orderInfo = {email, product: bike._id, quantity, totalPrice };
    const result = await orderService.createOrder(orderInfo);

    return res.status(201).json({
      message: 'Order created successfully',
      success: true,
      data: result,
    });
  } catch (err) {
   next(err)
  }
};

// Get total revenue
const getTotalRevenueController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const totalRevenue = await orderService.getTotalRevenue(); 
    return res.status(200).json({
      message: 'Revenue calculated successfully',
      status: true,
      data: {
        totalRevenue, 
      },
    });
  } catch (err) {
    next(err)
   }
};

//Get All Order data
const getAllOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await orderService.getAllOrderFromDB();
    if (result.length === 0) {
      return res.status(404).json({
        message: 'Not Order Found',
        status: false,
        data: result,
      });
    }
    return res.status(200).json({
      message: 'Orders retrieved successfully',
      status: true,
      data: result,
    });
  } catch (err) {
    next(err)
   }
};

const deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params; // Extract order ID from the route parameter

    const result = await orderService.deleteOrderById(id);

    if (!result) {
      return res.status(404).json({
        message: 'Order not found',
        status: false,
      });
    }

    return res.status(200).json({
      message: 'Order deleted successfully',
      status: true,
    });
  } catch (err) {
    next(err);
  }
};

const updateOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params; // Extract order ID from the route parameter
    const { status, isCancel } = req.body; // Get status and isCancel from request body
    const userRole = req.user?.role; // Use req.user populated by auth middleware
    const userEmail = req.user?.email; // Use req.user populated by auth middleware

    // Fetch the order to verify ownership and role-based access
    const order = await orderService.getOrderById(id);

    if (!order) {
      return res.status(404).json({
        message: 'Order not found',
        status: false,
      });
    }

    const updateData: any = {};

    // Check if the status or isCancel fields are provided in the request body
    if (status) updateData.status = status;
    if (typeof isCancel !== 'undefined') updateData.isCancel = isCancel; // Check for boolean value explicitly

    // If no fields to update were provided, return an error
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        message: "No valid fields to update",
        status: false,
      });
    }

    // Update the order based on user role and access level
    if (userRole === 'customer') {
      // Allow customer to cancel their order, but not change status
      if (order?.email !== userEmail) {
        return res.status(403).json({
          message: "You can only cancel your own orders",
          status: false,
        });
      }

      if (typeof isCancel !== 'undefined') {
        updateData.isCancel = isCancel;
      } else {
        return res.status(403).json({
          message: "Customers cannot change the status",
          status: false,
        });
      }
    }

    // Admins can update both status and isCancel
    if (userRole === 'admin') {
      if (status) updateData.status = status;
      if (typeof isCancel !== 'undefined') updateData.isCancel = isCancel;
    }

    // Perform the update
    const updatedOrder = await orderService.updateOrderById(id, updateData);

    return res.status(200).json({
      message: 'Order updated successfully',
      status: true,
      data: updatedOrder,
    });
  } catch (err) {
    next(err);
  }
};




const getSingleOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params; // Extract order ID from the route parameter

    // Fetch the order by ID
    const order = await orderService.getOrderById(id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
        status: false,
      });
    }

    return res.status(200).json({
      message: "Order retrieved successfully",
      status: true,
      data: order,
    });
  } catch (err) {
    next(err); // Pass errors to the next middleware
  }
};




const getOrdersByEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userEmail = req.params?.email as string ; // Get the email from the authenticated user
    if (!userEmail) {
      return res.status(400).json({
        message: 'Email is required',
        status: false,
      });
    }

    // Call the service to get all orders by email
    const orders = await orderService.getAllOrdersByEmail(userEmail);

    // If no orders found, respond accordingly
    if (!orders || orders.length === 0) {
      return res.status(404).json({
        message: 'No orders found for this email',
        status: false,
      });
    }

    // Return the orders
    return res.status(200).json({
      message: 'Orders retrieved successfully',
      status: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};


export const orderController = {
  createOrder,
  getTotalRevenueController,
  getAllOrder,
  deleteOrder,
  updateOrder,
  getSingleOrder,
  getOrdersByEmail
};
