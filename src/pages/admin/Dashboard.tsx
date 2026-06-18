import { useMemo } from "react";
import {
  TrendingUp,
  Users,
  AlertTriangle,
  DollarSign,
  Wallet,
  ChefHat,
  UtensilsCrossed,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  ShoppingCart,
  Package,
  Flame,
} from "lucide-react";
import { useAppStore } from "@/store";
import { DAILY_STATS, DISH_SALES_RANK, STALL_STATS, STALLS } from "@/data/mockData";
import { MEAL_TYPE_LABELS, type MealType } from "@/types";

export default function AdminDashboard() {
  const orders = useAppStore((s) => s.orders);
  const todayStr = new Date().toISOString().split("T")[0];

  const stats = useMemo(() => {
    const todayOrders = orders.filter((o) => o.date === todayStr);
    return {
      total: todayOrders.length,
      pickedUp: todayOrders.filter((o) => o.status === "picked_up").length,
      booked: todayOrders.filter((o) => o.status === "booked").length,
      noShow: todayOrders.filter((o) => o.status === "no_show").length,
      totalAmount: todayOrders.reduce((s, o) => s + o.totalAmount, 0),
      subsidyAmount: todayOrders.reduce((s, o) => s + o.subsidyAmount, 0),
      actualAmount: todayOrders.reduce((s, o) => s + o.actualAmount, 0),
      bookingRate: Math.min(100, Math.round((todayOrders.length / 250) * 100)),
      pickupRate: todayOrders.length ? Math.round((todayOrders.filter(o => o.status === "picked_up").length / todayOrders.filter(o => o.status !== "cancelled").length) * 100) : 0,
    };
  }, [orders, todayStr]);

  const mealBreakdown = useMemo(() => {
    const meals: MealType[] = ["breakfast", "lunch", "dinner", "supper"];
    return meals.map((m) => ({
      meal: m,
      booked: orders.filter((o) => o.date === todayStr && o.mealType === m && o.status !== "cancelled").length,
      pickedUp: orders.filter((o) => o.date === todayStr && o.mealType === m && o.status === "picked_up").length,
    }));
  }, [orders, todayStr]);

  const maxMeal = Math.max(...mealBreakdown.map(m => m.booked), 1);
  const maxRankQty = Math.max(...DISH_SALES_RANK.map(d => d.quantity), 1);
  const maxStallRevenue = Math.max(...STALL_STATS.map(s => s.revenue), 1);

  return (
    <div className="space-y-6">
      {/* 顶部统计卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "今日预订总数",
            value: stats.total,
            sub: `预订率 ${stats.bookingRate}%`,
            icon: ShoppingCart,
            color: "from-blue-500 to-blue-600",
            bgIcon: "bg-blue-50",
            iconColor: "text-blue-500",
            trend: "+12%",
            trendUp: true,
          },
          {
            label: "已取餐",
            value: stats.pickedUp,
            sub: `取餐率 ${stats.pickupRate}%`,
            icon: Package,
            color: "from-success-500 to-success-600",
            bgIcon: "bg-success-50",
            iconColor: "text-success-500",
            trend: "+8%",
            trendUp: true,
          },
          {
            label: "未取餐",
            value: stats.noShow + stats.booked,
            sub: `待取 ${stats.booked} · 异常 ${stats.noShow}`,
            icon: AlertTriangle,
            color: "from-warning-500 to-warning-600",
            bgIcon: "bg-warning-50",
            iconColor: "text-warning-500",
            trend: "-5%",
            trendUp: false,
          },
          {
            label: "订单金额汇总",
            value: `¥${stats.actualAmount.toFixed(0)}`,
            sub: `补贴 ¥${stats.subsidyAmount.toFixed(0)}`,
            icon: DollarSign,
            color: "from-primary-500 to-primary-600",
            bgIcon: "bg-primary-50",
            iconColor: "text-primary-500",
            trend: "+15%",
            trendUp: true,
          },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl ${card.bgIcon} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${card.iconColor}`} />
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${card.trendUp ? "text-success-600" : "text-danger-600"}`}>
                  {card.trendUp ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  {card.trend}
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-800">{card.value}</div>
              <div className="text-xs text-gray-400 mt-1.5">{card.sub}</div>
              <div className="mt-4 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${card.color}`}
                  style={{ width: `${i === 0 ? stats.bookingRate : i === 1 ? stats.pickupRate : i === 2 ? 35 : 78}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* 中间图表区 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 就餐率曲线（餐别对比） */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-gray-800">今日就餐情况</h3>
              <p className="text-xs text-gray-400 mt-0.5">分餐别预订与实际取餐对比</p>
            </div>
            <button className="p-1.5 hover:bg-gray-50 rounded-lg">
              <MoreHorizontal className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="space-y-5">
            {mealBreakdown.map((m) => {
              const pct = Math.round((m.booked / maxMeal) * 100);
              const pickupPct = m.booked ? Math.round((m.pickedUp / m.booked) * 100) : 0;
              return (
                <div key={m.meal}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-20 font-medium text-sm text-gray-700">
                        {MEAL_TYPE_LABELS[m.meal]}
                      </div>
                      <div className="text-xs text-gray-400">
                        <span className="font-semibold text-gray-600">{m.booked}</span> 预订 ·
                        <span className="font-semibold text-success-600 ml-1">{m.pickedUp}</span> 取餐
                      </div>
                    </div>
                    <div className="text-xs font-medium text-primary-600">{pickupPct}%</div>
                  </div>
                  <div className="relative h-9 bg-gray-50 rounded-xl overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-400 to-primary-500 rounded-xl flex items-center"
                      style={{ width: `${pct}%`, minWidth: m.booked > 0 ? "3rem" : 0 }}
                    >
                      {m.booked > 0 && (
                        <div className="ml-2.5 flex items-center gap-2">
                          <Users className="w-3.5 h-3.5 text-white/80" />
                          <span className="text-xs font-semibold text-white">{m.booked}</span>
                        </div>
                      )}
                    </div>
                    <div
                      className="absolute inset-y-0 left-0 bg-success-500/60 rounded-xl"
                      style={{ width: `${m.booked ? (m.pickedUp / maxMeal) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* 7日趋势 */}
          <div className="mt-8 pt-6 border-t border-gray-50">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-gray-700">近7日趋势</h4>
              <div className="flex items-center gap-4 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-primary-500" />
                  <span className="text-gray-500">预订数</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-success-500" />
                  <span className="text-gray-500">取餐数</span>
                </div>
              </div>
            </div>
            <div className="h-36 flex items-end justify-between gap-2">
              {DAILY_STATS.map((d) => {
                const dayTotal = d.breakfast.booked + d.lunch.booked + d.dinner.booked;
                const dayPicked = d.breakfast.pickedUp + d.lunch.pickedUp + d.dinner.pickedUp;
                const maxDay = Math.max(...DAILY_STATS.map(s => s.breakfast.booked + s.lunch.booked + s.dinner.booked), 1);
                const totalPct = Math.max(4, (dayTotal / maxDay) * 100);
                const pickedPct = Math.max(4, (dayPicked / maxDay) * 100);
                return (
                  <div key={d.date} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex items-end justify-center gap-1 h-28">
                      <div
                        className="w-3.5 bg-gradient-to-t from-primary-500 to-primary-400 rounded-t-md transition-all"
                        style={{ height: `${totalPct}%` }}
                        title={`预订: ${dayTotal}`}
                      />
                      <div
                        className="w-3.5 bg-gradient-to-t from-success-500 to-success-400 rounded-t-md transition-all"
                        style={{ height: `${pickedPct}%` }}
                        title={`取餐: ${dayPicked}`}
                      />
                    </div>
                    <div className="text-[10px] text-gray-400">
                      {d.date.slice(5)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 菜品销量TOP10 */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-gray-800">菜品销量TOP</h3>
              <p className="text-xs text-gray-400 mt-0.5">今日销售排行</p>
            </div>
            <Flame className="w-5 h-5 text-warning-500" />
          </div>

          <div className="space-y-3.5">
            {DISH_SALES_RANK.slice(0, 8).map((d, i) => {
              const pct = Math.max(8, (d.quantity / maxRankQty) * 100);
              const rankColors = [
                "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white",
                "bg-gradient-to-r from-gray-300 to-gray-400 text-white",
                "bg-gradient-to-r from-amber-600 to-amber-700 text-white",
              ];
              return (
                <div key={d.dishId}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold ${
                          i < 3 ? rankColors[i] : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {i + 1}
                      </div>
                      <span className="text-sm text-gray-700 font-medium truncate max-w-[110px]">
                        {d.dishName}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-gray-800">{d.quantity}</div>
                      <div className="text-[10px] text-gray-400">¥{d.revenue.toFixed(0)}</div>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-50 rounded-full overflow-hidden ml-8">
                    <div
                      className={`h-full rounded-full ${
                        i === 0
                          ? "bg-gradient-to-r from-yellow-400 to-warning-500"
                          : i === 1
                          ? "bg-gradient-to-r from-gray-400 to-gray-500"
                          : i === 2
                          ? "bg-gradient-to-r from-amber-600 to-amber-700"
                          : "bg-gradient-to-r from-primary-400 to-primary-500"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 底部区域：档口对比 + 快捷入口 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 档口对比 */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-gray-800">档口对比</h3>
              <p className="text-xs text-gray-400 mt-0.5">销售额与订单数横向对比</p>
            </div>
            <select className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 focus:outline-none focus:border-primary-300">
              <option>今日</option>
              <option>本周</option>
              <option>本月</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {STALL_STATS.map((s) => {
              const revenuePct = Math.max(8, (s.revenue / maxStallRevenue) * 100);
              const orderPct = Math.max(8, (s.orderCount / Math.max(...STALL_STATS.map(x => x.orderCount), 1)) * 100);
              return (
                <div key={s.stallId} className="p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-primary-50 flex items-center justify-center">
                        <ChefHat className="w-5 h-5 text-primary-500" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-gray-800">
                          {STALLS.find(st => st.id === s.stallId)?.name.split("（")[0] || s.stallName}
                        </div>
                        <div className="text-[10px] text-gray-400">
                          {s.stallName.split("（")[1]?.replace("）", "") || "主食堂"}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] text-gray-400">销售额</span>
                        <span className="text-xs font-bold text-gray-700">¥{s.revenue.toFixed(0)}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary-400 to-primary-500 rounded-full"
                          style={{ width: `${revenuePct}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] text-gray-400">订单数</span>
                        <span className="text-xs font-bold text-gray-700">{s.orderCount}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-success-400 to-success-500 rounded-full"
                          style={{ width: `${orderPct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 快捷入口 + 异常提醒 */}
        <div className="space-y-4">
          {/* 快捷入口 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">快捷入口</h3>
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { icon: UtensilsCrossed, label: "菜单管理", color: "text-primary-500", bg: "bg-primary-50" },
                { icon: Package, label: "备餐统计", color: "text-blue-500", bg: "bg-blue-50" },
                { icon: Wallet, label: "补贴发放", color: "text-success-500", bg: "bg-success-50" },
                { icon: TrendingUp, label: "报表导出", color: "text-purple-500", bg: "bg-purple-50" },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <button
                    key={i}
                    className={`${item.bg} rounded-xl p-3 flex flex-col items-center gap-1.5 hover:shadow-sm transition-all`}
                  >
                    <Icon className={`w-6 h-6 ${item.color}`} />
                    <span className="text-xs font-medium text-gray-700">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 异常提醒 */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800">异常提醒</h3>
              <span className="w-2 h-2 rounded-full bg-danger-500 animate-pulse" />
            </div>
            <div className="space-y-2.5">
              {[
                { type: "warning", title: "未取餐数量异常", desc: "一号档口午餐未取餐 12 份" },
                { type: "danger", title: "预订量超备餐", desc: "红烧肉预订 156 份，超备餐 56 份" },
                { type: "info", title: "备餐提醒", desc: "早餐备餐截止时间已到 30 分钟" },
              ].map((a, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl flex items-start gap-2.5 ${
                    a.type === "warning"
                      ? "bg-warning-50"
                      : a.type === "danger"
                      ? "bg-danger-50"
                      : "bg-blue-50"
                  }`}
                >
                  <AlertTriangle
                    className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                      a.type === "warning"
                        ? "text-warning-500"
                        : a.type === "danger"
                        ? "text-danger-500"
                        : "text-blue-500"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-gray-800">{a.title}</div>
                    <div className="text-[11px] text-gray-500 mt-0.5">{a.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
