import mongoose from 'mongoose';

const PrescriptionSchema = new mongoose.Schema({
    prescriptionId: { type: String, required: true },
    customer: { type: String, default: '' },
    doctor: { type: String, default: '' },
    hospital: { type: String, default: '' },
    date: { type: String, default: '' },
    medicines: [{ type: String }],
    notes: { type: String, default: '' },
    linkedSale: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.models.Prescription || mongoose.model('Prescription', PrescriptionSchema);
