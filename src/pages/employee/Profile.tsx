import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import {
  User,
  Building2,
  Mail,
  Phone,
  ChevronRight,
  Settings,
  HelpCircle,
  Shield,
  LogOut,
  FileText,
  Bell,
  Moon,
  UserCog,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  Package,
  AlertTriangle,
  DollarSign,
  Flame,
  ChefHat,
} from "lucide-react";
import { useAppStore } from "@/store";
import { DAILY_STATS, DISH_SALES_RANK, STALL_STATS, STALLS } from "@/data/mockData";
import { MEAL_TYPE_LABELS, type MealType } from "@/types";

const menuGroups = [
  {
    label: "账户",
    items: [
      {
        icon: FileText,
        label: "我的消费报告",
        desc: "查看月度消费统计",
        color: "text-blue-500",
        bg: "bg-blue-50",
      },
      {
        icon: Bell,
        label: "消息通知设置",
        desc: "订餐提醒、余额提醒",
        color: "text-warning-500",
        bg: "bg-warning-50",
      },
    ],
  },
  {
    label: "服务",
    items: [
      {
        icon: UserCog,
        label: "申请访客餐",
        desc: "为访客申请临时就餐码",
        color: "text-success-500",
        bg: "bg-success-50",
      },
      {
        icon: HelpCircle,
        label: "帮助与反馈",
        desc: "常见问题、意见建议",
        color: "text-purple-500",
        bg: "bg-purple-50",
      },
      {
        icon: Shield,
        label: "隐私与安全",
        desc: "账户安全设置",
        color: "text-danger-500",
        bg: "bg-danger-50",
      },
      {
        icon: Settings,
        label: "系统设置",
        desc: "通用偏好设置",
        color: "text-gray-500",
        bg: "bg-gray-100",
      },
      {
        icon: Moon,
        label: "深色模式",
        desc: "跟随系统或手动切换",
        color: "text-indigo-500",
        bg: "bg-indigo-50",
        toggle: true,
      },
    ],
  },
];

