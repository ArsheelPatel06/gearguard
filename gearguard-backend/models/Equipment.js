const mongoose = require('mongoose');

const EquipmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    serialNumber: { type: String, unique: true, required: true },
    department: { type: String, required: true },
    assignedTo: { type: String }, // employee name or ID
    location: { type: String, required: true },
    maintenanceTeamId: { type: mongoose.Schema.Types.ObjectId, ref: 'MaintenanceTeam' },
    defaultTechnicianId: { type: String },
    purchaseDate: { type: Date },
    warrantyEnd: { type: Date },
    status: { type: String, enum: ['active', 'scrapped'], default: 'active' },
    notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Equipment', EquipmentSchema);
