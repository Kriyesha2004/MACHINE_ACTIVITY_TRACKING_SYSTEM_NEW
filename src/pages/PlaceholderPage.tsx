import React from 'react';

const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8 max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">{title}</h1>
          <p className="text-gray-400">This page will be implemented soon</p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl p-12 text-center">
          <div className="text-6xl mb-4">🔨</div>
          <p className="text-gray-400 text-lg">Coming Soon</p>
          <p className="text-gray-500 text-sm mt-2">This feature is under development</p>
        </div>
      </div>
    </div>
  );
};

export default PlaceholderPage;

