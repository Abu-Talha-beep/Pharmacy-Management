import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import AuditLog from '@/models/AuditLog';
import { toJSON } from '@/lib/utils';

export async function GET() {
    await dbConnect();
    const logs = await AuditLog.find({}).sort({ timestamp: -1 }).limit(500).lean();
    return NextResponse.json(toJSON(logs));
}
