import { Schema, model } from 'mongoose';
import { Torder } from './order.interface';

// Define the Order schema
const orderSchema = new Schema<Torder>(
  {
    email: {
      type: String,
      required: [true, 'Customer email is required'],
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address',
      ],
    },
    product: {
      type: Schema.Types.ObjectId,
      required: [true, 'Product (bike) is required'],
      ref: 'bikes'
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
    totalPrice:{
        type: Number,
      required: [true, 'Total Price is required'],
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered"],
      default: 'Pending',
    },
    isCancel: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  },
);

// Export the Order model
export const Order = model<Torder>('Orders', orderSchema);
