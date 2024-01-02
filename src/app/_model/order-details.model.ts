import { OrderQuantity } from './order-quentity.model';

export interface OrderDetails {
  fullName: string;
  fullAddress: string;
  contactNumber: string;
  alternateContactNumber: string;
  orderProductQuantityList: OrderQuantity[];
}
