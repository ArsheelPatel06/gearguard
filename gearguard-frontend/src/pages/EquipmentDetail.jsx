import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import client from '../api/client';
import { ArrowLeft, History, AlertTriangle, CheckCircle, XCircle, Wrench } from 'lucide-react';

const EquipmentDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [equipment, setEquipment] = useState(null);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        // Fetch Details
        client.get(`/equipment/${id}`).then(res => setEquipment(res.data));
        // Fetch History (Smart Logic)
        client.get(`/equipment/${id}/requests`).then(res => setHistory(res.data));
    }, [id]);

    if (!equipment) return <div>Loading...</div>;

    const isScrapped = equipment.status === 'scrapped';

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate('/equipment')} className="text-gray-400 hover:text-gray-700">
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-xl font-bold text-gray-900">{equipment.name}</h1>
                <span className={`px-2 py-0.5 text-xs font-bold rounded-full uppercase ${isScrapped ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                    {equipment.status}
                </span>
            </div>

            {isScrapped && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 flex items-center gap-3">
                    <AlertTriangle className="text-red-600" />
                    <div>
                        <h3 className="text-sm font-bold text-red-800">Assets Scrapped</h3>
                        <p className="text-sm text-red-700">This equipment is no longer operational. New requests are disabled.</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Col: Info */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded border border-gray-200 shadow-sm">
                        <h3 className="font-bold text-gray-900 mb-4 border-b pb-2">Asset Details</h3>
                        <div className="space-y-4 text-sm">
                            <div>
                                <span className="block text-gray-500 text-xs uppercase">Serial Number</span>
                                <span className="font-mono text-gray-800">{equipment.serialNumber}</span>
                            </div>
                            <div>
                                <span className="block text-gray-500 text-xs uppercase">Location</span>
                                <span className="text-gray-800">{equipment.location}</span>
                            </div>
                            <div>
                                <span className="block text-gray-500 text-xs uppercase">Department</span>
                                <span className="text-gray-800">{equipment.department}</span>
                            </div>
                            <div>
                                <span className="block text-gray-500 text-xs uppercase">Warranty End</span>
                                <span className="text-gray-800">{equipment.warrantyEnd ? new Date(equipment.warrantyEnd).toLocaleDateString() : 'N/A'}</span>
                            </div>
                        </div>

                        {!isScrapped && (
                            <button
                                onClick={() => navigate('/create-request')}
                                className="w-full mt-6 bg-primary hover:bg-primaryHover text-white py-2 rounded text-sm font-medium flex items-center justify-center gap-2"
                            >
                                <Wrench size={16} />
                                Create Request
                            </button>
                        )}
                    </div>
                </div>

                {/* Right Col: Timeline */}
                <div className="lg:col-span-2">
                    <div className="bg-white p-6 rounded border border-gray-200 shadow-sm">
                        <div className="flex justify-between items-center mb-6 border-b pb-2">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <History size={18} className="text-gray-400" />
                                Maintenance History
                            </h3>
                            <span className="text-xs text-gray-500">{history.length} Records</span>
                        </div>

                        <div className="space-y-6">
                            {history.length === 0 && <p className="text-gray-400 text-sm">No history available.</p>}

                            {history.map((req, i) => (
                                <div key={req._id} className="relative pl-6 border-l-2 border-gray-200 pb-6 last:pb-0 last:border-0">
                                    <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white ${req.stage === 'repaired' ? 'bg-green-500' :
                                            req.stage === 'scrap' ? 'bg-red-500' : 'bg-blue-500'
                                        }`}></div>

                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-bold text-sm text-gray-900">{req.subject}</p>
                                            <p className="text-xs text-gray-500">{new Date(req.createdAt).toLocaleDateString()} • {req.type}</p>
                                        </div>
                                        <span className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                                            {req.stage.toUpperCase()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">{req.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EquipmentDetail;
