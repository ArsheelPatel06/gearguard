import React, { useState, useEffect } from 'react';
import client from '../api/client';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Equipment = () => {
    const [equipment, setEquipment] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        client.get('/equipment').then(res => setEquipment(res.data));
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Equipment Inventory</h2>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search assets..."
                        className="pl-9 pr-4 py-2 border border-gray-300 rounded text-sm focus:ring-primary focus:border-primary w-64"
                    />
                </div>
            </div>

            <div className="bg-white rounded border border-gray-200 shadow-sm overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {equipment.map((item) => (
                            <tr
                                key={item._id}
                                onClick={() => navigate(`/equipment/${item._id}`)}
                                className="hover:bg-gray-50 cursor-pointer transition-colors"
                            >
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{item.serialNumber}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.department}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.location}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {item.status.toUpperCase()}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Equipment;
