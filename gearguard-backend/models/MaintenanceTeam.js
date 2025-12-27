const mongoose = require('mongoose');

const MaintenanceTeamSchema = new mongoose.Schema({
    name: { type: String, required: true },
    members: [{ type: String }] // User IDs or names describing technicians
}, { timestamps: true });

module.exports = mongoose.model('MaintenanceTeam', MaintenanceTeamSchema);
