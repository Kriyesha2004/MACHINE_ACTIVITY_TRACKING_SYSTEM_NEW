import React, { useState, useEffect } from 'react';
import { X, Search, User } from 'lucide-react';

interface AssignmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAssign: (employeeId: string) => void;
    planName: string;
    currentAssigneeId?: string;
}

export const AssignmentModal: React.FC<AssignmentModalProps> = ({ isOpen, onClose, onAssign, planName, currentAssigneeId }) => {
    const [employees, setEmployees] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedId, setSelectedId] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            fetchEmployees();
            setSelectedId(currentAssigneeId || null);
            setSearchTerm('');
        }
    }, [isOpen, currentAssigneeId]);

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:3000/users');
            if (response.ok) {
                const data = await response.json();
                setEmployees(data);
            }
        } catch (error) {
            console.error('Error fetching employees:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredEmployees = employees.filter(emp =>
        emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md shadow-2xl overflow-hidden">
                <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
                    <h3 className="text-lg font-semibold text-white">Assign Maintenance Plan</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    <p className="text-slate-400 mb-4">
                        Assign <span className="text-white font-medium">{planName}</span> to an employee.
                    </p>

                    <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input
                            type="text"
                            placeholder="Search employees..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="space-y-2 max-h-60 overflow-y-auto mb-6 custom-scrollbar">
                        {loading ? (
                            <div className="text-center py-4 text-slate-500">Loading...</div>
                        ) : filteredEmployees.length === 0 ? (
                            <div className="text-center py-4 text-slate-500">No employees found</div>
                        ) : (
                            filteredEmployees.map((emp) => (
                                <div
                                    key={emp._id}
                                    onClick={() => setSelectedId(emp._id)}
                                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border ${selectedId === emp._id
                                        ? 'bg-blue-600/20 border-blue-500/50'
                                        : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800'
                                        }`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedId === emp._id ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-400'
                                        }`}>
                                        <User size={16} />
                                    </div>
                                    <div>
                                        <div className={`font-medium ${selectedId === emp._id ? 'text-blue-400' : 'text-slate-300'}`}>
                                            {emp.name}
                                        </div>
                                        <div className="text-xs text-slate-500">{emp.department || 'No Dept'}</div>
                                    </div>
                                    {selectedId === emp._id && (
                                        <div className="ml-auto text-blue-400">
                                            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => selectedId && onAssign(selectedId)}
                            disabled={!selectedId}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedId
                                ? 'bg-blue-600 hover:bg-blue-500 text-white'
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                }`}
                        >
                            Confirm Assignment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
