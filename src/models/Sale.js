import mongoose from 'mongoose';

const SaleSchema = new mongoose.Schema({
    saleId: { type: String, required: true },
    customer: { type: String, default: 'Walk-in' },
    customerId: { type: String, default: null },
    items: [{ name: String, qty: Number, price: Number }],
    subtotal: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    paymentMethod: { type: String, default: 'Cash' },
    date: { type: String, default: '' },
    status: { type: String, default: 'Completed' },
}, { timestamps: true });

export default mongoose.models.Sale || mongoose.model('Sale', SaleSchema);
