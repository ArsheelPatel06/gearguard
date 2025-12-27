import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Wrench, Calendar, Users, FileText } from 'lucide-react';

const Sidebar = () => {
    const navItems = [
        { name: 'Requests', path: '/', icon: LayoutDashboard },
        { name: 'Equipment', path: '/equipment', icon: Wrench },
        { name: 'Calendar', path: '/calendar', icon: Calendar },
        { name: 'Teams', path: '/teams', icon: Users },
        // { name: 'Reports', path: '/reports', icon: FileText },
    ];

    return (
        <div className="h-screen w-64 bg-sidebar flex flex-col items-center py-6 text-text-inverted shrink-0">
            {/* Logo area */}
            <div className="w-full px-6 mb-8">
                <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                    <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                        <Wrench size={18} className="text-white" />
                    </div>
                    <span>GearGuard</span>
                </div>
                <p className="text-xs text-text-muted mt-1 uppercase tracking-wider pl-10">Maintenance OS</p>
            </div>

            {/* Navigation */}
            <nav className="w-full flex-1 px-4 space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-2.5 rounded text-sm font-medium transition-colors duration-150 ${isActive
                                ? 'bg-primary text-white'
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            }`
                        }
                    >
                        <item.icon size={18} />
                        <span>{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            {/* User Profile Snippet (Bottom) */}
            <div className="w-full px-6 mt-auto">
                <div className="flex items-center gap-3 pt-6 border-t border-gray-700">
                    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-xs font-bold">
                        JD
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-medium truncate">John Doe</p>
                        <p className="text-xs text-gray-500 truncate">Tech Lead</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
