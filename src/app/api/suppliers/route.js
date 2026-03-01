import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Supplier from '@/models/Supplier';
import AuditLog from '@/models/AuditLog';
import { toJSON } from '@/lib/utils';

export async function GET() {
    await dbConnect();
    return NextResponse.json(toJSON(await Supplier.find({}).lean()));
}

export async function POST(req) {
    await dbConnect();
    const d = await req.json();
    const item = await Supplier.create(d);
    await AuditLog.create({ action: 'CREATE', entity: 'Supplier', entityId: item._id, details: `Created supplier: ${d.name}` });
    return NextResponse.json(toJSON(item), { status: 201 });
}

export async function PUT(req) {
    await dbConnect();
    const { id, ...rest } = await req.json();
    const item = await Supplier.findByIdAndUpdate(id, rest, { new: true });
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    await AuditLog.create({ action: 'UPDATE', entity: 'Supplier', entityId: id, details: `Updated supplier` });
    return NextResponse.json(toJSON(item));
}

export async function DELETE(req) {
    await dbConnect();
    const { id } = await req.json();
    await Supplier.findByIdAndDelete(id);
    await AuditLog.create({ action: 'DELETE', entity: 'Supplier', entityId: id, details: 'Deleted supplier' });
    return NextResponse.json({ ok: true });
}
