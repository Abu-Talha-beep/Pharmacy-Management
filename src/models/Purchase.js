import mongoose from 'mongoose';

const PurchaseSchema = new mongoose.Schema({
    purchaseId: { type: String, required: true },
    supplier: { type: String, default: '' },
    items: [{ name: String, qty: Number, costPrice: Number }],
    total: { type: Number, default: 0 },
    date: { type: String, default: '' },
    status: { type: String, default: 'Pending' },
    paidAmount: { type: Number, default: 0 },
    paymentStatus: { type: String, default: 'Unpaid' },
}, { timestamps: true });

export default mongoose.models.Purchase || mongoose.model('Purchase', PurchaseSchema);
