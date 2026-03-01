import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    productId: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String, default: 'Others' },
    batchNo: { type: String, default: '' },
    quantity: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    costPrice: { type: Number, default: 0 },
    supplier: { type: String, default: '' },
    expiryDate: { type: String, default: '' },
    barcode: { type: String, default: '' },
    status: { type: String, default: 'In Stock' },
    minStock: { type: Number, default: 50 },
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
