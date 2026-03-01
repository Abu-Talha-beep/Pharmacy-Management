import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { toJSON } from '@/lib/utils';

export async function GET() {
    await dbConnect();
    const users = await User.find({}).select('-password').lean();
    return NextResponse.json(toJSON(users));
}

export async function POST(req) {
    await dbConnect();
    const d = await req.json();
    const item = await User.create(d);
    return NextResponse.json(toJSON(item), { status: 201 });
}

export async function PUT(req) {
    await dbConnect();
    const { id, ...rest } = await req.json();
    const item = await User.findByIdAndUpdate(id, rest, { new: true });
    return NextResponse.json(toJSON(item));
}

export async function DELETE(req) {
    await dbConnect();
    const { id } = await req.json();
    await User.findByIdAndDelete(id);
    return NextResponse.json({ ok: true });
}
