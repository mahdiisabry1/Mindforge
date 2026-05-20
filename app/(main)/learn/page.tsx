"use client";
import React from "react";

const LearnPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Learn with MindForge</h1>
      <p className="text-lg text-gray-700 mb-8">
        Explore our resources to enhance your knowledge and skills.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Example resource cards */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Resource Title 1</h2>
          <p className="text-gray-600">Brief description of the resource.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Resource Title 2</h2>
          <p className="text-gray-600">Brief description of the resource.</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Resource Title 3</h2>
          <p className="text-gray-600">Brief description of the resource.</p>
        </div>
      </div>
    </div>
  );
};

export default LearnPage;
