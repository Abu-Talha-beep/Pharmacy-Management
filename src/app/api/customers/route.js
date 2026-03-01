import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Customer from '@/models/Customer';
import AuditLog from '@/models/AuditLog';
import { toJSON } from '@/lib/utils';

export async function GET() {
    await dbConnect();
    return NextResponse.json(toJSON(await Customer.find({}).lean()));
}

export async function POST(req) {
    await dbConnect();
    const d = await req.json();
    const item = await Customer.create(d);
    await AuditLog.create({ action: 'CREATE', entity: 'Customer', entityId: item._id, details: `Created customer: ${d.name}` });
    return NextResponse.json(toJSON(item), { status: 201 });
}

export async function PUT(req) {
    await dbConnect();
    const { id, ...rest } = await req.json();
    const item = await Customer.findByIdAndUpdate(id, rest, { new: true });
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    await AuditLog.create({ action: 'UPDATE', entity: 'Customer', entityId: id, details: `Updated customer: ${rest.name || id}` });
    return NextResponse.json(toJSON(item));
}

export async function DELETE(req) {
    await dbConnect();
    const { id } = await req.json();
    await Customer.findByIdAndDelete(id);
    await AuditLog.create({ action: 'DELETE', entity: 'Customer', entityId: id, details: 'Deleted customer' });
    return NextResponse.json({ ok: true });
}
