// Mock data for employees
export const mockEmployees = [
  { id: 'emp_001', name: 'John Doe', email: 'john@company.com', department: 'IT', status: 'active' as const },
  { id: 'emp_002', name: 'Jane Smith', email: 'jane@company.com', department: 'Maintenance', status: 'active' as const },
  { id: 'emp_003', name: 'Bob Wilson', email: 'bob@company.com', department: 'Operations', status: 'inactive' as const },
  { id: 'emp_004', name: 'Alice Brown', email: 'alice@company.com', department: 'IT', status: 'active' as const },
];

// Mock data for machines
export const mockMachines = [
  { id: 'mach_001', name: 'CNC Machine A', model: 'CNC-2000', location: 'Building A', status: 'active' as const, lastMaintenance: '2024-11-15', assignedTo: 'John Doe' },
  { id: 'mach_002', name: 'Hydraulic Press B', model: 'HP-500', location: 'Building B', status: 'maintenance' as const, lastMaintenance: '2024-12-01', assignedTo: 'Jane Smith' },
  { id: 'mach_003', name: 'Drill C', model: 'DRILL-X', location: 'Building A', status: 'active' as const, lastMaintenance: '2024-11-20', assignedTo: 'Bob Wilson' },
];

// Mock data for maintenance templates
export const mockTemplates = [
  { id: 'tmpl_001', name: 'Weekly Oil Change', frequency: 'Weekly', checklist: ['Check oil level', 'Replace filter', 'Inspect hoses'], createdBy: 'Admin', status: 'active' as const },
  { id: 'tmpl_002', name: 'Monthly Inspection', frequency: 'Monthly', checklist: ['Full machine inspection', 'Check alignment', 'Test safety systems'], createdBy: 'Admin', status: 'active' as const },
  { id: 'tmpl_003', name: 'Quarterly Deep Clean', frequency: 'Quarterly', checklist: ['Deep clean', 'Lubricate parts', 'Replace consumables'], createdBy: 'Admin', status: 'active' as const },
];

// Mock data for maintenance history
export const mockMaintenanceHistory = [
  { id: 'maint_001', machineId: 'mach_001', machineName: 'CNC Machine A', templateId: 'tmpl_001', templateName: 'Weekly Oil Change', completedBy: 'John Doe', completedDate: '2024-12-01', status: 'completed' as const, notes: 'Oil level normal, filter replaced' },
  { id: 'maint_002', machineId: 'mach_002', machineName: 'Hydraulic Press B', templateId: 'tmpl_002', templateName: 'Monthly Inspection', completedBy: 'Jane Smith', completedDate: '2024-11-28', status: 'completed' as const, notes: 'All checks passed' },
  { id: 'maint_003', machineId: 'mach_001', machineName: 'CNC Machine A', templateId: 'tmpl_003', templateName: 'Quarterly Deep Clean', completedBy: 'John Doe', completedDate: '2024-12-02', status: 'pending' as const, notes: '' },
];

// Mock data for mechanical issues
export const mockIssues = [
  { id: 'issue_001', machineId: 'mach_001', machineName: 'CNC Machine A', title: 'Spindle noise', severity: 'high' as const, reportedBy: 'John Doe', reportedDate: '2024-12-02', status: 'open' as const, description: 'Unusual grinding noise from spindle' },
  { id: 'issue_002', machineId: 'mach_002', machineName: 'Hydraulic Press B', title: 'Pressure leak', severity: 'critical' as const, reportedBy: 'Jane Smith', reportedDate: '2024-12-01', status: 'in-progress' as const, description: 'Hydraulic fluid leak detected' },
  { id: 'issue_003', machineId: 'mach_003', machineName: 'Drill C', title: 'Slow drill speed', severity: 'medium' as const, reportedBy: 'Bob Wilson', reportedDate: '2024-11-30', status: 'resolved' as const, description: 'Drill speed lower than normal' },
];

// Mock data for 8-week plan
export const mock8WeekPlan = [
  { weekNumber: 1, machineId: 'mach_001', machineName: 'CNC Machine A', task: 'Oil change and filter replacement', status: 'completed' as const },
  { weekNumber: 2, machineId: 'mach_002', machineName: 'Hydraulic Press B', task: 'Full system inspection', status: 'completed' as const },
  { weekNumber: 3, machineId: 'mach_003', machineName: 'Drill C', task: 'Calibration check', status: 'in-progress' as const },
  { weekNumber: 4, machineId: 'mach_001', machineName: 'CNC Machine A', task: 'Safety system test', status: 'pending' as const },
  { weekNumber: 5, machineId: 'mach_002', machineName: 'Hydraulic Press B', task: 'Deep cleaning', status: 'pending' as const },
  { weekNumber: 6, machineId: 'mach_003', machineName: 'Drill C', task: 'Part replacement', status: 'pending' as const },
  { weekNumber: 7, machineId: 'mach_001', machineName: 'CNC Machine A', task: 'Performance testing', status: 'pending' as const },
  { weekNumber: 8, machineId: 'mach_002', machineName: 'Hydraulic Press B', task: 'Final inspection', status: 'pending' as const },
];

// Mock data for reports
export const mockReports = [
  { id: 'rpt_001', title: 'Monthly Maintenance Report', type: 'maintenance' as const, createdDate: '2024-12-01', createdBy: 'John Doe', machines: ['CNC Machine A', 'Drill C'], completionRate: 95 },
  { id: 'rpt_002', title: 'Equipment Issues Summary', type: 'issues' as const, createdDate: '2024-11-30', createdBy: 'Admin', machines: ['All'], completionRate: 78 },
  { id: 'rpt_003', title: 'Q4 Performance Analysis', type: 'performance' as const, createdDate: '2024-11-25', createdBy: 'Jane Smith', machines: ['All'], completionRate: 100 },
];
