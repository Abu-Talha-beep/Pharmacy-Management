import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Prescription from '@/models/Prescription';
import AuditLog from '@/models/AuditLog';
import { toJSON } from '@/lib/utils';

export async function GET() {
    await dbConnect();
    return NextResponse.json(toJSON(await Prescription.find({}).lean()));
}

export async function POST(req) {
    await dbConnect();
    const d = await req.json();
    const item = await Prescription.create(d);
    await AuditLog.create({ action: 'CREATE', entity: 'Prescription', entityId: item._id, details: `Prescription for ${d.customer}` });
    return NextResponse.json(toJSON(item), { status: 201 });
}

export async function PUT(req) {
    await dbConnect();
    const { id, ...rest } = await req.json();
    const item = await Prescription.findByIdAndUpdate(id, rest, { new: true });
    return NextResponse.json(toJSON(item));
}

export async function DELETE(req) {
    await dbConnect();
    const { id } = await req.json();
    await Prescription.findByIdAndDelete(id);
    await AuditLog.create({ action: 'DELETE', entity: 'Prescription', entityId: id, details: 'Deleted prescription' });
    return NextResponse.json({ ok: true });
}
