'use client';
import React, { useState } from 'react';

const LearnPage = () => {
    const [isOpen, setIsOpen] = useState(true);

    const toggleSlider = () => setIsOpen(!isOpen);

    return (
        <div className="flex h-screen font-sans overflow-hidden">
            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white p-6 transition-transform duration-300 z-40 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <button
                    className="absolute top-4 right-4 text-white text-2xl"
                    onClick={toggleSlider}
                >
                    ×
                </button>
                <h2 className="text-xl font-bold mb-4">Sidebar</h2>
                <ul className="space-y-2">
                    <li className="hover:text-gray-400 cursor-pointer">Course 1</li>
                    <li className="hover:text-gray-400 cursor-pointer">Course 2</li>
                    <li className="hover:text-gray-400 cursor-pointer">Course 3</li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="flex-1 ml-0 sm:ml-0 transition-all duration-300">
                <div className="p-6">
                    <button
                        className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800 transition duration-200"
                        onClick={toggleSlider}
                    >
                        {isOpen ? 'Close Menu' : 'Open Menu'}
                    </button>
                    <main className="mt-6">
                        <h1 className="text-3xl font-bold mb-2">Learn</h1>
                        <p className="text-gray-700">Welcome to the learning page!</p>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default LearnPage;
