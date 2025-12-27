const mongoose = require('mongoose');

const MaintenanceRequestSchema = new mongoose.Schema({
    type: { type: String, enum: ['corrective', 'preventive'], required: true },
    subject: { type: String, required: true },
    description: { type: String },
    equipmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment', required: true },
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'MaintenanceTeam' },
    assignedTo: { type: String },
    stage: { type: String, enum: ['new', 'in_progress', 'repaired', 'scrap'], default: 'new' },
    scheduledDate: { type: Date },
    durationHours: { type: Number },
    createdBy: { type: String },
    aiSuggestion: { type: Object }, // Storing JSON object with detailed suggestion
    overdue: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('MaintenanceRequest', MaintenanceRequestSchema);
