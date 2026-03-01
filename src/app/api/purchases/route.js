import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Purchase from '@/models/Purchase';
import Product from '@/models/Product';
import AuditLog from '@/models/AuditLog';
import { toJSON } from '@/lib/utils';

export async function GET() {
    await dbConnect();
    return NextResponse.json(toJSON(await Purchase.find({}).lean()));
}

export async function POST(req) {
    await dbConnect();
    const data = await req.json();
    const purchase = await Purchase.create(data);
    await AuditLog.create({ action: 'CREATE', entity: 'Purchase', entityId: purchase._id, details: `Purchase order from ${data.supplier}: $${data.total}` });
    return NextResponse.json(toJSON(purchase), { status: 201 });
}

export async function PUT(req) {
    await dbConnect();
    const { id, ...rest } = await req.json();
    if (rest.status === 'Received') {
        const purchase = await Purchase.findById(id);
        if (purchase && purchase.status !== 'Received') {
            for (const item of purchase.items) {
                const product = await Product.findOne({ name: item.name });
                if (product) {
                    let newQty = product.quantity + item.qty;
                    let status = newQty <= 0 ? 'Out of Stock' : newQty <= (product.minStock || 50) ? 'Low Stock' : 'In Stock';
                    await Product.findByIdAndUpdate(product._id, { quantity: newQty, status });
                }
            }
            await AuditLog.create({ action: 'RECEIVE', entity: 'Purchase', entityId: id, details: 'Purchase received — stock updated' });
        }
    }
    const item = await Purchase.findByIdAndUpdate(id, rest, { new: true });
    return NextResponse.json(toJSON(item));
}