export default function EmployeeProfile() {
  const navigate = useNavigate();
  const currentUser = useAppStore((s) => s.currentUser);
  const orders = useAppStore((s) => s.orders);
  const logout = useAppStore((s) => s.logout);
  const switchViewMode = useAppStore((s) => s.switchViewMode);

  const todayStr = new Date().toISOString().split("T")[0];

  const dashboardStats = useMemo(() => {
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
      pickupRate: todayOrders.length
        ? Math.round(
            (todayOrders.filter((o) => o.status === "picked_up").length /
              todayOrders.filter((o) => o.status !== "cancelled").length) *
              100
          )
        : 0,
    };
  }, [orders, todayStr]);

  const mealBreakdown = useMemo(() => {
    const meals: MealType[] = ["breakfast", "lunch", "dinner", "supper"];
    return meals.map((m) => ({
      meal: m,
      booked: orders.filter(
        (o) => o.date === todayStr && o.mealType === m && o.status !== "cancelled"
      ).length,
      pickedUp: orders.filter(
        (o) => o.date === todayStr && o.mealType === m && o.status === "picked_up"
      ).length,
    }));
  }, [orders, todayStr]);

  const maxMeal = Math.max(...mealBreakdown.map((m) => m.booked), 1);
  const maxRankQty = Math.max(...DISH_SALES_RANK.map((d) => d.quantity), 1);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="px-4 py-4 space-y-4">
      <h1 className="text-xl font-bold text-gray-800">个人中心</h1>

      {/* 用户卡片 */}
      <div className="bg-white rounded-3xl p-5 shadow-card">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
            <span className="text-white text-2xl font-bold">
              {currentUser?.name?.charAt(0)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-gray-800 truncate">
                {currentUser?.name}
              </h2>
              <span className="px-2 py-0.5 bg-primary-50 text-primary-600 text-[10px] rounded-full font-medium">
                正式员工
              </span>
            </div>
            <div className="mt-2 space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <User className="w-3.5 h-3.5 flex-shrink-0" />
                <span>工号：{currentUser?.employeeId}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{currentUser?.department}</span>
              </div>
              {currentUser?.phone && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{currentUser.phone}</span>
                </div>
              )}
              {currentUser?.email && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{currentUser.email}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end">
          <button className="px-4 py-2 bg-primary-50 text-primary-600 rounded-xl text-xs font-medium hover:bg-primary-100 transition-colors">
          编辑资料
        </button>
        </div>
      </div>

      {/* 快捷数据 */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "累计订餐", value: "128", unit: "次", color: "text-primary-600", bg: "bg-primary-50" },
          { label: "节省餐费", value: "1,280", unit: "元", color: "text-success-600", bg: "bg-success-50" },
          { label: "连续打卡", value: "23", unit: "天", color: "text-warning-600", bg: "bg-warning-50" },
        ].map((item, idx) => (
          <div key={idx} className={`${item.bg} rounded-2xl p-3.5`}>
            <div className={`text-2xl font-black ${item.color}`}>
              {item.value}
              <span className="text-xs font-medium text-gray-400 ml-0.5">{item.unit}</span>
            </div>
            <div className="text-[11px] text-gray-500 mt-0.5">{item.label}</div>
          </div>
        ))}
      </div>

      {/* 数据看板 */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-primary-500 rounded-full" />
            <h2 className="font-bold text-gray-800 text-sm">今日数据看板</h2>
          </div>
          <button
            onClick={() => {
              switchViewMode("admin");
              navigate("/admin/dashboard");
            }}
            className="text-xs text-primary-500 flex items-center gap-0.5"
          >
            查看详情 <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {[
            { label: "今日预订", value: dashboardStats.total, icon: ShoppingCart, color: "text-blue-500", bg: "bg-blue-50" },
            { label: "已取餐", value: dashboardStats.pickedUp, icon: Package, color: "text-success-500", bg: "bg-success-50" },
            { label: "未取餐", value: dashboardStats.booked + dashboardStats.noShow, icon: AlertTriangle, color: "text-warning-500", bg: "bg-warning-50" },
            { label: "订单金额", value: `¥${dashboardStats.actualAmount.toFixed(0)}`, icon: DollarSign, color: "text-primary-500", bg: "bg-primary-50" },
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <div key={i} className={`${card.bg} rounded-2xl p-3.5`}>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Icon className={`w-4 h-4 ${card.color}`} />
                  <span className="text-[11px] text-gray-500">{card.label}</span>
                </div>
                <div className={`text-xl font-bold ${card.color}`}>{card.value}</div>
              </div>
            );
          })}
        </div>

        {/* 就餐率 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mt-2.5">
          <div className="text-xs font-semibold text-gray-700 mb-3">分餐别就餐情况</div>
          <div className="space-y-2.5">
            {mealBreakdown.map((m) => {
              const pct = Math.round((m.booked / maxMeal) * 100);
              const pickupPct = m.booked ? Math.round((m.pickedUp / m.booked) * 100) : 0;
              return (
                <div key={m.meal}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600 font-medium">{MEAL_TYPE_LABELS[m.meal]}</span>
                    <span className="text-[10px] text-gray-400">
                      {m.booked}预订 · {m.pickedUp}取餐 · {pickupPct}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-400 to-primary-500 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 菜品销量TOP5 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mt-2.5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-warning-500" />
              <span className="text-xs font-semibold text-gray-700">菜品销量TOP5</span>
            </div>
          </div>
          <div className="space-y-2">
            {DISH_SALES_RANK.slice(0, 5).map((d, i) => {
              const pct = Math.max(8, (d.quantity / maxRankQty) * 100);
              const rankColors = [
                "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white",
                "bg-gradient-to-r from-gray-300 to-gray-400 text-white",
                "bg-gradient-to-r from-amber-600 to-amber-700 text-white",
              ];
              return (
                <div key={d.dishId} className="flex items-center gap-2">
                  <div
                    className={`w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold ${
                      i < 3 ? rankColors[i] : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <span className="text-xs text-gray-700 flex-1 truncate">{d.dishName}</span>
                  <span className="text-xs font-bold text-gray-800">{d.quantity}份</span>
                  <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        i === 0
                          ? "bg-gradient-to-r from-yellow-400 to-warning-500"
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

        {/* 7日趋势 */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mt-2.5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-700">近7日趋势</span>
            <div className="flex items-center gap-3 text-[10px]">
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded bg-primary-500" />
                <span className="text-gray-400">预订</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded bg-success-500" />
                <span className="text-gray-400">取餐</span>
              </div>
            </div>
          </div>
          <div className="h-24 flex items-end justify-between gap-1">
            {DAILY_STATS.map((d) => {
              const dayTotal = d.breakfast.booked + d.lunch.booked + d.dinner.booked;
              const dayPicked = d.breakfast.pickedUp + d.lunch.pickedUp + d.dinner.pickedUp;
              const maxDay = Math.max(
                ...DAILY_STATS.map((s) => s.breakfast.booked + s.lunch.booked + s.dinner.booked),
                1
              );
              const totalPct = Math.max(4, (dayTotal / maxDay) * 100);
              const pickedPct = Math.max(4, (dayPicked / maxDay) * 100);
              return (
                <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex items-end justify-center gap-0.5 h-18">
                    <div
                      className="w-2.5 bg-gradient-to-t from-primary-500 to-primary-400 rounded-t"
                      style={{ height: `${totalPct}%` }}
                    />
                    <div
                      className="w-2.5 bg-gradient-to-t from-success-500 to-success-400 rounded-t"
                      style={{ height: `${pickedPct}%` }}
                    />
                  </div>
                  <div className="text-[9px] text-gray-400">{d.date.slice(8)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 菜单分组 */}
      {menuGroups.map((group) => (
        <div key={group.label}>
          <div className="px-1 mb-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            {group.label}
          </div>
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-50">
            {group.items.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  className="w-full px-4 py-3.5 flex items-center gap-3.5 hover:bg-gray-50 transition-colors text-left"
                >
                  <div
                    className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-800">
                      {item.label}
                    </div>
                    <div className="text-[11px] text-gray-400 mt-0.5">
                      {item.desc}
                    </div>
                  </div>
                  {item.toggle ? (
                    <div className="w-11 h-6 bg-gray-200 rounded-full p-0.5">
                      <div className="w-5 h-5 bg-white rounded-full shadow-sm ml-auto" />
                    </div>
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* 切换到管理端（演示用） */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <button
          onClick={() => {
            switchViewMode("admin");
            navigate("/admin/dashboard");
          }}
          className="w-full px-4 py-3.5 flex items-center gap-3.5 hover:bg-gray-50 transition-colors text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-blue-500" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-800">
              切换到管理端
            </div>
            <div className="text-[11px] text-gray-400">
              演示模式 · 体验管理功能
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
        </button>
      </div>

      {/* 退出登录 */}
      <button
        onClick={handleLogout}
        className="w-full bg-white rounded-2xl py-3.5 flex items-center justify-center gap-2 text-danger-500 font-medium text-sm hover:bg-danger-50 transition-colors shadow-sm"
      >
        <LogOut className="w-4 h-4" />
        退出登录
      </button>

      <div className="text-center text-xs text-gray-300 py-4">
        智慧食堂 v1.0.0
      </div>
      <div className="h-4" />
    </div>
  );
}
