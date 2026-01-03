// User Types
export type UserRole = 'admin' | 'employee';

export interface User {
  id: string;
  role: UserRole;
  email?: string;
  name?: string;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  joinDate: string;
  status: 'active' | 'inactive';
}

export interface MachineIssue {
  id: string;
  machineId: string;
  machineName: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'resolved';
  reportedBy: string;
  reportedDate: string;
  resolvedDate?: string;
}

export interface NormalService {
  id: string;
  machineId: string;
  machineName: string;
  lastServiceDate: string;
  nextServiceDate: string;
  status: 'pending' | 'in-progress' | 'completed';
  assignedTo?: string;
}

export interface MaintenancePlan {
  id: string;
  machineId: string;
  machineName: string;
  serviceInterval: number; // in weeks
  lastService: string;
  nextService: string;
  tasks: string[];
}

export interface Report {
  id: string;
  title: string;
  type: 'maintenance' | 'issues' | 'performance';
  generatedDate: string;
  data: any;
}

// Auth Context Type
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}
