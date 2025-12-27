const MaintenanceTeam = require('../models/MaintenanceTeam');

module.exports = {
    create: async (req, res) => {
        try {
            const team = await MaintenanceTeam.create(req.body);
            res.status(201).json(team);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    getAll: async (req, res) => {
        try {
            const teams = await MaintenanceTeam.find();
            res.status(200).json(teams);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};
