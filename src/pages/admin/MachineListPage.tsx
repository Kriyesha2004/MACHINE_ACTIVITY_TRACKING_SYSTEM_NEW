import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Monitor, MapPin, Clock } from 'lucide-react';
import { PageHeader } from '../../components/shared';

interface Machine {
    _id: string;
    name: string;
    model: string;
    location: string;
    serialNumber: string;
    purchaseDate: string;
    status: 'active' | 'inactive' | 'maintenance';
    imagePath?: string;
    lastMaintenance?: string;
}

export const MachineListPage: React.FC = () => {
    const navigate = useNavigate();
    const [machines, setMachines] = useState<Machine[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchMachines();
    }, []);

    const fetchMachines = async () => {
        try {
            const res = await fetch('http://localhost:3000/machines');
            const data = await res.json();
            setMachines(data);
        } catch (error) {
            console.error('Error fetching machines:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredMachines = machines.filter(machine =>
        machine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        machine.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        machine.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex-1 overflow-auto">
            <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                    <PageHeader title="Machine Management" subtitle="Overview of all registered machines" />

                    <button
                        onClick={() => navigate('/admin/add-machine')}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-blue-900/20"
                    >
                        <Plus size={20} />
                        Add Machine
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 mb-8 flex gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search machines by name, model, or location..."
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-slate-200 focus:outline-hidden focus:border-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Placeholder for future status filter */}
                    <button className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-300 hover:text-white flex items-center gap-2">
                        <Filter size={18} />
                        Filter
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-slate-400">Loading machines...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredMachines.map(machine => (
                            <div
                                key={machine._id}
                                onClick={() => navigate(`/admin/machines/${machine._id}`)}
                                className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden hover:border-blue-500/30 transition-all group cursor-pointer"
                            >
                                {/* Image Header */}
                                <div className="h-48 bg-slate-700/50 relative">
                                    {machine.imagePath ? (
                                        <img
                                            src={`http://localhost:3000/${machine.imagePath.replace(/\\/g, '/')}`}
                                            alt={machine.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-500">
                                            <Monitor size={48} strokeWidth={1.5} />
                                        </div>
                                    )}

                                    {/* Status Badge */}
                                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold shadow-xs
                                ${machine.status === 'active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20' :
                                            machine.status === 'maintenance' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/20' :
                                                'bg-slate-500/20 text-slate-400 border border-slate-500/20'}
                            `}>
                                        {machine.status.toUpperCase()}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{machine.name}</h3>
                                    <p className="text-sm text-slate-400 mb-4">{machine.model}</p>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-slate-300 text-sm">
                                            <MapPin size={16} className="text-slate-500" />
                                            {machine.location}
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-300 text-sm">
                                            <Clock size={16} className="text-slate-500" />
                                            Last Service: {machine.lastMaintenance ? new Date(machine.lastMaintenance).toLocaleDateString() : 'N/A'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
