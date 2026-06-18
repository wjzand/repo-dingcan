import { useState, useMemo } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Download,
  Calendar,
  Filter,
  FileSpreadsheet,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { useAppStore } from "@/store";
import { DAILY_STATS, DISH_SALES_RANK, STALL_STATS, DEPARTMENTS } from "@/data/mockData";

export default function AdminReports() {
  const orders = useAppStore((s) => s.orders);
  const [period, setPeriod] = useState<"day" | "week" | "month">("week");
  const [reportType, setReportType] = useState<"revenue" | "attendance" | "cost" | "user">("revenue");

  const revenueStats = useMemo(() => {
    const total = orders.reduce((s, o) => s + o.totalAmount, 0);
    const subsidy = orders.reduce((s, o) => s + o.subsidyAmount, 0);
    const self = total - subsidy;
    const orderCount = orders.length;
    const avgOrder = orderCount ? total / orderCount : 0;
    return { total, subsidy, self, orderCount, avgOrder };
  }, [orders]);

  const weekDays = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
  const maxRevenue = Math.max(...DAILY_STATS.map((d) => d.revenue));

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary-500" />
            统计报表中心
          </h2>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-xs font-medium transition-colors shadow-sm">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              导出Excel
            </button>
            <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-medium transition-colors">
              <Download className="w-3.5 h-3.5" />
              下载PDF
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-5">
          {[
            { id: "revenue", label: "营业收入", icon: DollarSign },
            { id: "attendance", label: "就餐率分析", icon: Users },
            { id: "cost", label: "成本核算", icon: PieChart },
            { id: "user", label: "消费统计", icon: TrendingUp },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setReportType(t.id as any)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                reportType === t.id
                  ? "bg-primary-500 text-white shadow-sm"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              <t.icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 p-3 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-1 p-1 bg-white rounded-lg shadow-sm">
            {(["day", "week", "month"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  period === p ? "bg-primary-50 text-primary-600" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {p === "day" ? "今日" : p === "week" ? "本周" : "本月"}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 bg-white rounded-lg text-xs text-gray-600 shadow-sm hover:bg-gray-50 transition-colors">
            <Calendar className="w-3.5 h-3.5" />
            自定义日期
          </button>
          <button className="p-2 bg-white rounded-lg text-gray-500 shadow-sm hover:bg-gray-50 transition-colors">
            <Filter className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {reportType === "revenue" && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                label: "总营收",
                value: `¥${revenueStats.total.toFixed(2)}`,
                trend: "+12.5%",
                up: true,
                color: "from-blue-500 to-blue-600",
                icon: DollarSign,
              },
              {
                label: "补贴金额",
                value: `¥${revenueStats.subsidy.toFixed(2)}`,
                trend: "+8.2%",
                up: true,
                color: "from-success-500 to-success-600",
                icon: TrendingUp,
              },
              {
                label: "自费金额",
                value: `¥${revenueStats.self.toFixed(2)}`,
                trend: "+15.3%",
                up: true,
                color: "from-warning-500 to-warning-600",
                icon: ArrowUpRight,
              },
              {
                label: "订单总数",
                value: revenueStats.orderCount,
                trend: "-2.1%",
                up: false,
                color: "from-purple-500 to-purple-600",
                icon: Users,
              },
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
                <div className={`flex items-center gap-1 text-[11px] mt-3 ${item.up ? "" : "opacity-90"}`}>
                  {item.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {item.trend} <span className="opacity-70 ml-1">vs 上周</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">营收趋势（近7日）</h3>
            <div className="h-56 flex items-end gap-2 sm:gap-3">
              {DAILY_STATS.map((d, i) => {
                const h = (d.revenue / maxRevenue) * 100;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full relative group cursor-pointer">
                      <div
                        className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] px-2 py-1 rounded-lg bg-gray-800 text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      >
                        ¥{d.revenue.toFixed(0)}
                      </div>
                      <div
                        className="w-full bg-gradient-to-t from-primary-500 to-primary-400 rounded-t-xl transition-all hover:from-primary-600 hover:to-primary-500"
                        style={{ height: `${h}%`, minHeight: "8px" }}
                      />
                    </div>
                    <div className="text-[10px] text-gray-400">{weekDays[i]}</div>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-50 text-[11px] text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-gradient-to-t from-primary-500 to-primary-400" />
                营业收入
              </span>
              <span>日均: ¥{(revenueStats.total / 7).toFixed(0)}</span>
              <span>峰值: ¥{maxRevenue.toFixed(0)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4">收入构成</h3>
              <div className="flex items-center gap-6">
                <div className="relative w-40 h-40 flex-shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="36" fill="none" stroke="#e5e7eb" strokeWidth="18" />
                    <circle
                      cx="50"
                      cy="50"
                      r="36"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="18"
                      strokeDasharray={`${(revenueStats.subsidy / revenueStats.total) * 226} 226`}
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="36"
                      fill="none"
                      stroke="#f97316"
                      strokeWidth="18"
                      strokeDasharray={`${(revenueStats.self / revenueStats.total) * 226} 226`}
                      strokeDashoffset={`${(revenueStats.subsidy / revenueStats.total) * 226}`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-[10px] text-gray-400">总收入</div>
                    <div className="text-lg font-black text-gray-800">¥{revenueStats.total.toFixed(0)}</div>
                  </div>
                </div>
                <div className="flex-1 space-y-3">
                  {[
                    { label: "补贴金额", value: revenueStats.subsidy, color: "bg-success-500", pct: (revenueStats.subsidy / revenueStats.total) * 100 },
                    { label: "自费金额", value: revenueStats.self, color: "bg-primary-500", pct: (revenueStats.self / revenueStats.total) * 100 },
                  ].map((r, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="flex items-center gap-1.5 text-gray-600">
                          <span className={`w-2.5 h-2.5 rounded ${r.color}`} />
                          {r.label}
                        </span>
                        <span className="font-semibold text-gray-800">¥{r.value.toFixed(2)}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full ${r.color} rounded-full`} style={{ width: `${r.pct}%` }} />
                      </div>
                      <div className="text-[10px] text-gray-400 mt-1 text-right">{r.pct.toFixed(1)}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4">档口销售排行</h3>
              <div className="space-y-3.5">
                {STALL_STATS.map((s, i) => {
                  const max = Math.max(...STALL_STATS.map((x) => x.revenue));
                  const pct = (s.revenue / max) * 100;
                  const colors = ["bg-primary-500", "bg-success-500", "bg-warning-500", "bg-purple-500"];
                  return (
                    <div key={s.id}>
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="flex items-center gap-2">
                          <span
                            className={`w-5 h-5 rounded-lg ${
                              i < 3 ? "bg-gradient-to-br from-yellow-400 to-yellow-500 text-white" : "bg-gray-100 text-gray-500"
                            } flex items-center justify-center text-[10px] font-black`}
                          >
                            {i + 1}
                          </span>
                          <span className="font-medium text-gray-700">{s.name}</span>
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-gray-400">{s.orderCount}单</span>
                          <span className="font-bold text-gray-800">¥{s.revenue.toFixed(0)}</span>
                        </div>
                      </div>
                      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full ${colors[i]} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}

      {reportType === "attendance" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">各部门就餐率</h3>
            <div className="space-y-3">
              {DEPARTMENTS.slice(0, 8).map((d, i) => {
                const rate = 60 + Math.random() * 35;
                return (
                  <div key={d.id} className="p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-medium text-gray-700">{d.name}</span>
                      <span
                        className={`font-bold ${
                          rate >= 85 ? "text-success-600" : rate >= 70 ? "text-primary-600" : "text-warning-600"
                        }`}
                      >
                        {rate.toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-2 bg-white rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          rate >= 85 ? "bg-success-500" : rate >= 70 ? "bg-primary-500" : "bg-warning-500"
                        }`}
                        style={{ width: `${rate}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-gray-400 mt-1.5">
                      <span>预订: {Math.floor(rate * 1.2)}人</span>
                      <span>取餐: {Math.floor(rate)}人</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">整体就餐趋势（近7日）</h3>
            <div className="h-64 flex items-end gap-2">
              {DAILY_STATS.map((d, i) => {
                const bookH = (d.booked / 300) * 100;
                const pickH = (d.pickedUp / 300) * 100;
                return (
                  <div key={i} className="flex-1 flex items-end gap-1">
                    <div
                      className="flex-1 bg-primary-200 rounded-t-md"
                      style={{ height: `${bookH}%`, minHeight: "4px" }}
                      title={`预订: ${d.booked}`}
                    />
                    <div
                      className="flex-1 bg-primary-500 rounded-t-md"
                      style={{ height: `${pickH}%`, minHeight: "4px" }}
                      title={`取餐: ${d.pickedUp}`}
                    />
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-50 text-[11px] text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-primary-200" />
                预订人数
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-primary-500" />
                实际取餐
              </span>
              <span>平均就餐率: {((DAILY_STATS.reduce((s, x) => s + x.pickedUp / x.booked, 0) / DAILY_STATS.length) * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      )}

      {reportType === "cost" && (
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">菜品成本与毛利分析（TOP10）</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-gray-500 text-xs">
                  <th className="text-left py-3 px-3 font-medium">排名</th>
                  <th className="text-left py-3 px-3 font-medium">菜品名称</th>
                  <th className="text-right py-3 px-3 font-medium">销量</th>
                  <th className="text-right py-3 px-3 font-medium">成本价</th>
                  <th className="text-right py-3 px-3 font-medium">售价</th>
                  <th className="text-right py-3 px-3 font-medium">单品毛利</th>
                  <th className="text-right py-3 px-3 font-medium">总毛利</th>
                  <th className="text-right py-3 px-3 font-medium">毛利率</th>
                </tr>
              </thead>
              <tbody>
                {DISH_SALES_RANK.slice(0, 10).map((d, i) => {
                  const cost = d.price * 0.45;
                  const profit = d.price - cost;
                  const totalProfit = profit * d.sales;
                  const rate = (profit / d.price) * 100;
                  return (
                    <tr key={d.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-3">
                        <span
                          className={`w-6 h-6 rounded-lg text-[11px] font-black flex items-center justify-center ${
                            i === 0
                              ? "bg-gradient-to-br from-yellow-400 to-yellow-500 text-white"
                              : i === 1
                              ? "bg-gradient-to-br from-gray-300 to-gray-400 text-white"
                              : i === 2
                              ? "bg-gradient-to-br from-orange-400 to-orange-500 text-white"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {i + 1}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-medium text-gray-800">{d.name}</td>
                      <td className="py-3 px-3 text-right text-gray-600">{d.sales}份</td>
                      <td className="py-3 px-3 text-right text-gray-600">¥{cost.toFixed(2)}</td>
                      <td className="py-3 px-3 text-right text-gray-800 font-medium">¥{d.price.toFixed(2)}</td>
                      <td className="py-3 px-3 text-right text-success-600 font-medium">¥{profit.toFixed(2)}</td>
                      <td className="py-3 px-3 text-right text-success-700 font-bold">¥{totalProfit.toFixed(0)}</td>
                      <td className="py-3 px-3 text-right">
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${rate >= 60 ? "bg-success-50 text-success-600" : rate >= 50 ? "bg-primary-50 text-primary-600" : "bg-warning-50 text-warning-600"}`}>
                          {rate.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {reportType === "user" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">个人消费排行 TOP8</h3>
            <div className="space-y-3">
              {["张伟", "李娜", "王芳", "刘洋", "陈静", "杨帆", "赵磊", "周敏"].map((name, i) => {
                const amount = 800 - i * 60 + Math.floor(Math.random() * 40);
                const times = 45 - i * 3 + Math.floor(Math.random() * 5);
                const max = 800;
                return (
                  <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${
                        i === 0
                          ? "bg-gradient-to-br from-yellow-400 to-yellow-500 text-white"
                          : i === 1
                          ? "bg-gradient-to-br from-gray-300 to-gray-400 text-white"
                          : i === 2
                          ? "bg-gradient-to-br from-orange-400 to-orange-500 text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {i + 1}
                    </div>
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center text-white text-xs font-bold">
                      {name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-800 truncate">{name}</span>
                        <span className="text-sm font-bold text-primary-600">¥{amount}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden flex-1 mr-3">
                          <div className="h-full bg-gradient-to-r from-primary-400 to-primary-500 rounded-full" style={{ width: `${(amount / max) * 100}%` }} />
                        </div>
                        <span className="text-[10px] text-gray-400 whitespace-nowrap">{times}次就餐</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">高频消费菜品</h3>
            <div className="space-y-2.5">
              {DISH_SALES_RANK.slice(0, 8).map((d, i) => (
                <div key={d.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <img src={d.image} alt={d.name} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-800 truncate">{d.name}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-50 text-primary-600">
                        {d.sales}次购买
                      </span>
                      <span className="text-[10px] text-gray-400">¥{d.price}/份</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-primary-600">¥{(d.sales * d.price).toFixed(0)}</div>
                    <div className="text-[10px] text-gray-400">累计消费</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
