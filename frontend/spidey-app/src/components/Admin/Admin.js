import React from 'react';
import Header from '../Common/Header';
import Sidebar from '../Common/Sidebar';

const Admin = () => {
    return (
        <div className="flex flex-col h-screen bg-gradient-to-r from-gray-100 to-gray-300">
            <Header />
            <div className="flex flex-1 pt-16">
                <Sidebar />
                <main className="flex-1 p-8 bg-white shadow-lg rounded-lg overflow-y-auto ml-64">
                    <h2 className="text-4xl font-bold mb-6 text-gray-800">Welcome to the Admin Dashboard</h2>
                    {/* Add more admin content here */}
                
                </main>
            </div>
        </div>
    );
};

export default Admin;