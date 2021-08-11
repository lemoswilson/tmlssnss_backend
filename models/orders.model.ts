import mongoose, { Document, Schema } from 'mongoose';
import { UserModel } from './user.model';

interface item {
	name: string,
	quantity: number,
	product_id: string,
	price: number,
	total: number,
}

export interface OrderBody {
	submitted_at: number,
	total_items: number,
	items: item[],
	orderRef: string,
	state: 'paid' | 'fullfiled' | 'delivered',

}

export interface Orders extends OrderBody {
	user: UserModel['_id'],
}

interface OrdersModel extends Orders, Document {}

const ItemsSchema: Schema = new Schema({
	name: { type: String, required: true },
	quantity: { type: Number, required: true },
	product_id: { type: String, required: true},
	price: { type: Number, required: true},
	total: { type: Number, required: true }
})

const OrdersSchema: Schema = new Schema({
	user: { type: Schema.Types.ObjectId, required: true },
	submitted_at: { type: Number, required: true },
	total_items: { type: Number, required: true },
	items: { type: [ItemsSchema], required: true },
	orderRef: { type: String, required: true},
	state: {type: String, required: true}
})

export default mongoose.model<OrdersModel>('OrdersModel', OrdersSchema);