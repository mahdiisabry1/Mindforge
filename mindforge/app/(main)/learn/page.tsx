'use client';
import React, { useState } from 'react';

const LearnPage = () => {

    return (
        <div className="flex h-screen font-sans overflow-hidden">
            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full w-72 bg-gray-900 text-white p-6 z-40`}
            >
                <h2 className="text-4xl font-bold mb-8">MINDFORGE</h2>
                <ul className="space-y-2">
                    <li className="hover:text-gray-400 cursor-pointer">LEARN</li>
                    <li className="hover:text-gray-400 cursor-pointer">LEADERBOARD</li>
                    <li className="hover:text-gray-400 cursor-pointer">Quests</li>
                    <li className='hover:text-gray-400 cursor-pointer'>SHOP</li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="flex-1 ml-0 sm:ml-0">
                <div className="p-6">
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
