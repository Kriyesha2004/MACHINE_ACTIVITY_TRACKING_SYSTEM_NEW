import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-linear-to-r from-slate-950 via-slate-900 to-slate-950 text-white py-8 border-t-4 border-purple-400 shadow-2xl">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h3 className="font-bold text-2xl bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">MATRIX System</h3>
            <p className="text-sm text-gray-400 mt-2">Machine Activity Tracking & Inspection Exchange</p>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-sm text-gray-400">© 2024 Naturub Accessories Bangladesh</p>
            <p className="text-xs text-gray-500 mt-1">Karanaphuli EPZ, Chittagong, Bangladesh</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
