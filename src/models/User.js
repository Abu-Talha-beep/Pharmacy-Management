import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, default: '' },
    name: { type: String, default: '' },
    role: { type: String, default: 'Pharmacist' },
    email: { type: String, default: '' },
    status: { type: String, default: 'Active' },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
