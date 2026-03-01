import mongoose from 'mongoose';

const AuditLogSchema = new mongoose.Schema({
    user: { type: String, default: 'Admin' },
    action: { type: String, required: true },
    entity: { type: String, default: '' },
    entityId: { type: String, default: '' },
    details: { type: String, default: '' },
    timestamp: { type: Date, default: Date.now },
}, { timestamps: false });

export default mongoose.models.AuditLog || mongoose.model('AuditLog', AuditLogSchema);
