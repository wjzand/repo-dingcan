import { useState, useMemo } from "react";
import {
  Building2,
  Plus,
  Search,
  Edit2,
  Trash2,
  ChevronRight,
  Users,
  Upload,
  FolderTree,
  MoreHorizontal,
  ChevronDown,
} from "lucide-react";
import { useAppStore } from "@/store";
import { DEPARTMENTS, USERS } from "@/data/mockData";

export default function AdminDepartments() {
  const users = useAppStore((s) => s.users);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [showModal, setShowModal] = useState(false);

  const employees = useMemo(() => users.filter((u) => u.role === "employee"), [users]);

  const topDepts = useMemo(() => {
    return DEPARTMENTS.filter((d) => !d.parentId).filter(
      (d) => !search || d.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const getChildDepts = (parentId: string) => {
    return DEPARTMENTS.filter((d) => d.parentId === parentId);
  };

  const getDeptEmployees = (deptId: string) => {
    return employees.filter((e) => e.deptId === deptId);
  };

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderDept = (dept: any, level: number = 0) => {
    const children = getChildDepts(dept.id);
    const deptEmps = getDeptEmployees(dept.id);
    const isExpanded = expanded[dept.id] ?? level < 1;
    const hasChildren = children.length > 0;

    return (
      <div key={dept.id}>
        <div
          className={`group flex items-center gap-3 p-3.5 rounded-xl hover:bg-gray-50 transition-colors ${
            level > 0 ? "ml-6 border-l-2 border-gray-100 pl-4" : ""
          }`}
        >
          <button
            onClick={() => hasChildren && toggleExpand(dept.id)}
            className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
              hasChildren ? "hover:bg-gray-200 text-gray-500" : "opacity-0"
            }`}
          >
            {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-100 to-primary-50 text-primary-500 flex items-center justify-center">
            <Building2 className="w-4.5 h-4.5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-semibold text-gray-800">{dept.name}</h4>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-50 text-primary-600 font-medium">
                {dept.code}
              </span>
            </div>
            <div className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Users className="w-2.5 h-2.5" />
                {deptEmps.length}人
              </span>
              {dept.manager && <span>负责人: {dept.manager}</span>}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-4 text-[11px] text-gray-400">
              <span>
                本月订餐 <span className="font-semibold text-gray-600">{deptEmps.length * 18}</span>次
              </span>
              <span>
                消费 <span className="font-semibold text-primary-600">¥{(deptEmps.length * 18 * 15).toFixed(0)}</span>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="w-7 h-7 rounded-lg hover:bg-white flex items-center justify-center text-gray-400 hover:text-primary-500 transition-colors shadow-sm">
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button className="w-7 h-7 rounded-lg hover:bg-white flex items-center justify-center text-gray-400 hover:text-danger-500 transition-colors shadow-sm">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <button className="w-7 h-7 rounded-lg hover:bg-white flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors shadow-sm">
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {isExpanded && hasChildren && (
          <div className="mt-1 space-y-1">
            {children.map((c) => renderDept(c, level + 1))}
          </div>
        )}

        {isExpanded && deptEmps.length > 0 && (
          <div className={`mt-1 ${level > 0 ? "ml-12" : "ml-12"} grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2`}>
            {deptEmps.slice(0, 12).map((emp) => (
              <div
                key={emp.id}
                className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                {emp.avatar ? (
                  <img src={emp.avatar} alt={emp.name} className="w-6 h-6 rounded-full object-cover" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center text-white text-[10px] font-bold">
                    {emp.name[0]}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-medium text-gray-700 truncate">{emp.name}</div>
                  <div className="text-[9px] text-gray-400 truncate">{emp.employeeId}</div>
                </div>
              </div>
            ))}
            {deptEmps.length > 12 && (
              <div className="flex items-center justify-center p-2 bg-gray-50 rounded-lg text-[11px] text-gray-400">
                +{deptEmps.length - 12}人
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "部门总数", value: DEPARTMENTS.length, color: "from-primary-500 to-primary-600", icon: Building2 },
          { label: "一级部门", value: topDepts.length, color: "from-success-500 to-success-600", icon: FolderTree },
          { label: "员工总数", value: employees.length, color: "from-blue-500 to-blue-600", icon: Users },
          { label: "人均部门人数", value: Math.round(employees.length / DEPARTMENTS.length), color: "from-purple-500 to-purple-600", icon: Building2 },
        ].map((item, i) => (
          <div key={i} className={`bg-gradient-to-br ${item.color} rounded-2xl p-4 text-white shadow-sm`}>
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[11px] opacity-80">{item.label}</div>
                <div className="text-2xl font-black mt-2">{item.value}</div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                <item.icon className="w-4.5 h-4.5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary-500" />
            部门架构管理
          </h2>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-medium transition-colors">
              <Upload className="w-3.5 h-3.5" />
              导入组织
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-xs font-medium transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              新增部门
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索部门名称..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:bg-white transition-all"
            />
          </div>
          <button className="px-4 py-2 text-xs font-medium text-primary-600 bg-primary-50 rounded-xl hover:bg-primary-100 transition-colors">
            全部展开
          </button>
          <button className="px-4 py-2 text-xs font-medium text-gray-600 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            全部收起
          </button>
        </div>

        <div className="space-y-2">
          {topDepts.map((d) => renderDept(d, 0))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6" onClick={() => setShowModal(false)}>
          <div
            className="bg-white rounded-3xl w-full max-w-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">新增部门</h3>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 text-xl"
              >
                ×
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">部门名称 *</label>
                <input
                  placeholder="如：产品研发部"
                  className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">部门编码 *</label>
                <input
                  placeholder="如：RND-001"
                  className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">上级部门</label>
                <select className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300">
                  <option value="">无（顶级部门）</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">部门负责人</label>
                <select className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300">
                  <option value="">请选择</option>
                  {employees.map((u) => (
                    <option key={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">备注说明</label>
                <textarea
                  rows={2}
                  placeholder="可选"
                  className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:bg-white transition-all resize-none"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/50">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-100 font-medium transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 rounded-xl text-sm bg-primary-500 hover:bg-primary-600 text-white font-medium transition-colors shadow-sm"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
