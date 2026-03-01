import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import AuditLog from '@/models/AuditLog';
import { toJSON } from '@/lib/utils';

export async function GET() {
    await dbConnect();
    const products = await Product.find({}).lean();
    return NextResponse.json(toJSON(products));
}

export async function POST(req) {
    await dbConnect();
    const data = await req.json();
    if (data.quantity !== undefined) {
        if (data.quantity <= 0) data.status = 'Out of Stock';
        else if (data.quantity <= (data.minStock || 50)) data.status = 'Low Stock';
        else data.status = 'In Stock';
    }
    const product = await Product.create(data);
    await AuditLog.create({ action: 'CREATE', entity: 'Product', entityId: product._id, details: `Created product: ${data.name}` });
    return NextResponse.json(toJSON(product), { status: 201 });
}

export async function PUT(req) {
    await dbConnect();
    const data = await req.json();
    const { id, ...rest } = data;
    if (rest.quantity !== undefined) {
        if (rest.quantity <= 0) rest.status = 'Out of Stock';
        else if (rest.quantity <= (rest.minStock || 50)) rest.status = 'Low Stock';
        else rest.status = 'In Stock';
    }
    const product = await Product.findByIdAndUpdate(id, rest, { new: true });
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    await AuditLog.create({ action: 'UPDATE', entity: 'Product', entityId: id, details: `Updated product: ${rest.name || id}` });
    return NextResponse.json(toJSON(product));
}

export async function DELETE(req) {
    await dbConnect();
    const { id } = await req.json();
    const result = await Product.findByIdAndDelete(id);
    if (result) await AuditLog.create({ action: 'DELETE', entity: 'Product', entityId: id, details: `Deleted product: ${result.name}` });
    return NextResponse.json({ ok: !!result });
}
