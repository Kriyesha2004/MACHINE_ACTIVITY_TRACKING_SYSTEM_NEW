import React from 'react';

type Status = 'active' | 'inactive' | 'pending' | 'completed' | 'failed' | 'maintenance';

interface StatusBadgeProps {
  status: Status;
  label?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, label }) => {
  const getStyles = (): { bg: string; text: string; dot: string } => {
    switch (status) {
      case 'active':
        return { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-600' };
      case 'inactive':
        return { bg: 'bg-gray-100', text: 'text-gray-800', dot: 'bg-gray-600' };
      case 'pending':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-600' };
      case 'completed':
        return { bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-600' };
      case 'failed':
        return { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-600' };
      case 'maintenance':
        return { bg: 'bg-orange-100', text: 'text-orange-800', dot: 'bg-orange-600' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', dot: 'bg-gray-600' };
    }
  };

  const styles = getStyles();
  const displayLabel = label || status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${styles.bg} ${styles.text}`}>
      <span className={`w-2 h-2 rounded-full ${styles.dot}`}></span>
      {displayLabel}
    </span>
  );
};
