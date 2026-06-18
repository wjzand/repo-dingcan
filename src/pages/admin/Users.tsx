import { useState, useMemo } from "react";
import {
  Users,
  Plus,
  Search,
  Filter,
  Edit2,
  Shield,
  UserPlus,
  Upload,
  Download,
  MoreHorizontal,
  Phone,
  Mail,
  Building2,
  Badge,
} from "lucide-react";
import { useAppStore } from "@/store";
import { USERS, DEPARTMENTS, STALLS } from "@/data/mockData";
import { ROLE_LABELS } from "@/types";

export default function AdminUsers() {
  const users = useAppStore((s) => s.users);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [showModal, setShowModal] = useState(false);

  const filteredUsers = useMemo(() => {
    return users.filter(
      (u) =>
        (!search ||
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.employeeId.toLowerCase().includes(search.toLowerCase()) ||
          u.phone.includes(search)) &&
        (!deptFilter || u.deptId === deptFilter) &&
        (!roleFilter || u.role === roleFilter)
    );
  }, [users, search, deptFilter, roleFilter]);

  const roleCounts = useMemo(() => {
    const counts: any = {};
    users.forEach((u) => (counts[u.role] = (counts[u.role] || 0) + 1));
    return counts;
  }, [users]);

  const roleColors: any = {
    super_admin: "bg-red-50 text-red-600 border-red-200",
    canteen_manager: "bg-purple-50 text-purple-600 border-purple-200",
    stall_manager: "bg-warning-50 text-warning-600 border-warning-200",
    employee: "bg-primary-50 text-primary-600 border-primary-200",
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "员工总数", value: users.length, color: "from-blue-500 to-blue-600", icon: Users },
          { label: "普通员工", value: roleCounts.employee || 0, color: "from-primary-500 to-primary-600", icon: Badge },
          { label: "档口负责人", value: roleCounts.stall_manager || 0, color: "from-warning-500 to-warning-600", icon: Shield },
          { label: "食堂管理员", value: (roleCounts.canteen_manager || 0) + (roleCounts.super_admin || 0), color: "from-purple-500 to-purple-600", icon: UserPlus },
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
            <Users className="w-5 h-5 text-primary-500" />
            用户管理
          </h2>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-medium transition-colors">
              <Download className="w-3.5 h-3.5" />
              导入
            </button>
            <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-medium transition-colors">
              <Upload className="w-3.5 h-3.5" />
              导出
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-xs font-medium transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              新增员工
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div className="flex-1 min-w-[200px] max-w-sm relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索姓名、工号、手机号..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:bg-white transition-all"
            />
          </div>
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3.5 py-2 bg-gray-50 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-300"
          >
            <option value="">全部部门</option>
            {DEPARTMENTS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3.5 py-2 bg-gray-50 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-300"
          >
            <option value="">全部角色</option>
            {Object.entries(ROLE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
          <button className="p-2 bg-gray-50 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full text-sm min-w-[768px]">
            <thead>
              <tr className="border-b border-gray-100 text-gray-500 text-xs">
                <th className="text-left py-3 px-2 font-medium">员工信息</th>
                <th className="text-left py-3 px-2 font-medium">工号</th>
                <th className="text-left py-3 px-2 font-medium">部门/档口</th>
                <th className="text-left py-3 px-2 font-medium">角色</th>
                <th className="text-left py-3 px-2 font-medium">联系方式</th>
                <th className="text-right py-3 px-2 font-medium">账户余额</th>
                <th className="text-left py-3 px-2 font-medium">状态</th>
                <th className="text-right py-3 px-2 font-medium">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => {
                const dept = DEPARTMENTS.find((d) => d.id === u.deptId);
                const stall = STALLS.find((s) => s.id === u.stallId);
                return (
                  <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2.5">
                        {u.avatar ? (
                          <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-full object-cover" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center text-white text-sm font-bold">
                            {u.name[0]}
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-gray-800">{u.name}</div>
                          <div className="text-[10px] text-gray-400">入职: 2023-01-15</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-gray-600 font-mono text-xs">{u.employeeId}</td>
                    <td className="py-3 px-2">
                      <div className="text-xs text-gray-700">
                        {dept?.name || "-"}
                        {stall && (
                          <div className="text-[10px] text-warning-600 flex items-center gap-1 mt-0.5">
                            <Building2 className="w-2.5 h-2.5" />
                            {stall.name}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <span
                        className={`text-[10px] px-2 py-1 rounded-lg font-medium border ${roleColors[u.role]}`}
                      >
                        {ROLE_LABELS[u.role]}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1 text-[11px] text-gray-500">
                          <Phone className="w-2.5 h-2.5" />
                          {u.phone}
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-gray-400">
                          <Mail className="w-2.5 h-2.5" />
                          {u.email}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <div className="text-sm font-bold text-gray-800">¥{u.balance.toFixed(2)}</div>
                      <div className="text-[10px] text-success-600">餐补¥{u.subsidyBalance.toFixed(2)}</div>
                    </td>
                    <td className="py-3 px-2">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          u.isActive ? "bg-success-50 text-success-600" : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {u.isActive ? "在职" : "已停用"}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-primary-500 transition-colors">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-warning-500 transition-colors">
                          <Shield className="w-3.5 h-3.5" />
                        </button>
                        <button className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6" onClick={() => setShowModal(false)}>
          <div
            className="bg-white rounded-3xl w-full max-w-xl shadow-2xl max-h-[85vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">新增员工</h3>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 text-xl"
              >
                ×
              </button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">姓名 *</label>
                  <input
                    placeholder="请输入姓名"
                    className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">工号 *</label>
                  <input
                    placeholder="系统自动生成"
                    className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">手机号 *</label>
                  <input
                    placeholder="请输入手机号"
                    className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">邮箱</label>
                  <input
                    placeholder="请输入邮箱"
                    className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">所属部门 *</label>
                  <select className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300">
                    <option>请选择部门</option>
                    {DEPARTMENTS.map((d) => (
                      <option key={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">角色 *</label>
                  <select className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300">
                    {Object.entries(ROLE_LABELS).map(([k, v]) => (
                      <option key={k}>{v}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">初始余额</label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    placeholder="自费余额（元）"
                    className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:bg-white transition-all"
                  />
                  <input
                    type="number"
                    placeholder="餐补余额（元）"
                    className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:bg-white transition-all"
                  />
                </div>
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
