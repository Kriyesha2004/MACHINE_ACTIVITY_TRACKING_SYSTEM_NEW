import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench, AlertCircle, CheckCircle, Clock, Play, FileText, Activity } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { AdHocStartModal } from '../../components/maintenance/AdHocStartModal';
import { MaintenanceCompletionModal } from '../../components/maintenance/MaintenanceCompletionModal';

const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    assignedCount: 0,
    activeTasks: 0,
    pendingIssues: 0,
    completedCount: 0
  });
  const [recentTasks, setRecentTasks] = useState<any[]>([]);
  const [templates, setTemplates] = useState<any[]>([]);

  // Modal States
  const [selectedTemplate, setSelectedTemplate] = useState<any | null>(null);
  const [showStartModal, setShowStartModal] = useState(false);
  const [createdPlan, setCreatedPlan] = useState<any | null>(null);
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch all plans and templates
      const [dailyRes, monthlyRes, eightWeekRes, templatesRes] = await Promise.all([
        fetch('http://localhost:3000/maintenance/plans/active?frequency=Daily'),
        fetch('http://localhost:3000/maintenance/plans/active?frequency=Monthly'),
        fetch('http://localhost:3000/maintenance/plans/active?frequency=8-Weekly'),
        fetch('http://localhost:3000/maintenance/templates')
      ]);

      const dailyData = await dailyRes.json();
      const monthlyData = await monthlyRes.json();
      const eightWeekData = await eightWeekRes.json();
      const templatesData = await templatesRes.json();

      setTemplates(templatesData);

      // Filter assigned to this user
      const myAssignedAndDaily = [
        ...dailyData, // All daily are available to everyone
        ...[...monthlyData, ...eightWeekData].filter((p: any) => p.assignedEmployeeId?._id === user?.id || p.assignedEmployeeId === user?.id)
      ];

      const active = myAssignedAndDaily.filter(p => p.status === 'active' || p.status === 'planned');
      const completed = myAssignedAndDaily.filter(p => p.status === 'completed');

      setStats({
        assignedCount: myAssignedAndDaily.length,
        activeTasks: active.length,
        pendingIssues: 0,
        completedCount: completed.length
      });

      // Get upcoming/active tasks for the list
      setRecentTasks(active.slice(0, 5));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartClick = (template: any) => {
    setSelectedTemplate(template);
    setShowStartModal(true);
  };

  const handlePlanCreated = (plan: any) => {
    setShowStartModal(false);
    setCreatedPlan(plan);
    setShowCompleteModal(true);
  };

  const handleCompletionSuccess = () => {
    setShowCompleteModal(false);
    fetchDashboardData(); // Refresh stats and tasks
  };

  const statCards = [
    { label: 'Assigned Tasks', value: stats.assignedCount.toString(), icon: Wrench, color: 'blue' },
    { label: 'Pending Action', value: stats.activeTasks.toString(), icon: Clock, color: 'yellow' },
    { label: 'Reported Issues', value: stats.pendingIssues.toString(), icon: AlertCircle, color: 'red' },
    { label: 'Completed', value: stats.completedCount.toString(), icon: CheckCircle, color: 'green' },
  ];

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome, {user?.name}</h1>
          <p className="text-gray-400">Your maintenance overview for today</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            const colorClasses: Record<string, string> = {
              blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400',
              red: 'from-red-500/20 to-red-600/10 border-red-500/30 text-red-400',
              green: 'from-green-500/20 to-green-600/10 border-green-500/30 text-green-400',
              yellow: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30 text-yellow-400',
            };

            return (
              <div
                key={index}
                className={`bg-linear-to-br ${colorClasses[stat.color]} border rounded-xl p-6 hover:shadow-lg transition-all duration-300`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-400 font-medium text-sm">{stat.label}</h3>
                  <Icon size={24} className={colorClasses[stat.color].split(' ').pop() || ''} />
                </div>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My Tasks */}
          <div
            className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl p-6 hover:shadow-lg transition-all flex flex-col h-full"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Pending Tasks</h2>
              <button onClick={() => navigate('/employee/maintenance')} className="text-xs text-blue-400 hover:text-blue-300 hover:underline">View All</button>
            </div>

            {loading ? (
              <div className="text-center text-gray-500 py-4">Loading tasks...</div>
            ) : recentTasks.length === 0 ? (
              <div className="text-center text-gray-500 py-4">No pending tasks. Great job!</div>
            ) : (
              <div className="space-y-3 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                {recentTasks.map((task) => (
                  <div key={task._id} className="flex items-start gap-3 p-3 bg-gray-800/30 rounded-lg border border-gray-700/30 hover:border-blue-500/30 transition-colors">
                    <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${task.frequency === 'Daily' ? 'bg-blue-500' : 'bg-purple-500'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{task.name}</p>
                      <p className="text-xs text-gray-400">{task.machineId?.name} | {task.frequency}</p>
                    </div>
                    <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded shrink-0">
                      {new Date(task.scheduledDate).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Start Templates */}
          <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl p-6 hover:shadow-lg transition-all flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Start New Check</h2>
              <button onClick={() => navigate('/employee/templates')} className="text-xs text-blue-400 hover:text-blue-300 hover:underline">View Templates</button>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
              {templates.slice(0, 5).map(template => (
                <div key={template._id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg border border-gray-700/30">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${template.frequency === 'Daily' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
                      {template.frequency === 'Daily' ? <Activity size={18} /> : <FileText size={18} />}
                    </div>
                    <div>
                      <h4 className="font-medium text-white text-sm">{template.name}</h4>
                      <p className="text-xs text-slate-400">{template.frequency}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleStartClick(template)}
                    className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                    title="Start Check"
                  >
                    <Play size={16} fill="currentColor" />
                  </button>
                </div>
              ))}
              {templates.length === 0 && (
                <div className="text-center text-gray-500 py-4">No templates available.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AdHocStartModal
        isOpen={showStartModal}
        onClose={() => setShowStartModal(false)}
        template={selectedTemplate}
        onPlanCreated={handlePlanCreated}
      />

      <MaintenanceCompletionModal
        isOpen={showCompleteModal}
        onClose={() => setShowCompleteModal(false)}
        plan={createdPlan}
        onComplete={handleCompletionSuccess}
      />
    </div>
  );
};

export default EmployeeDashboard;

