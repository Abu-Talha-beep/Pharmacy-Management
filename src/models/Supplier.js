import mongoose from 'mongoose';

const SupplierSchema = new mongoose.Schema({
    supplierId: { type: String, required: true },
    name: { type: String, required: true },
    contact: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    address: { type: String, default: '' },
    totalOrders: { type: Number, default: 0 },
    totalPaid: { type: Number, default: 0 },
    outstanding: { type: Number, default: 0 },
    status: { type: String, default: 'Active' },
}, { timestamps: true });

export default mongoose.models.Supplier || mongoose.model('Supplier', SupplierSchema);
