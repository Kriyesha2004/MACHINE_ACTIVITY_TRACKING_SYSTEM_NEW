import React, { useState } from 'react';
import { FileText, Download, Filter } from 'lucide-react';
import { PageHeader, DataTable } from '../../components/shared';

interface ReportRecord {
  id: string;
  title: string;
  type: 'maintenance' | 'issues' | 'inspection';
  createdDate: string;
  status: 'draft' | 'submitted' | 'approved';
  description: string;
}

export const ReportCreationPage: React.FC = () => {
  const [reports] = useState<ReportRecord[]>([
    {
      id: 'rpt_001',
      title: 'Weekly Machine Inspection - Week 1',
      type: 'inspection',
      createdDate: '2024-12-01',
      status: 'submitted',
      description: 'Regular inspection of CNC Machine A',
    },
    {
      id: 'rpt_002',
      title: 'Maintenance Completion Report',
      type: 'maintenance',
      createdDate: '2024-11-28',
      status: 'approved',
      description: 'Monthly maintenance tasks completed',
    },
    {
      id: 'rpt_003',
      title: 'Issue Resolution Summary',
      type: 'issues',
      createdDate: '2024-11-25',
      status: 'draft',
      description: 'Summary of resolved mechanical issues',
    },
  ]);

  const [filterStatus, setFilterStatus] = useState('');

  const draftCount = reports.filter((r) => r.status === 'draft').length;

  return (
    <div className="w-full p-6">
      <PageHeader
        title="Report Creation"
        subtitle="Create, view, and manage maintenance and inspection reports"
        action={
          draftCount > 0 && (
            <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg flex items-center gap-2">
              <FileText className="w-5 h-5" />
              <span>{draftCount} Draft Report{draftCount !== 1 ? 's' : ''}</span>
            </div>
          )
        }
      />

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="mb-6 flex gap-4">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 font-semibold">
            <FileText className="w-4 h-4" />
            Create New Report
          </button>

          <div className="flex-1 flex gap-2 items-center">
            <Filter className="w-5 h-5 text-gray-600" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Reports</option>
              <option value="draft">Draft</option>
              <option value="submitted">Submitted</option>
              <option value="approved">Approved</option>
            </select>
          </div>
        </div>

        <DataTable
          columns={[
            { key: 'title', label: 'Report Title', sortable: true },
            {
              key: 'type',
              label: 'Type',
              sortable: true,
              render: (type: any) => <span className="capitalize">{type}</span>,
            },
            {
              key: 'createdDate',
              label: 'Date',
              render: (date: any) => new Date(date).toLocaleDateString(),
            },
            {
              key: 'status',
              label: 'Status',
              render: (status: any) => {
                const colors: Record<string, string> = {
                  draft: 'bg-gray-100 text-gray-800',
                  submitted: 'bg-blue-100 text-blue-800',
                  approved: 'bg-green-100 text-green-800',
                };
                return (
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
                    {status}
                  </span>
                );
              },
            },
            {
              key: 'id',
              label: 'Actions',
              render: (_value: any, _row: any) => (
                <div className="flex gap-2">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-semibold">Edit</button>
                  <button className="text-green-600 hover:text-green-800 text-sm font-semibold">View</button>
                  <button className="p-1 text-gray-600 hover:bg-gray-100 rounded">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ),
            },
          ]}
          data={filterStatus ? reports.filter((r) => r.status === filterStatus) : reports}
          rowKey="id"
          searchableColumns={['title', 'description']}
          pageSize={10}
        />
      </div>
    </div>
  );
};
