import { Types } from "mongoose";


export type Torder = {
    email: string;
    product: Types.ObjectId;
    quantity: number;
    totalPrice: number;
    status?: 'Pending' | 'Processing' | 'Shipped' | 'Delivered';
    isCancel?: boolean;
  };
  