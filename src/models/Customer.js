import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema({
    customerId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    totalOrders: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    creditBalance: { type: Number, default: 0 },
    loyaltyPoints: { type: Number, default: 0 },
    status: { type: String, default: 'Active' },
}, { timestamps: true });

export default mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);
