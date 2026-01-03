import React, { useState, useEffect } from 'react';
import { Trash2, Edit, Search, UserPlus } from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  status: 'active' | 'inactive';
}

const ManageEmployeesPage: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('http://localhost:3000/users');
      if (response.ok) {
        const data = await response.json();
        const mappedData = data.map((user: any) => ({
          id: user._id,
          name: user.name,
          email: user.email,
          department: user.department,
          status: 'active'
        }));
        setEmployees(mappedData);
      } else {
        console.error('Failed to fetch employees');
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setEmployees(employees.filter((emp) => emp.id !== id));
  };

  /* Edit Modal Logic */
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Employee>>({});

  const handleEdit = (employee: Employee) => {
    setEditingEmployee(employee);
    setEditFormData({
      name: employee.name,
      email: employee.email,
      department: employee.department,
      status: employee.status,
    });
  };

  const handleUpdate = async () => {
    if (!editingEmployee) return;

    try {
      const response = await fetch(`http://localhost:3000/users/${editingEmployee.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editFormData),
      });

      if (response.ok) {
        setEditingEmployee(null);
        fetchEmployees(); // Refresh list
      } else {
        console.error('Failed to update employee');
      }
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-primary-light mb-2">Manage Employees</h1>
            <p className="text-secondary-light">View, edit, and manage team members</p>
          </div>
          <button className="flex items-center gap-2 bg-accent-primary hover:bg-accent-primary/80 text-primary-dark font-bold px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-accent-primary/20">
            <UserPlus size={20} />
            Add Employee
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-light" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-secondary-dark/30 border border-secondary-light/20 rounded-lg pl-12 pr-4 py-3 text-primary-light placeholder-secondary-light/50 focus:outline-none focus:ring-2 focus:ring-accent-primary/50 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8 text-secondary-light">Loading employees...</div>
        ) : (
          /* Employees Table */
          <div className="bg-secondary-dark/30 backdrop-blur-md border border-secondary-light/10 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-secondary-dark/50 border-b border-secondary-light/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-light">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-light">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-light">Department</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-light">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-secondary-light">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-light/10">
                  {filteredEmployees.length > 0 ? (
                    filteredEmployees.map((employee) => (
                      <tr key={employee.id} className="hover:bg-secondary-light/5 transition-colors">
                        <td className="px-6 py-4 text-sm text-primary-light font-medium">{employee.name}</td>
                        <td className="px-6 py-4 text-sm text-secondary-light">{employee.email}</td>
                        <td className="px-6 py-4 text-sm text-secondary-light">{employee.department}</td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${employee.status === 'active'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                              }`}
                          >
                            {employee.status.charAt(0).toUpperCase() + employee.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(employee)}
                            className="p-2 hover:bg-accent-primary/20 rounded-lg transition-colors text-accent-primary"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(employee.id)}
                            className="p-2 hover:bg-accent-secondary/20 rounded-lg transition-colors text-accent-secondary"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-secondary-light">
                        No employees found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {/* Edit Modal */}
        {editingEmployee && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-secondary-dark border border-secondary-light/20 rounded-xl p-6 w-full max-w-md shadow-2xl">
              <h2 className="text-xl font-bold text-primary-light mb-4">Edit Employee</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-light mb-1">Name</label>
                  <input
                    type="text"
                    value={editFormData.name || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-primary-dark/50 border border-secondary-light/20 rounded-lg text-primary-light focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-light mb-1">Email</label>
                  <input
                    type="email"
                    value={editFormData.email || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    className="w-full px-4 py-2 bg-primary-dark/50 border border-secondary-light/20 rounded-lg text-primary-light focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-light mb-1">Department</label>
                  <input
                    type="text"
                    value={editFormData.department || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, department: e.target.value })}
                    className="w-full px-4 py-2 bg-primary-dark/50 border border-secondary-light/20 rounded-lg text-primary-light focus:outline-none focus:ring-2 focus:ring-accent-primary"
                  />
                </div>
                <div className="flex gap-3 justify-end mt-6">
                  <button
                    onClick={() => setEditingEmployee(null)}
                    className="px-4 py-2 text-secondary-light hover:text-primary-light transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdate}
                    className="px-4 py-2 bg-accent-primary hover:bg-accent-primary/80 text-primary-dark font-bold rounded-lg transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export { ManageEmployeesPage };
