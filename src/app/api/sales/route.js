import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Sale from '@/models/Sale';
import Product from '@/models/Product';
import Customer from '@/models/Customer';
import AuditLog from '@/models/AuditLog';
import { toJSON } from '@/lib/utils';

export async function GET() {
    await dbConnect();
    return NextResponse.json(toJSON(await Sale.find({}).lean()));
}

export async function POST(req) {
    await dbConnect();
    const data = await req.json();
    // Deduct stock for each item sold
    for (const item of data.items) {
        const product = await Product.findOne({ name: item.name });
        if (product) {
            let deductPacks;
            if (item.sellMode === 'tablet') {
                // Convert tablets sold to packs consumed (round up)
                const upp = item.unitsPerPack || product.unitsPerPack || 1;
                deductPacks = Math.ceil(item.qty / upp);
            } else {
                deductPacks = item.qty;
            }
            let newQty = Math.max(0, product.quantity - deductPacks);
            let status = newQty <= 0 ? 'Out of Stock' : newQty <= (product.minStock || 50) ? 'Low Stock' : 'In Stock';
            await Product.findByIdAndUpdate(product._id, { quantity: newQty, status });
        }
    }
    // Update customer stats
    if (data.customerId) {
        const customer = await Customer.findById(data.customerId);
        if (customer) {
            await Customer.findByIdAndUpdate(data.customerId, {
                totalOrders: (customer.totalOrders || 0) + 1,
                totalSpent: (customer.totalSpent || 0) + data.total,
                loyaltyPoints: (customer.loyaltyPoints || 0) + Math.floor(data.total)
            });
        }
    }
    const sale = await Sale.create(data);
    await AuditLog.create({ action: 'CREATE', entity: 'Sale', entityId: sale._id, details: `New sale: $${data.total} — ${data.items.length} items` });
    return NextResponse.json(toJSON(sale), { status: 201 });
}

export async function PUT(req) {
    await dbConnect();
    const { id, ...rest } = await req.json();
    // If returning a sale, restore stock
    if (rest.status === 'Returned') {
        const sale = await Sale.findById(id);
        if (sale && sale.status !== 'Returned') {
            for (const item of sale.items) {
                const product = await Product.findOne({ name: item.name });
                if (product) {
                    let newQty = product.quantity + item.qty;
                    let status = newQty <= 0 ? 'Out of Stock' : newQty <= (product.minStock || 50) ? 'Low Stock' : 'In Stock';
                    await Product.findByIdAndUpdate(product._id, { quantity: newQty, status });
                }
            }
            await AuditLog.create({ action: 'RETURN', entity: 'Sale', entityId: id, details: `Sale returned: $${sale.total}` });
        }
    }
    const item = await Sale.findByIdAndUpdate(id, rest, { new: true });
    return NextResponse.json(toJSON(item));
}
