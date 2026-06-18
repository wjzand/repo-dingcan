import { useState, useMemo } from "react";
import {
  Gift,
  Plus,
  Users,
  Calendar,
  Filter,
  History,
  Settings2,
  ChevronRight,
  Search,
  Check,
  DollarSign,
  Clock,
  FileText,
} from "lucide-react";
import { useAppStore } from "@/store";
import { SUBSIDY_RULES, DEPARTMENTS, USERS } from "@/data/mockData";
import { SUBSIDY_RULE_TYPE_LABELS } from "@/types";

export default function AdminSubsidy() {
  const subsidyRecords = useAppStore((s) => s.subsidyRecords);
  const users = useAppStore((s) => s.users);
  const grantSubsidy = useAppStore((s) => s.grantSubsidy);

  const [activeTab, setActiveTab] = useState<"rules" | "grant" | "records">("rules");
  const [search, setSearch] = useState("");
  const [showGrantModal, setShowGrantModal] = useState(false);
  const [grantForm, setGrantForm] = useState({
    type: "per_meal",
    amount: 15,
    deptId: "",
    userId: "",
    reason: "",
  });

  const employees = useMemo(() => users.filter((u) => u.role === "employee"), [users]);

  const filteredRecords = useMemo(() => {
    return subsidyRecords.filter(
      (r) =>
        !search ||
        r.userName.toLowerCase().includes(search.toLowerCase()) ||
        r.ruleName.toLowerCase().includes(search.toLowerCase())
    );
  }, [subsidyRecords, search]);

  const totalSubsidy = subsidyRecords.reduce((s, r) => s + r.amount, 0);
  const totalUsed = subsidyRecords.reduce((s, r) => s + r.usedAmount, 0);

  const handleGrant = () => {
    const targets = grantForm.userId
      ? [users.find((u) => u.id === grantForm.userId)].filter(Boolean)
      : grantForm.deptId
      ? users.filter((u) => u.deptId === grantForm.deptId && u.role === "employee")
      : employees;
    targets.forEach((u: any) => {
      grantSubsidy({
        userId: u.id,
        amount: grantForm.amount,
        ruleType: grantForm.type as any,
        ruleName: grantForm.reason || "手动发放补贴",
      });
    });
    setShowGrantModal(false);
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "补贴余额总额", value: `¥${(totalSubsidy - totalUsed).toFixed(2)}`, color: "from-primary-500 to-primary-600", icon: DollarSign },
          { label: "累计发放金额", value: `¥${totalSubsidy.toFixed(2)}`, color: "from-success-500 to-success-600", icon: Gift },
          { label: "已使用金额", value: `¥${totalUsed.toFixed(2)}`, color: "from-warning-500 to-warning-600", icon: Check },
          { label: "补贴规则数", value: SUBSIDY_RULES.length, color: "from-purple-500 to-purple-600", icon: Settings2 },
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
          <div className="flex items-center gap-1 p-1 bg-gray-50 rounded-xl">
            {[
              { id: "rules", label: "补贴规则", icon: Settings2 },
              { id: "grant", label: "发放补贴", icon: Gift },
              { id: "records", label: "发放记录", icon: History },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                  activeTab === t.id ? "bg-white text-primary-600 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <t.icon className="w-3.5 h-3.5" />
                {t.label}
              </button>
            ))}
          </div>
          {activeTab === "grant" && (
            <button
              onClick={() => setShowGrantModal(true)}
              className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-medium transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              批量发放
            </button>
          )}
        </div>

        {activeTab === "rules" && (
          <div className="space-y-3">
            {SUBSIDY_RULES.map((r) => (
              <div
                key={r.id}
                className="group p-4 border border-gray-100 rounded-2xl hover:border-primary-200 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        r.type === "per_meal"
                          ? "bg-primary-50 text-primary-500"
                          : r.type === "per_day"
                          ? "bg-success-50 text-success-500"
                          : r.type === "per_month"
                          ? "bg-warning-50 text-warning-500"
                          : "bg-purple-50 text-purple-500"
                      }`}
                    >
                      {r.type === "per_meal" ? (
                        <Gift className="w-5 h-5" />
                      ) : r.type === "per_day" ? (
                        <Calendar className="w-5 h-5" />
                      ) : r.type === "per_month" ? (
                        <FileText className="w-5 h-5" />
                      ) : (
                        <Users className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-gray-800">{r.name}</h4>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                            r.isActive ? "bg-success-50 text-success-600" : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {r.isActive ? "启用中" : "已停用"}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 font-medium">
                          {SUBSIDY_RULE_TYPE_LABELS[r.type]}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1.5">{r.description}</div>
                      <div className="flex items-center gap-4 mt-2 text-[11px] text-gray-400">
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          标准: ¥{r.amount}
                          {r.type === "per_meal" ? "/餐" : r.type === "per_day" ? "/工作日" : "/月"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          适用: {r.applicableRoles.length > 2 ? "全员" : r.applicableRoles.join("、")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="px-3 py-1.5 rounded-lg text-[11px] bg-gray-50 hover:bg-gray-100 text-gray-600 font-medium transition-colors">
                      编辑
                    </button>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "grant" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { name: "按次补贴发放", desc: "每人每餐补贴¥15", type: "per_meal", amount: 15, color: "primary" },
                { name: "工作日日补发放", desc: "每天补贴¥20，共22天", type: "per_day", amount: 440, color: "success" },
                { name: "月度补贴发放", desc: "每月1日发放¥500", type: "per_month", amount: 500, color: "warning" },
                { name: "临时特殊补贴", desc: "加班餐补等临时发放", type: "special", amount: 50, color: "purple" },
              ].map((t, i) => {
                const colors: any = {
                  primary: "border-primary-200 bg-primary-50/50 hover:border-primary-400",
                  success: "border-success-200 bg-success-50/50 hover:border-success-400",
                  warning: "border-warning-200 bg-warning-50/50 hover:border-warning-400",
                  purple: "border-purple-200 bg-purple-50/50 hover:border-purple-400",
                };
                const textColors: any = {
                  primary: "text-primary-600",
                  success: "text-success-600",
                  warning: "text-warning-600",
                  purple: "text-purple-600",
                };
                return (
                  <button
                    key={i}
                    onClick={() => {
                      setGrantForm({ ...grantForm, type: t.type, amount: t.amount, reason: t.name });
                      setShowGrantModal(true);
                    }}
                    className={`text-left p-4 rounded-2xl border-2 ${colors[t.color]} transition-all group`}
                  >
                    <div className={`text-lg font-black ${textColors[t.color]} mb-1`}>¥{t.amount}</div>
                    <div className="text-sm font-semibold text-gray-800 mb-0.5">{t.name}</div>
                    <div className="text-[11px] text-gray-400">{t.desc}</div>
                    <div className="flex items-center gap-1 mt-2 text-[11px] text-gray-500 group-hover:translate-x-0.5 transition-transform">
                      点击快速发放 <ChevronRight className="w-3 h-3" />
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="border border-gray-100 rounded-2xl p-4">
              <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Users className="w-4 h-4 text-primary-500" />
                选择发放对象
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-3">
                {DEPARTMENTS.slice(0, 6).map((d) => {
                  const count = employees.filter((e) => e.deptId === d.id).length;
                  return (
                    <label
                      key={d.id}
                      className="flex items-center gap-2.5 p-3 rounded-xl border border-gray-100 hover:border-primary-300 cursor-pointer transition-colors"
                    >
                      <input type="checkbox" className="w-4 h-4 rounded text-primary-500" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-800 truncate">{d.name}</div>
                        <div className="text-[11px] text-gray-400">{count}名员工</div>
                      </div>
                    </label>
                  );
                })}
              </div>
              <button className="w-full py-2.5 rounded-xl border-2 border-dashed border-gray-200 text-xs text-gray-500 hover:border-primary-300 hover:text-primary-500 transition-colors">
                + 展开全部部门（共{DEPARTMENTS.length}个）
              </button>
            </div>
          </div>
        )}

        {activeTab === "records" && (
          <>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="flex-1 min-w-[200px] max-w-sm relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="搜索姓名、补贴规则..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:bg-white transition-all"
                />
              </div>
              <select className="px-3.5 py-2 bg-gray-50 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-300">
                <option>全部类型</option>
                <option>按次补贴</option>
                <option>按日补贴</option>
                <option>按月补贴</option>
              </select>
              <button className="p-2 bg-gray-50 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors">
                <Filter className="w-4 h-4" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-500 text-xs">
                    <th className="text-left py-3 px-3 font-medium">员工</th>
                    <th className="text-left py-3 px-3 font-medium">补贴规则</th>
                    <th className="text-right py-3 px-3 font-medium">发放金额</th>
                    <th className="text-right py-3 px-3 font-medium">已使用</th>
                    <th className="text-left py-3 px-3 font-medium">发放时间</th>
                    <th className="text-left py-3 px-3 font-medium">有效期</th>
                    <th className="text-left py-3 px-3 font-medium">状态</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((r) => {
                    const remain = r.amount - r.usedAmount;
                    return (
                      <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center text-white text-xs font-bold">
                              {r.userName[0]}
                            </div>
                            <div>
                              <div className="font-medium text-gray-800">{r.userName}</div>
                              <div className="text-[10px] text-gray-400">
                                {DEPARTMENTS.find((d) => d.id === users.find((u) => u.id === r.userId)?.deptId)?.name || "-"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-gray-600">{r.ruleName}</td>
                        <td className="py-3 px-3 text-right font-medium text-gray-800">¥{r.amount.toFixed(2)}</td>
                        <td className="py-3 px-3 text-right">
                          <div className="text-success-600 font-medium text-xs">¥{r.usedAmount.toFixed(2)}</div>
                          <div className="text-[10px] text-gray-400">余¥{remain.toFixed(2)}</div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="text-xs text-gray-600">{r.grantedAt.split(" ")[0]}</div>
                          <div className="text-[10px] text-gray-400">{r.grantedAt.split(" ")[1]}</div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1 text-[11px] text-gray-500">
                            <Clock className="w-3 h-3" />
                            {r.expireAt.split(" ")[0]}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                              remain > 0 ? "bg-success-50 text-success-600" : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {remain > 0 ? "可用" : "已用尽"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {showGrantModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6" onClick={() => setShowGrantModal(false)}>
          <div
            className="bg-white rounded-3xl w-full max-w-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">批量发放补贴</h3>
              <p className="text-[11px] text-gray-400 mt-1">请选择发放范围和金额</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">补贴类型</label>
                <select
                  value={grantForm.type}
                  onChange={(e) => setGrantForm({ ...grantForm, type: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                >
                  <option value="per_meal">按次补贴</option>
                  <option value="per_day">按日补贴</option>
                  <option value="per_month">按月补贴</option>
                  <option value="special">特殊补贴</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">金额（元/人）</label>
                <input
                  type="number"
                  value={grantForm.amount}
                  onChange={(e) => setGrantForm({ ...grantForm, amount: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">发放范围</label>
                <select
                  value={grantForm.deptId}
                  onChange={(e) => setGrantForm({ ...grantForm, deptId: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 mb-2"
                >
                  <option value="">全部员工</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
                <select
                  value={grantForm.userId}
                  onChange={(e) => setGrantForm({ ...grantForm, userId: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                >
                  <option value="">（可选）指定单个员工</option>
                  {employees.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} - {u.employeeId}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">发放说明</label>
                <input
                  value={grantForm.reason}
                  onChange={(e) => setGrantForm({ ...grantForm, reason: e.target.value })}
                  placeholder="例：2024年1月餐补"
                  className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:bg-white transition-all"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50/50">
              <button
                onClick={() => setShowGrantModal(false)}
                className="px-5 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-100 font-medium transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleGrant}
                className="px-5 py-2.5 rounded-xl text-sm bg-primary-500 hover:bg-primary-600 text-white font-medium transition-colors shadow-sm"
              >
                确认发放
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
