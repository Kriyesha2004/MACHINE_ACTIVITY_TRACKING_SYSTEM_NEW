import React, { useState } from 'react';
import { Eye, Download } from 'lucide-react';
import { PageHeader, DataTable, StatusBadge } from '../../components/shared';
import { mockTemplates } from '../../utils/mockData';

interface Template {
  id: string;
  name: string;
  frequency: string;
  checklist: string[];
  createdBy: string;
  status: 'active' | 'inactive';
}

export const ViewTemplatesPage: React.FC = () => {
  const [templates] = useState<Template[]>(mockTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  return (
    <div className="w-full p-6">
      <PageHeader
        title="Maintenance Templates"
        subtitle="View and download routine maintenance templates (Admin-controlled)"
      />

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> These templates are created and controlled by administrators. You can view and download them to perform maintenance tasks.
          </p>
        </div>

        <DataTable
          columns={[
            { key: 'name', label: 'Template Name', sortable: true },
            { key: 'frequency', label: 'Frequency', sortable: true },
            {
              key: 'checklist',
              label: 'Items',
              render: (checklist: any) => <span className="text-sm">{checklist.length} items</span>,
            },
            { key: 'createdBy', label: 'Created By', sortable: true },
            {
              key: 'status',
              label: 'Status',
              render: (status: any) => <StatusBadge status={status as any} />,
            },
            {
              key: 'id',
              label: 'Actions',
              render: (_, row: any) => (
                <button
                  onClick={() => setSelectedTemplate(row)}
                  className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                >
                  <Eye className="w-4 h-4" />
                </button>
              ),
            },
          ]}
          data={templates}
          rowKey="id"
          searchableColumns={['name', 'frequency']}
          pageSize={10}
        />
      </div>

      {selectedTemplate && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-6 max-w-sm max-h-96 overflow-y-auto">
          <h3 className="text-lg font-bold text-gray-800 mb-4">{selectedTemplate.name}</h3>

          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-700">Frequency:</span>
              <span className="text-sm text-gray-600">{selectedTemplate.frequency}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-700">Status:</span>
              <StatusBadge status={selectedTemplate.status} />
            </div>

            <div>
              <span className="text-sm font-semibold text-gray-700 block mb-2">Checklist Items:</span>
              <ul className="space-y-1">
                {selectedTemplate.checklist.map((item, idx) => (
                  <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => console.log('Download:', selectedTemplate.name)}
              className="flex-1 bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <button
              onClick={() => setSelectedTemplate(null)}
              className="flex-1 bg-gray-200 text-gray-800 py-2 rounded text-sm hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
