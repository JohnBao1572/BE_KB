import mongoose, { Schema } from 'mongoose';
import { type } from 'os';

const scheme = new Schema({
	products: [],

	total: {
		required: true,
		type: Number,
	},

	status: {
		type: Number,
		default: 0,
	},

	customer_id: {
		type: String,
		required: true,
	},

	shippingAddress: {
		type: {
			name: String,
			phoneNumber: String,
			address: String,
		},
	},

	paymentStatus: {
		type: Number,
		default: 0,
	},

	paymentMethod: {
		type: String,
		default: 'cod',
	},

	createdAt: {
        type: Date,
        default: Date.now,
    },
	
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

const BillModel = mongoose.model('bills', scheme);
export default BillModel;