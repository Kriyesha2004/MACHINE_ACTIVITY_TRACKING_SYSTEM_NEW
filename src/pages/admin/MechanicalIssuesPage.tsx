import React, { useState } from 'react';
import { AlertTriangle, Wrench, Zap } from 'lucide-react';
import { PageHeader, DataTable, StatusBadge, ConfirmationModal } from '../../components/shared';
import { mockIssues } from '../../utils/mockData';

interface Issue {
  id: string;
  machineId: string;
  machineName: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  reportedBy: string;
  reportedDate: string;
  status: 'open' | 'in-progress' | 'resolved';
  description: string;
}

export const MechanicalIssuesPage: React.FC = () => {
  const [issues, setIssues] = useState<Issue[]>(mockIssues);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [showResolveConfirm, setShowResolveConfirm] = useState(false);

  const getSeverityBadgeColor = (severity: string): string => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const handleResolve = () => {
    if (selectedIssue) {
      setIssues(
        issues.map((issue) =>
          issue.id === selectedIssue.id ? { ...issue, status: 'resolved' as const } : issue
        )
      );
      setShowResolveConfirm(false);
      setSelectedIssue(null);
    }
  };

  const criticalCount = issues.filter((i) => i.severity === 'critical').length;

  return (
    <div className="w-full p-6">
      <PageHeader
        title="Mechanical Issues"
        subtitle="Track and manage all reported mechanical issues"
        action={
          criticalCount > 0 && (
            <div className="bg-red-100 text-red-800 px-4 py-2 rounded-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              <span>{criticalCount} Critical Issue{criticalCount !== 1 ? 's' : ''}</span>
            </div>
          )
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Issues</p>
              <p className="text-2xl font-bold text-gray-800">{issues.length}</p>
            </div>
            <Wrench className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Open</p>
              <p className="text-2xl font-bold text-orange-600">{issues.filter((i) => i.status === 'open').length}</p>
            </div>
            <Zap className="w-8 h-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Resolved</p>
              <p className="text-2xl font-bold text-green-600">{issues.filter((i) => i.status === 'resolved').length}</p>
            </div>
            <Wrench className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <DataTable
          columns={[
            { key: 'machineName', label: 'Machine', sortable: true },
            { key: 'title', label: 'Issue', sortable: true },
            {
              key: 'severity',
              label: 'Severity',
              render: (severity: any) => (
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-sm font-medium ${getSeverityBadgeColor(severity)}`}>
                  <AlertTriangle className="w-3 h-3" />
                  {severity.charAt(0).toUpperCase() + severity.slice(1)}
                </span>
              ),
            },
            { key: 'reportedBy', label: 'Reported By', sortable: true },
            {
              key: 'reportedDate',
              label: 'Date',
              render: (date: any) => new Date(date).toLocaleDateString(),
            },
            {
              key: 'status',
              label: 'Status',
              render: (status: any) => <StatusBadge status={status as any} />,
            },
          ]}
          data={issues}
          rowKey="id"
          searchableColumns={['machineName', 'title', 'reportedBy']}
          pageSize={10}
          onRowClick={setSelectedIssue}
        />
      </div>

      {selectedIssue && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-6 max-w-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4">{selectedIssue.title}</h3>
          <div className="space-y-2 text-sm text-gray-600 mb-4">
            <p><strong>Machine:</strong> {selectedIssue.machineName}</p>
            <p><strong>Description:</strong> {selectedIssue.description}</p>
            <p><strong>Severity:</strong> <span className={`px-2 py-1 rounded ${getSeverityBadgeColor(selectedIssue.severity)}`}>{selectedIssue.severity}</span></p>
            <p><strong>Reported By:</strong> {selectedIssue.reportedBy}</p>
            <p><strong>Status:</strong> <StatusBadge status={selectedIssue.status as any} /></p>
          </div>
          {selectedIssue.status !== 'resolved' && (
            <button
              onClick={() => setShowResolveConfirm(true)}
              className="w-full bg-green-600 text-white py-2 rounded text-sm hover:bg-green-700 mb-2"
            >
              Mark as Resolved
            </button>
          )}
          <button
            onClick={() => setSelectedIssue(null)}
            className="w-full bg-gray-200 text-gray-800 py-2 rounded text-sm hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      )}

      <ConfirmationModal
        isOpen={showResolveConfirm}
        title="Mark Issue as Resolved"
        message={`Mark "${selectedIssue?.title}" as resolved?`}
        type="confirm"
        confirmText="Resolve"
        onConfirm={handleResolve}
        onCancel={() => setShowResolveConfirm(false)}
      />
    </div>
  );
};
