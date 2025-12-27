import React, { useState, useEffect } from 'react';
import client from '../api/client';
import { Plus, Clock, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const KanbanBoard = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const columns = [
        { id: 'new', title: 'New', color: 'bg-gray-200 border-gray-300' },
        { id: 'in_progress', title: 'In Progress', color: 'bg-blue-100 border-blue-200' },
        { id: 'repaired', title: 'Repaired', color: 'bg-green-100 border-green-200' },
        { id: 'scrap', title: 'Scrap', color: 'bg-red-100 border-red-200' }
    ];

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await client.get('/request');
            setRequests(res.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const handleDragStart = (e, id) => {
        e.dataTransfer.setData('requestId', id);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = async (e, stage) => {
        const id = e.dataTransfer.getData('requestId');
        // Optimistic update
        const updatedRequests = requests.map(req =>
            req._id === id ? { ...req, stage } : req
        );
        setRequests(updatedRequests);

        // API Call
        try {
            await client.put(`/request/${id}`, { stage });
        } catch (error) {
            console.error("Failed to update stage", error);
            fetchRequests(); // Revert on failure
        }
    };

    // Calculate time difference for "Time Indicator"
    const getTimeIndicator = (date) => {
        const now = new Date();
        const created = new Date(date);
        const diffHours = Math.floor((now - created) / (1000 * 60 * 60));

        if (diffHours < 24) return `${diffHours}h ago`;
        return `${Math.floor(diffHours / 24)}d ago`;
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-text-main">Maintenance Board</h2>
                <button
                    onClick={() => navigate('/create-request')}
                    className="bg-primary hover:bg-primaryHover text-white px-4 py-2 rounded text-sm font-medium flex items-center gap-2 transition-colors"
                >
                    <Plus size={16} />
                    New Request
                </button>
            </div>

            <div className="flex-1 flex gap-4 overflow-x-auto pb-4">
                {columns.map(col => (
                    <div
                        key={col.id}
                        className="flex-1 min-w-[280px] bg-slate-100 rounded-lg p-3 flex flex-col border border-slate-200"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, col.id)}
                    >
                        <div className="flex justify-between items-center mb-3 px-1">
                            <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
                                {col.title}
                            </h3>
                            <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full font-bold">
                                {requests.filter(r => r.stage === col.id).length}
                            </span>
                        </div>

                        <div className="flex-1 space-y-3 overflow-y-auto">
                            {requests
                                .filter(req => req.stage === col.id)
                                .map(req => (
                                    <div
                                        key={req._id}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, req._id)}
                                        className={`bg-white p-3 rounded border shadow-sm cursor-move hover:shadow-md transition-shadow ${req.overdue ? 'border-l-4 border-l-status-overdue' : 'border-l-4 border-l-gray-300'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-bold text-gray-800 text-sm">
                                                {req.equipmentId?.name || 'Unknown Equipment'}
                                            </span>
                                            {req.overdue && <AlertCircle size={14} className="text-status-overdue" />}
                                        </div>

                                        <p className="text-xs text-gray-500 mb-2 truncate">
                                            {req.equipmentId?.location || 'No Loc'}
                                        </p>

                                        <p className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 leading-tight">
                                            {req.subject}
                                        </p>

                                        {req.aiSuggestion && req.aiSuggestion.diagnosis && (
                                            <div className="bg-blue-50 text-blue-700 text-xs p-1.5 rounded mb-2 italic border border-blue-100">
                                                AI: {req.aiSuggestion.diagnosis}
                                            </div>
                                        )}

                                        <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100">
                                            <div className="flex items-center gap-1 text-xs text-gray-400">
                                                <Clock size={12} />
                                                <span>{getTimeIndicator(req.createdAt)}</span>
                                            </div>

                                            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600 ring-2 ring-white">
                                                {req.assignedTo ? req.assignedTo.charAt(0) : '?'}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                            {requests.filter(r => r.stage === col.id).length === 0 && (
                                <div className="h-24 border-2 border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400 text-sm">
                                    Drop items here
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default KanbanBoard;
