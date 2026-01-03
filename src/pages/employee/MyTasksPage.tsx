import React, { useState } from 'react';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  machine: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
  dueDate: string;
}

const MyTasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: '8-Week Service', machine: 'Machine 1J', priority: 'high', status: 'pending', dueDate: '2024-12-05' },
    { id: '2', title: 'Replace Belts', machine: 'Machine 2K', priority: 'medium', status: 'in-progress', dueDate: '2024-12-06' },
    { id: '3', title: 'Oil Change', machine: 'Machine 3M', priority: 'low', status: 'pending', dueDate: '2024-12-07' },
    { id: '4', title: 'Bearing Replacement', machine: 'Machine 1J', priority: 'high', status: 'completed', dueDate: '2024-12-03' },
  ]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={20} className="text-green-400" />;
      case 'in-progress':
        return <Clock size={20} className="text-blue-400" />;
      default:
        return <AlertCircle size={20} className="text-yellow-400" />;
    }
  };

  const markCompleted = (id: string) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, status: 'completed' } : task));
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">My Tasks</h1>
          <p className="text-gray-400">Track your maintenance assignments</p>
        </div>

        {/* Tasks Grid */}
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  {getStatusIcon(task.status)}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-white mb-1">{task.title}</h3>
                    <p className="text-gray-400 text-sm mb-3">Machine: {task.machine}</p>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(task.priority)}`}>
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        task.status === 'completed'
                          ? 'bg-green-500/20 text-green-400'
                          : task.status === 'in-progress'
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {task.status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                      </span>
                      <span className="text-xs text-gray-400">Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {task.status !== 'completed' && (
                  <button
                    onClick={() => markCompleted(task.id)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all duration-300 text-sm shrink-0"
                  >
                    Mark Done
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {tasks.length === 0 && (
          <div className="text-center py-12">
            <CheckCircle size={48} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400">No tasks assigned yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTasksPage;

