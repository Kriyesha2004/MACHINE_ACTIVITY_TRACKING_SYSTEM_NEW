import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { PageHeader, DataTable, StatusBadge } from '../../components/shared';
import { mockMaintenanceHistory } from '../../utils/mockData';

interface MaintenanceRecord {
  id: string;
  machineId: string;
  machineName: string;
  templateId: string;
  templateName: string;
  completedBy: string;
  completedDate: string;
  status: 'completed' | 'pending' | 'failed';
  notes: string;
}

export const RoutineMaintenancePage: React.FC = () => {
  const [maintenance] = useState<MaintenanceRecord[]>(mockMaintenanceHistory);
  const [selectedRecord, setSelectedRecord] = useState<MaintenanceRecord | null>(null);

  return (
    <div className="w-full p-6">
      <PageHeader
        title="Routine Maintenance"
        subtitle="Monitor all routine maintenance activities"
      />

      <div className="bg-white rounded-lg shadow-md p-6">
        <DataTable
          columns={[
            { key: 'machineName', label: 'Machine', sortable: true },
            { key: 'templateName', label: 'Template', sortable: true },
            { key: 'completedBy', label: 'Completed By', sortable: true },
            {
              key: 'completedDate',
              label: 'Date',
              render: (date: any) => (
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  {new Date(date).toLocaleDateString()}
                </div>
              ),
            },
            {
              key: 'status',
              label: 'Status',
              render: (status: any) => <StatusBadge status={status as any} />,
            },
          ]}
          data={maintenance}
          rowKey="id"
          searchableColumns={['machineName', 'templateName', 'completedBy']}
          pageSize={10}
          onRowClick={setSelectedRecord}
        />
      </div>

      {selectedRecord && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-6 max-w-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-4">{selectedRecord.templateName}</h3>
          <div className="space-y-2 text-sm text-gray-600 mb-4">
            <p><strong>Machine:</strong> {selectedRecord.machineName}</p>
            <p><strong>Completed By:</strong> {selectedRecord.completedBy}</p>
            <p><strong>Date:</strong> {new Date(selectedRecord.completedDate).toLocaleDateString()}</p>
            <p><strong>Status:</strong> <StatusBadge status={selectedRecord.status} /></p>
            {selectedRecord.notes && (
              <p><strong>Notes:</strong> {selectedRecord.notes}</p>
            )}
          </div>
          <button
            onClick={() => setSelectedRecord(null)}
            className="w-full bg-gray-200 text-gray-800 py-2 rounded text-sm hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};
