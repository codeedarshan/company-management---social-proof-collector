import React, { useState } from 'react';
import { CompanyDetails, Employee, AuditLog } from '../types';
import { 
  Building2, 
  Users, 
  Plus, 
  Briefcase, 
  DollarSign, 
  Mail, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface CompanyManagementProps {
  company: CompanyDetails;
  auditLogs: AuditLog[];
  onAddEmployee: (emp: { name: string; email: string; role: string; department: string }) => Promise<boolean>;
}

export const CompanyManagement: React.FC<CompanyManagementProps> = ({
  company,
  auditLogs,
  onAddEmployee,
}) => {
  const [activeSection, setActiveSection] = useState<'employees' | 'departments' | 'logs'>('employees');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');

  // Add Employee Form State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [empName, setEmpName] = useState('');
  const [empEmail, setEmpEmail] = useState('');
  const [empRole, setEmpRole] = useState('');
  const [empDept, setEmpDept] = useState(company.departments[0]?.name || 'Engineering');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredEmployees = company.employees.filter((emp) => {
    if (selectedDept !== 'all' && emp.department !== selectedDept) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        emp.name.toLowerCase().includes(q) ||
        emp.email.toLowerCase().includes(q) ||
        emp.role.toLowerCase().includes(q) ||
        emp.department.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!empName.trim() || !empEmail.trim() || !empRole.trim()) return;

    setIsSubmitting(true);
    const ok = await onAddEmployee({
      name: empName.trim(),
      email: empEmail.trim(),
      role: empRole.trim(),
      department: empDept,
    });
    setIsSubmitting(false);

    if (ok) {
      setEmpName('');
      setEmpEmail('');
      setEmpRole('');
      setIsAddOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Company Overview Hero Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="flex items-start space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-200">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {company.name}
                </h2>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  Verified Enterprise
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {company.tagline}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-3">
                <span><strong>Industry:</strong> {company.industry}</span>
                <span>•</span>
                <span><strong>HQ:</strong> {company.headquarters}</span>
                <span>•</span>
                <span><strong>Founded:</strong> {company.founded}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsAddOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition-all shrink-0 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            Add Team Member
          </button>

        </div>

        {/* Quick Stats Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Total Staff</div>
            <div className="text-xl font-extrabold text-slate-800 mt-0.5">{company.employees.length}</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Departments</div>
            <div className="text-xl font-extrabold text-slate-800 mt-0.5">{company.departments.length}</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Audit Records</div>
            <div className="text-xl font-extrabold text-slate-800 mt-0.5">{auditLogs.length}</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Database Status</div>
            <div className="text-xs font-bold text-emerald-600 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Synchronized
            </div>
          </div>
        </div>

      </div>

      {/* Tabs Menu */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveSection('employees')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeSection === 'employees'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Employee Directory ({company.employees.length})
          </button>
          <button
            onClick={() => setActiveSection('departments')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeSection === 'departments'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Departments ({company.departments.length})
          </button>
          <button
            onClick={() => setActiveSection('logs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              activeSection === 'logs'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Audit Trail ({auditLogs.length})
          </button>
        </div>
      </div>

      {/* Section 1: Employee Directory */}
      {activeSection === 'employees' && (
        <div className="space-y-4">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80">
            <div className="relative w-full sm:w-72">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search employee name, role, email..."
                className="w-full pl-8.5 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 bg-slate-50/50"
              />
            </div>

            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              aria-label="Filter employees by department"
              className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 w-full sm:w-auto"
            >
              <option value="all">All Departments</option>
              {company.departments.map((d) => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEmployees.map((emp) => (
              <div
                key={emp.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:shadow-xs transition-shadow"
              >
                <div className="flex items-start space-x-3">
                  <img
                    src={emp.avatarUrl}
                    alt={emp.name}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-slate-100"
                  />
                  <div className="truncate flex-1">
                    <h4 className="text-sm font-bold text-slate-900 truncate">{emp.name}</h4>
                    <p className="text-xs text-indigo-600 font-medium truncate">{emp.role}</p>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
                      <Mail className="w-3 h-3 shrink-0" />
                      <span className="truncate">{emp.email}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium truncate max-w-[140px]">
                    {emp.department}
                  </span>
                  <span
                    className={`font-bold capitalize px-2 py-0.5 rounded-full ${
                      emp.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-blue-50 text-blue-700'
                    }`}
                  >
                    {emp.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* Section 2: Departments */}
      {activeSection === 'departments' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {company.departments.map((dept) => (
            <div
              key={dept.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-base font-bold text-slate-900">{dept.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Department Head: <strong className="text-slate-700">{dept.head}</strong></p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                  <Briefcase className="w-4 h-4" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Annual Budget</span>
                  <span className="font-bold text-slate-800 text-sm">{dept.budget}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Headcount</span>
                  <span className="font-bold text-slate-800 text-sm">{dept.employeeCount} Members</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Section 3: Audit Trail Logs */}
      {activeSection === 'logs' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-slate-100 text-xs font-bold text-slate-700 uppercase tracking-wider">
            System Event & Security Audit Trail
          </div>
          <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-4 flex items-start justify-between text-xs hover:bg-slate-50/60">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{log.action}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.2 rounded-full uppercase ${
                        log.type === 'auth'
                          ? 'bg-purple-50 text-purple-700'
                          : log.type === 'space'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {log.type}
                    </span>
                  </div>
                  <p className="text-slate-600">{log.details}</p>
                </div>
                <div className="text-right text-[11px] text-slate-400 shrink-0 pl-4">
                  <div className="font-medium text-slate-600">{log.user}</div>
                  <div>{new Date(log.timestamp).toLocaleTimeString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Employee Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 w-full max-w-md">
            <h3 className="text-base font-bold text-slate-900 mb-4">Add Team Member</h3>
            <form onSubmit={handleAddSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={empName}
                  onChange={(e) => setEmpName(e.target.value)}
                  placeholder="e.g. Aaliyah Khan"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={empEmail}
                  onChange={(e) => setEmpEmail(e.target.value)}
                  placeholder="aaliyah@acme.com"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Role Title *</label>
                <input
                  type="text"
                  required
                  value={empRole}
                  onChange={(e) => setEmpRole(e.target.value)}
                  placeholder="Senior Product Designer"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                <select
                  value={empDept}
                  onChange={(e) => setEmpDept(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                >
                  {company.departments.map((d) => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs"
                >
                  {isSubmitting ? 'Saving...' : 'Add to Company'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
