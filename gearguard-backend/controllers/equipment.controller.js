const Equipment = require('../models/Equipment');

module.exports = {
    // Create new equipment
    create: async (req, res) => {
        try {
            if (!req.body.name || !req.body.location) {
                return res.status(400).json({ message: "Equipment Name and Location are required" });
            }
            const newEquipment = await Equipment.create(req.body);
            res.status(201).json(newEquipment);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Get all equipment (with optional filtering)
    getAll: async (req, res) => {
        try {
            const { department, maintenanceTeamId } = req.query;
            let query = {};

            if (department) query.department = department;
            if (maintenanceTeamId) query.maintenanceTeamId = maintenanceTeamId;

            const equipment = await Equipment.find(query).populate('maintenanceTeamId');
            res.status(200).json(equipment);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get single equipment by ID
    getById: async (req, res) => {
        try {
            const equipment = await Equipment.findById(req.params.id).populate('maintenanceTeamId');
            if (!equipment) return res.status(404).json({ message: 'Equipment not found' });
            res.status(200).json(equipment);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Update equipment
    update: async (req, res) => {
        try {
            const updatedEquipment = await Equipment.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            );
            if (!updatedEquipment) return res.status(404).json({ message: 'Equipment not found' });
            res.status(200).json(updatedEquipment);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Delete equipment (or soft delete)
    delete: async (req, res) => {
        try {
            const deletedEquipment = await Equipment.findByIdAndDelete(req.params.id);
            if (!deletedEquipment) return res.status(404).json({ message: 'Equipment not found' });
            res.status(200).json({ message: 'Equipment deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get requests for specific equipment (Smart Button logic)
    getByEquipment: async (req, res) => {
        try {
            const requests = await require('../models/MaintenanceRequest').find({ equipmentId: req.params.id })
                .populate('teamId')
                .sort({ createdAt: -1 });
            res.status(200).json(requests);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};
