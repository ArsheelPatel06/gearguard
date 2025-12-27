import React from 'react';
import Sidebar from './Sidebar';
import { Outlet, useLocation } from 'react-router-dom';

const Layout = () => {
    const location = useLocation();

    // Map routes to readable titles
    const getPageTitle = (pathname) => {
        switch (pathname) {
            case '/': return 'Maintenance Requests';
            case '/create-request': return 'Create Request';
            case '/equipment': return 'Equipment Inventory';
            case '/calendar': return 'Preventive Schedule';
            case '/teams': return 'Maintenance Teams';
            default: return 'GearGuard';
        }
    };

    return (
        <div className="flex h-screen bg-surface overflow-hidden">
            <Sidebar />

            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Bar */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
                    <h1 className="text-lg font-semibold text-text-main">
                        {getPageTitle(location.pathname)}
                    </h1>

                    <div className="flex items-center gap-4">
                        <span className="text-xs text-gray-400">v2.4.0</span>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-auto p-8">
                    <div className="max-w-7xl mx-auto h-full">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
