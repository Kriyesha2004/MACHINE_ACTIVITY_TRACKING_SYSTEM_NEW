export const generateQRCode = (_data: string): string => {
  // Placeholder for QR code generation
  // In production, use a library like qrcode.react
  return `QR_CODE_${Date.now()}`;
};

export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

export const formatDateTime = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};

export const getSeverityColor = (severity: string): string => {
  switch (severity) {
    case 'critical':
      return 'bg-red-600';
    case 'high':
      return 'bg-orange-600';
    case 'medium':
      return 'bg-yellow-600';
    case 'low':
      return 'bg-green-600';
    default:
      return 'bg-gray-600';
  }
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'completed':
    case 'active':
    case 'resolved':
      return 'text-green-600 bg-green-100';
    case 'pending':
    case 'inactive':
      return 'text-yellow-600 bg-yellow-100';
    case 'in-progress':
      return 'text-blue-600 bg-blue-100';
    case 'failed':
    case 'open':
      return 'text-red-600 bg-red-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

export const calculateMaintenanceDue = (lastDate: string, frequencyDays: number): boolean => {
  const last = new Date(lastDate);
  const now = new Date();
  const diff = (now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24);
  return diff > frequencyDays;
};

export const exportToCSV = (data: any[], filename: string): void => {
  const csv = [
    Object.keys(data[0]).join(','),
    ...data.map((row) => Object.values(row).join(',')),
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
};
