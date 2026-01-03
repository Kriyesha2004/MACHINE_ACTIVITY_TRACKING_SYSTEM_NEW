import React, { useState } from 'react';
import { Download, FileText } from 'lucide-react';
import { PageHeader, FormSelect, ConfirmationModal } from '../../components/shared';
import { mockReports } from '../../utils/mockData';

interface Report {
  id: string;
  title: string;
  type: 'maintenance' | 'issues' | 'performance';
  createdDate: string;
  createdBy: string;
  machines: string[];
  completionRate: number;
}

export const GenerateReportsPage: React.FC = () => {
  const [reports] = useState<Report[]>(mockReports);
  const [reportType, setReportType] = useState('');
  const [dateRange, setDateRange] = useState('monthly');
  const [selectedMachines, setSelectedMachines] = useState<string[]>([]);
  const [showGenerateConfirm, setShowGenerateConfirm] = useState(false);

  const handleGenerateReport = () => {
    if (reportType) {
      setShowGenerateConfirm(true);
    }
  };

  const handleConfirmGenerate = () => {
    console.log('Report generated:', { reportType, dateRange, selectedMachines });
    setShowGenerateConfirm(false);
  };

  const handleDownload = (reportId: string) => {
    const report = reports.find((r) => r.id === reportId);
    if (report) {
      console.log('Downloading report:', report.title);
      // In production, trigger actual download
    }
  };

  return (
    <div className="w-full p-6">
      <PageHeader title="Generate Reports" subtitle="Create and download maintenance and performance reports" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Configuration */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Report Configuration</h2>

          <FormSelect
            label="Report Type"
            options={[
              { value: 'maintenance', label: 'Maintenance Report' },
              { value: 'issues', label: 'Issues Report' },
              { value: 'performance', label: 'Performance Report' },
            ]}
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          />

          <FormSelect
            label="Date Range"
            options={[
              { value: 'weekly', label: 'Last Week' },
              { value: 'monthly', label: 'Last Month' },
              { value: 'quarterly', label: 'Last Quarter' },
              { value: 'yearly', label: 'Last Year' },
            ]}
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          />

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Machines to Include</label>
            <select
              multiple
              value={selectedMachines}
              onChange={(e) => setSelectedMachines(Array.from(e.target.selectedOptions, (o) => o.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Machines</option>
              <option value="mach_001">CNC Machine A</option>
              <option value="mach_002">Hydraulic Press B</option>
              <option value="mach_003">Drill C</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
          </div>

          <button
            onClick={handleGenerateReport}
            disabled={!reportType}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Generate Report
          </button>
        </div>

        {/* Previous Reports */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Reports</h2>

          <div className="space-y-3">
            {reports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{report.title}</p>
                  <p className="text-sm text-gray-600">
                    Created by {report.createdBy} on {new Date(report.createdDate).toLocaleDateString()}
                  </p>
                  <div className="mt-2 flex items-center gap-4 text-xs text-gray-600">
                    <span>Type: {report.type}</span>
                    <span>Machines: {report.machines.join(', ')}</span>
                    <div className="flex items-center gap-2">
                      <span>Completion:</span>
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${report.completionRate}%` }}
                        ></div>
                      </div>
                      <span>{report.completionRate}%</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDownload(report.id)}
                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                >
                  <Download className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showGenerateConfirm}
        title="Generate Report"
        message={`Generate a ${reportType} report for the ${dateRange} period?`}
        type="confirm"
        confirmText="Generate"
        onConfirm={handleConfirmGenerate}
        onCancel={() => setShowGenerateConfirm(false)}
      />
    </div>
  );
};
