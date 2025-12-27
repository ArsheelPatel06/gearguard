import React, { useState, useEffect } from 'react';
import client from '../api/client';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Calendar = () => {
    const [requests, setRequests] = useState([]);
    const navigate = useNavigate();
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        client.get('/request').then(res => {
            // Filter only preventive
            const preventive = res.data.filter(r => r.type === 'preventive');
            setRequests(preventive);
        });
    }, []);

    // Simple Calendar Logic
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const daysInMonth = getDaysInMonth(currentDate);
    const startDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const days = [];
    for (let i = 0; i < startDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);

    return (
        <div className="bg-white rounded border border-gray-200 shadow-sm p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <CalendarIcon className="text-primary" />
                    Preventive Schedule
                </h2>
                <div className="flex items-center gap-4">
                    <button className="p-1 hover:bg-gray-100 rounded">
                        <ChevronLeft size={20} />
                    </button>
                    <span className="font-semibold text-gray-700">
                        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </span>
                    <button className="p-1 hover:bg-gray-100 rounded">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200 flex-1">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d} className="bg-gray-50 p-2 text-center text-xs font-bold text-gray-500 uppercase">
                        {d}
                    </div>
                ))}

                {days.map((day, idx) => (
                    <div key={idx} className="bg-white p-2 min-h-[100px] hover:bg-gray-50 transition-colors relative group">
                        {day && (
                            <>
                                <span className="text-sm font-medium text-gray-400">{day}</span>
                                <div className="mt-1 space-y-1">
                                    {requests
                                        .filter(r => {
                                            const d = new Date(r.scheduledDate || r.createdAt);
                                            return d.getDate() === day && d.getMonth() === currentDate.getMonth();
                                        })
                                        .map(r => (
                                            <div
                                                key={r._id}
                                                onClick={() => navigate('/')} // Or specific detail
                                                className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded truncate cursor-pointer hover:bg-blue-200"
                                                title={r.subject}
                                            >
                                                {r.equipmentId?.name || 'Eq'}
                                            </div>
                                        ))
                                    }
                                </div>
                                {/* Add Button on Hover */}
                                <button
                                    onClick={() => navigate('/create-request')}
                                    className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 text-primary hover:bg-blue-50 p-1 rounded transition-opacity"
                                >
                                    +
                                </button>
                            </>
                        )}
                    </div>
                ))}
            </div>

            {requests.length === 0 && (
                <div className="text-center py-4 text-gray-400 text-sm">
                    No preventive tasks scheduled for this month.
                </div>
            )}
        </div>
    );
};

export default Calendar;
