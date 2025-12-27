import React, { useState, useEffect } from 'react';
import client from '../api/client';
import { Users } from 'lucide-react';

const Teams = () => {
    const [teams, setTeams] = useState([]);

    useEffect(() => {
        client.get('/teams').then(res => setTeams(res.data));
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map(team => (
                <div key={team._id} className="bg-white rounded border border-gray-200 shadow-sm p-6">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded flex items-center justify-center">
                                <Users size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">{team.name}</h3>
                                <p className="text-xs text-gray-500">{team.members.length} Members</p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4">
                        <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Technicians</h4>
                        <div className="flex flex-wrap gap-2">
                            {team.members.map((member, i) => (
                                <span key={i} className="inline-flex items-center px-2 py-1 rounded bg-gray-50 text-gray-600 text-xs font-medium border border-gray-200">
                                    {member}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            ))}

            {teams.length === 0 && (
                <div className="col-span-full text-center py-12 bg-gray-50 rounded border border-dashed border-gray-300">
                    <p className="text-gray-500">No maintenance teams found.</p>
                </div>
            )}
        </div>
    );
};

export default Teams;
