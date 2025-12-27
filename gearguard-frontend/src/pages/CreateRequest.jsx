import React, { useState, useEffect } from 'react';
import client from '../api/client';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft, Loader2 } from 'lucide-react';

const CreateRequest = () => {
    const navigate = useNavigate();
    const [equipmentList, setEquipmentList] = useState([]);

    // Form State
    const [formData, setFormData] = useState({
        type: 'corrective',
        equipmentId: '',
        assignedTo: '',
        subject: '',
        description: '',
        scheduledDate: ''
    });

    // Computed / Fetched Data
    const [selectedEquipment, setSelectedEquipment] = useState(null);
    const [aiSuggestion, setAiSuggestion] = useState(null);
    const [loadingAI, setLoadingAI] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        client.get('/equipment').then(res => setEquipmentList(res.data));
    }, []);

    // Handle Equipment Selection -> Auto-fill logic
    const handleEquipmentChange = (e) => {
        const eqId = e.target.value;
        const eq = equipmentList.find(item => item._id === eqId);

        setSelectedEquipment(eq);
        if (eq) {
            setFormData(prev => ({
                ...prev,
                equipmentId: eqId,
                assignedTo: eq.defaultTechnicianId || 'Unassigned'
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                equipmentId: '',
                assignedTo: ''
            }));
        }
    };

    // AI Logic Trigger
    const handleDescriptionBlur = async () => {
        if (!formData.description || formData.description.length < 5) return;

        setLoadingAI(true);
        try {
            const res = await client.post('/ai/suggest', {
                subject: formData.subject,
                description: formData.description
            });
            setAiSuggestion(res.data);
        } catch (error) {
            console.error("AI Error", error);
        } finally {
            setLoadingAI(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await client.post('/request', {
                ...formData,
                aiSuggestion // Attach the AI wisdom
            });
            navigate('/');
        } catch (error) {
            alert('Error creating request');
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-card border border-gray-200 mt-6">
            <div className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-gray-700">
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-xl font-bold text-gray-900">Create Maintenance Request</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* 1. Type */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Request Type</label>
                    <div className="flex border rounded overflow-hidden">
                        <button
                            type="button"
                            className={`flex-1 py-2 text-sm font-medium transition-colors ${formData.type === 'corrective' ? 'bg-black text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                            onClick={() => setFormData({ ...formData, type: 'corrective' })}
                        >
                            Corrective (Breakdown)
                        </button>
                        <button
                            type="button"
                            className={`flex-1 py-2 text-sm font-medium transition-colors ${formData.type === 'preventive' ? 'bg-black text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                            onClick={() => setFormData({ ...formData, type: 'preventive' })}
                        >
                            Preventive (Checkup)
                        </button>
                    </div>
                </div>

                {/* 2. Equipment Selector */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Equipment</label>
                    <select
                        required
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary p-2 border"
                        value={formData.equipmentId}
                        onChange={handleEquipmentChange}
                    >
                        <option value="">Select Equipment...</option>
                        {equipmentList.map(eq => (
                            <option key={eq._id} value={eq._id}>{eq.name} - {eq.serialNumber}</option>
                        ))}
                    </select>
                </div>

                {/* Auto-filled Section */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded border border-gray-200">
                        <span className="text-xs text-gray-500 uppercase font-bold">Maint. Team</span>
                        <p className="font-medium text-gray-800">
                            {selectedEquipment?.maintenanceTeamId?.name || "—"}
                        </p>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Assigned Tech</label>
                        <input
                            type="text"
                            className="w-full border-gray-300 rounded shadow-sm text-sm p-1.5 border"
                            value={formData.assignedTo}
                            onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                        />
                    </div>
                </div>

                {/* Subject */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <input
                        required
                        type="text"
                        placeholder="e.g. Leaking oil from main valve"
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary p-2 border"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    />
                </div>

                {/* Description + AI Trigger */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <div className="relative">
                        <textarea
                            rows={4}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary p-2 border block"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            onBlur={handleDescriptionBlur}
                        />
                        {loadingAI && (
                            <div className="absolute right-2 bottom-2 text-xs text-blue-600 flex items-center gap-1 animate-pulse">
                                <Sparkles size={12} />
                                Analyzing...
                            </div>
                        )}
                    </div>
                </div>

                {/* AI Suggestion Panel */}
                {aiSuggestion && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 animate-fade-in">
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles size={16} className="text-blue-600" />
                            <h4 className="font-bold text-blue-900 text-sm">AI Copilot Analysis</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                                <span className="text-xs text-blue-500 font-bold uppercase">Probable Cause</span>
                                <p className="text-blue-900">{aiSuggestion.diagnosis}</p>
                            </div>
                            <div>
                                <span className="text-xs text-blue-500 font-bold uppercase">First Action</span>
                                <p className="text-blue-900">{aiSuggestion.action}</p>
                            </div>
                            <div>
                                <span className="text-xs text-blue-500 font-bold uppercase">Est. Time</span>
                                <p className="text-blue-900 font-mono">{aiSuggestion.estimatedTime}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Scheduled Date (Preventive Only) */}
                {formData.type === 'preventive' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Date</label>
                        <input
                            type="date"
                            className="w-full border-gray-300 rounded-md shadow-sm p-2 border"
                            value={formData.scheduledDate}
                            onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                        />
                    </div>
                )}

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="px-6 py-2 bg-primary hover:bg-primaryHover text-white rounded font-medium shadow-sm flex items-center gap-2 disabled:opacity-50"
                    >
                        {submitting && <Loader2 size={16} className="animate-spin" />}
                        Create Request
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateRequest;
