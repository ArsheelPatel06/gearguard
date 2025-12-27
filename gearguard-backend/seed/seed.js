const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Equipment = require('../models/Equipment');
const MaintenanceTeam = require('../models/MaintenanceTeam');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        // Clear existing data
        await Equipment.deleteMany({});
        await MaintenanceTeam.deleteMany({});

        // Create Teams
        const mechanics = await MaintenanceTeam.create({ name: 'Mechanics', members: [] });
        const itSupport = await MaintenanceTeam.create({ name: 'IT Support', members: [] });

        // Create Equipment
        await Equipment.create([
            {
                name: 'CNC Machine 01',
                serialNumber: 'CNC-001',
                department: 'Production',
                location: 'Floor 1',
                maintenanceTeamId: mechanics._id,
                status: 'active'
            },
            {
                name: 'Office Printer',
                serialNumber: 'PRT-999',
                department: 'Admin',
                location: 'Office 202',
                maintenanceTeamId: itSupport._id,
                status: 'active'
            }
        ]);

        console.log('Data Seeded Successfully');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
