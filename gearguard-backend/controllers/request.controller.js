const MaintenanceRequest = require('../models/MaintenanceRequest');
const Equipment = require('../models/Equipment');
const { STAGES } = require('../utils/constants');

module.exports = {
    create: async (req, res) => {
        try {
            // Auto-Fill Logic: Fetch Equipment to get the correct Maintenance Team
            const equipment = await Equipment.findById(req.body.equipmentId);
            if (!equipment) {
                return res.status(404).json({ message: "Equipment not found" });
            }

            const requestData = {
                ...req.body,
                teamId: equipment.maintenanceTeamId, // Auto-assign team
                // If you had a defaultTechnicianId on the equipment, you would auto-assign it here:
                // assignedTo: equipment.defaultTechnicianId 
            };

            const newRequest = await MaintenanceRequest.create(requestData);
            res.status(201).json(newRequest);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Get all requests (support identifying "Overdue" or filtering by stage)
    getAll: async (req, res) => {
        try {
            const { stage, type, assignedTo } = req.query;
            let query = {};

            if (stage) query.stage = stage;
            if (type) query.type = type;
            if (assignedTo) query.assignedTo = assignedTo;

            const requests = await MaintenanceRequest.find(query)
                .populate('equipmentId')
                .populate('teamId')
                .sort({ createdAt: -1 });

            res.status(200).json(requests);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Get single request
    getById: async (req, res) => {
        try {
            const request = await MaintenanceRequest.findById(req.params.id)
                .populate('equipmentId')
                .populate('teamId');
            if (!request) return res.status(404).json({ message: 'Request not found' });
            res.status(200).json(request);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    // Update request (Handle State Moves and Scrap Logic)
    update: async (req, res) => {
        try {
            const updates = req.body;
            const requestId = req.params.id;

            // Update the request
            const updatedRequest = await MaintenanceRequest.findByIdAndUpdate(
                requestId,
                updates,
                { new: true, runValidators: true }
            );

            if (!updatedRequest) return res.status(404).json({ message: 'Request not found' });

            // Scrap Logic: If moved to scrap, update the equipment status
            if (updates.stage === STAGES.SCRAP) {
                await Equipment.findByIdAndUpdate(updatedRequest.equipmentId, {
                    status: 'scrapped'
                });
            }

            res.status(200).json(updatedRequest);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    // Delete request
    delete: async (req, res) => {
        try {
            const deletedRequest = await MaintenanceRequest.findByIdAndDelete(req.params.id);
            if (!deletedRequest) return res.status(404).json({ message: 'Request not found' });
            res.status(200).json({ message: 'Request deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};
