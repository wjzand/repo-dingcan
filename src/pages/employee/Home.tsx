import { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Search,
  SlidersHorizontal,
  Clock,
  Flame,
  Sparkles,
  Package,
  Tag,
  Wallet,
  TrendingUp,
  Bell,
  X,
  Check,
} from "lucide-react";
import { useAppStore } from "@/store";
import { STALLS } from "@/data/mockData";
import { MEAL_TYPE_LABELS, type MealType } from "@/types";

const today = new Date();
const formatDate = (d: Date) => d.toISOString().split("T")[0];

function getDateOptions() {
  const dates = [];
  for (let i = 0; i < 3; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push({
      date: formatDate(d),
      label: i === 0 ? "今天" : i === 1 ? "明天" : "后天",
      weekday: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][d.getDay()],
      day: d.getDate(),
      month: d.getMonth() + 1,
    });
  }
  return dates;
}

const mealTypes: MealType[] = ["breakfast", "lunch", "dinner", "supper"];

export default function EmployeeHome() {
  const currentUser = useAppStore((s) => s.currentUser);
  const selectedDate = useAppStore((s) => s.selectedDate);
  const selectedMealType = useAppStore((s) => s.selectedMealType);
  const selectedStallId = useAppStore((s) => s.selectedStallId);
  const setSelectedDate = useAppStore((s) => s.setSelectedDate);
  const setSelectedMealType = useAppStore((s) => s.setSelectedMealType);
  const setSelectedStallId = useAppStore((s) => s.setSelectedStallId);
  const getMenuForDate = useAppStore((s) => s.getMenuForDate);
  const bookMenuItem = useAppStore((s) => s.bookMenuItem);
  const bookComboItem = useAppStore((s) => s.bookComboItem);
  const orders = useAppStore((s) => s.orders);

  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [spicyFilter, setSpicyFilter] = useState<string | null>(null);
  const [toast, setToast] = useState<{ show: boolean; type: "success" | "error"; message: string }>({
    show: false,
    type: "success",
    message: "",
  });

  const dateOptions = getDateOptions();
  const { items, combos } = getMenuForDate(selectedDate, selectedMealType, selectedStallId);

  const dateOffset = dateOptions.findIndex((d) => d.date === selectedDate);

  const shiftDate = (dir: number) => {
    const newIdx = Math.max(0, Math.min(dateOptions.length - 1, dateOffset + dir));
    if (newIdx !== dateOffset) {
      setSelectedDate(dateOptions[newIdx].date);
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter((mi) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !mi.dish.name.toLowerCase().includes(q) &&
          !mi.dish.ingredients.toLowerCase().includes(q) &&
          !mi.dish.tags.some((t) => t.name.includes(q))
        ) {
          return false;
        }
      }
      if (spicyFilter === "spicy" && !mi.dish.tags.some((t) => t.id === "t1")) return false;
      if (spicyFilter === "not_spicy" && !mi.dish.tags.some((t) => t.id === "t2")) return false;
      return true;
    });
  }, [items, searchQuery, spicyFilter]);

  const bookedOrder = useMemo(() => {
    if (!currentUser) return null;
    return orders.find(
      (o) =>
        o.userId === currentUser.id &&
        o.date === selectedDate &&
        o.mealType === selectedMealType &&
        (o.status === "booked" || o.status === "picked_up")
    );
  }, [orders, selectedDate, selectedMealType, currentUser]);

  const monthlyStats = useMemo(() => {
    if (!currentUser) return { count: 0, amount: 0 };
    const firstOfMonth = new Date();
    firstOfMonth.setDate(1);
    const start = formatDate(firstOfMonth);
    const userOrders = orders.filter(
      (o) =>
        o.userId === currentUser.id &&
        o.date >= start &&
        (o.status === "booked" || o.status === "picked_up")
    );
    return {
      count: userOrders.length,
      amount: userOrders.reduce((sum, o) => sum + o.actualAmount, 0),
    };
  }, [orders, currentUser]);

  const handleBook = (itemId: string, isCombo: boolean) => {
    const result = isCombo ? bookComboItem(itemId) : bookMenuItem(itemId);
    setToast({
      show: true,
      type: result.success ? "success" : "error",
      message: result.message,
    });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 2500);
  };

  return (
    <div className="px-4 py-4 space-y-4">
      {toast.show && (
        <div
        className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full shadow-xl flex items-center gap-2 text-sm font-medium animate-pulse ${
          toast.type === "success"
            ? "bg-success-500 text-white"
            : "bg-danger-500 text-white"
        }`}
      >
        {toast.type === "success" ? (
          <Check className="w-4 h-4" />
        ) : (
          <X className="w-4 h-4" />
        )}
        {toast.message}
      </div>
    )}

      {/* 日期选择条 */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => shiftDate(-1)}
          disabled={dateOffset === 0}
          className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 bg-white rounded-2xl p-1.5 shadow-sm flex gap-1">
          {dateOptions.map((d) => {
            const isActive = d.date === selectedDate;
            return (
              <button
                key={d.date}
                onClick={() => setSelectedDate(d.date)}
                className={`flex-1 py-2.5 px-2 rounded-xl transition-all ${
                  isActive
                    ? "bg-primary-500 text-white shadow-md"
                    : "hover:bg-gray-50 text-gray-600"
                }`}
              >
                <div className={`text-[11px] ${isActive ? "text-primary-100" : "text-gray-400"}`}>
                  {d.month}月{d.day}日 · {d.weekday}
                </div>
                <div className={`font-bold text-base mt-0.5 ${isActive ? "" : "text-gray-800"}`}>
                  {d.label}
                </div>
              </button>
            );
          })}
        </div>
        <button
          onClick={() => shiftDate(1)}
          disabled={dateOffset === dateOptions.length - 1}
          className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        <button
          className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-500 hover:bg-gray-50"
          title="选择日期"
        >
          <CalendarDays className="w-5 h-5" />
        </button>
      </div>

      {/* 信息卡片 */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-3.5 text-white shadow-md">
          <div className="flex items-center gap-1.5 text-primary-100 text-[11px]">
            <Wallet className="w-3.5 h-3.5" />
            <span>餐补余额</span>
          </div>
          <div className="text-xl font-bold mt-1">¥ {currentUser?.subsidyBalance?.toFixed(1) || 0}</div>
          <div className="text-[10px] text-primary-200 mt-0.5">
            自费 ¥{currentUser?.balance?.toFixed(1) || 0}
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-3.5 text-white shadow-md">
          <div className="flex items-center gap-1.5 text-blue-100 text-[11px]">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>本月消费</span>
          </div>
          <div className="text-xl font-bold mt-1">¥ {monthlyStats.amount.toFixed(1)}</div>
          <div className="text-[10px] text-blue-200 mt-0.5">{monthlyStats.count} 餐</div>
        </div>
        <div className="bg-gradient-to-br from-warning-500 to-warning-600 rounded-2xl p-3.5 text-white shadow-md relative overflow-hidden">
          <div className="flex items-center gap-1.5 text-warning-100 text-[11px]">
            <Bell className="w-3.5 h-3.5" />
            <span>未取餐</span>
          </div>
          <div className="text-xl font-bold mt-1">
            {orders.filter(
              (o) => o.userId === currentUser?.id && o.status === "booked" && o.date === formatDate(today)
            ).length}
          </div>
          <div className="text-[10px] text-warning-200 mt-0.5">
            {MEAL_TYPE_LABELS[selectedMealType]}
          </div>
          <Sparkles className="absolute -right-2 -bottom-2 w-10 h-10 text-white/10" />
        </div>
      </div>

      {/* 档口切换 */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        <button
          onClick={() => setSelectedStallId(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all shadow-sm ${
            selectedStallId === null
              ? "bg-gray-900 text-white"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          全部档口
        </button>
        {STALLS.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedStallId(s.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all shadow-sm ${
              selectedStallId === s.id
                ? "bg-primary-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            {s.name.replace(/（.*?）/, "")}
          </button>
        ))}
      </div>

      {/* 餐别Tab */}
      <div className="bg-white rounded-2xl p-1.5 shadow-sm flex gap-1">
        {mealTypes.map((mt) => {
          const count = items.filter((i) => i.mealType === mt).length + combos.filter((c) => c.mealType === mt).length;
          void count;
          const isActive = mt === selectedMealType;
          return (
            <button
              key={mt}
              onClick={() => setSelectedMealType(mt)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all relative ${
                isActive
                  ? "bg-primary-50 text-primary-600"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              {MEAL_TYPE_LABELS[mt]}
              {isActive && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* 搜索和筛选 */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            type="text"
            placeholder="搜索菜品、食材..."
            className="w-full pl-10 pr-4 py-3 bg-white rounded-xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`w-12 h-12 rounded-xl shadow-sm flex items-center justify-center transition-all ${
            showFilters || spicyFilter ? "bg-primary-500 text-white" : "bg-white text-gray-500 hover:bg-gray-50"
          }`}
        >
          <SlidersHorizontal className="w-5 h-5" />
        </button>
      </div>

      {showFilters && (
        <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3 animate-pulse-none">
          <div className="text-xs font-semibold text-gray-500">辣度选择</div>
          <div className="flex gap-2">
            <button
              onClick={() => setSpicyFilter(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                spicyFilter === null ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              全部
            </button>
            <button
              onClick={() => setSpicyFilter("spicy")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                spicyFilter === "spicy"
                  ? "bg-danger-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              🌶️ 辣
            </button>
            <button
              onClick={() => setSpicyFilter("not_spicy")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                spicyFilter === "not_spicy"
                  ? "bg-success-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              🥬 不辣
            </button>
          </div>
        </div>
      )}

      {/* 已预订提醒 */}
      {bookedOrder && (
        <div className="bg-gradient-to-r from-success-50 to-success-50/50 border border-success-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-11 h-11 bg-success-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
            <Check className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-800 text-sm">
              已预订{MEAL_TYPE_LABELS[bookedOrder.mealType]}
            </div>
            <div className="text-xs text-gray-500 mt-0.5 truncate">
              {bookedOrder.items.map((i) => i.dishName).join("、")} · 取餐码{" "}
              <span className="font-bold text-success-600">{bookedOrder.pickupCode}</span>
            </div>
          </div>
        </div>
      )}

      {/* 套餐推荐 */}
      {combos.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 bg-primary-500 rounded-full" />
              <h2 className="font-bold text-gray-800">推荐套餐</h2>
              <Tag className="w-4 h-4 text-warning-500" />
            </div>
          </div>
          <div className="space-y-3">
            {combos.map((combo) => {
              const progress = Math.min(100, (combo.bookedCount / combo.supplyLimit) * 100);
              const isBooked = bookedOrder?.items.some((i) => i.comboId === combo.id);
              return (
                <div
                  key={combo.id}
                  className="bg-white rounded-2xl shadow-card overflow-hidden hover:shadow-card-hover transition-shadow"
                >
                  <div className="flex">
                    <div className="w-32 h-32 flex-shrink-0">
                      <img
                        src={combo.image}
                        alt={combo.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex-1 p-3.5 flex flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-gray-800 text-base leading-snug">
                          {combo.name}
                        </h3>
                        <span className="text-[10px] px-2 py-0.5 bg-warning-50 text-warning-600 rounded-full font-medium whitespace-nowrap">
                          省¥{combo.originalPrice - combo.comboPrice}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {combo.description}
                      </p>
                      <div className="flex-1" />
                      <div className="flex items-end justify-between">
                        <div>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-lg font-bold text-danger-500">
                              ¥{combo.comboPrice}
                            </span>
                            <span className="text-[11px] text-gray-400 line-through">
                              ¥{combo.originalPrice}
                            </span>
                          </div>
                          <div className="text-[10px] text-primary-500 mt-0.5">
                            补贴后约 ¥{Math.max(1, combo.comboPrice - 10)}
                          </div>
                        </div>
                        {isBooked ? (
                          <button
                            disabled
                            className="px-4 py-2 rounded-xl text-sm font-medium bg-success-50 text-success-600 flex items-center gap-1"
                          >
                            <Check className="w-4 h-4" />
                            已订
                          </button>
                        ) : (
                          <button
                            onClick={() => handleBook(combo.id, true)}
                            className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-primary-500 hover:bg-primary-600 text-white shadow-md hover:shadow-lg transition-all"
                          >
                            立即预订
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="px-3.5 pb-3">
                    <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1.5">
                      <div className="flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        <span>已售 {combo.bookedCount}/{combo.supplyLimit}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>截止 {combo.deadline.slice(11, 16)}</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary-400 to-primary-500 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 菜品列表 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-success-500 rounded-full" />
            <h2 className="font-bold text-gray-800">
              单点菜品
              <span className="ml-1.5 text-sm font-normal text-gray-400">
                ({filteredItems.length})
              </span>
            </h2>
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">该时段暂无菜单，请切换其他日期或餐别</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((mi) => {
              const progress = Math.min(100, (mi.bookedCount / mi.supplyLimit) * 100);
              const isBooked = bookedOrder?.items.some((i) => i.menuItemId === mi.id);
              return (
                <div
                  key={mi.id}
                  className="bg-white rounded-2xl shadow-card overflow-hidden hover:shadow-card-hover transition-shadow"
                >
                  <div className="flex">
                    <div className="w-28 h-28 flex-shrink-0 relative">
                      <img
                        src={mi.dish.image}
                        alt={mi.dish.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      {mi.dish.tags.length > 0 && (
                        <div className="absolute top-1.5 left-1.5 flex flex-wrap gap-1">
                          {mi.dish.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag.id}
                              className="text-[9px] px-1.5 py-0.5 rounded-full text-white font-medium"
                              style={{ backgroundColor: tag.color }}
                            >
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 p-3 flex flex-col min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-bold text-gray-800 truncate">{mi.dish.name}</h3>
                      </div>
                      <div className="text-[11px] text-gray-400 mt-0.5 truncate">
                        食材：{mi.dish.ingredients}
                      </div>
                      <div className="flex-1" />
                      <div className="flex items-end justify-between mt-2">
                        <div>
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-lg font-bold text-gray-800">
                              ¥{mi.dish.price}
                            </span>
                          </div>
                          <div className="text-[10px] text-primary-500 mt-0.5 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            补贴后 ¥{mi.subsidyPrice || Math.max(1, mi.dish.price - 10)}
                          </div>
                        </div>
                        {isBooked ? (
                          <button
                            disabled
                            className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-success-50 text-success-600 flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            已订
                          </button>
                        ) : (
                          <button
                            onClick={() => handleBook(mi.id, false)}
                            className="px-4 py-2 rounded-lg text-xs font-semibold bg-primary-500 hover:bg-primary-600 text-white shadow-sm transition-all"
                          >
                            预订
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="px-3 pb-2.5">
                    <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1">
                      <span>
                        预订 {mi.bookedCount}/{mi.supplyLimit}
                      </span>
                      <span>截止 {mi.deadline.slice(11, 16)}</span>
                    </div>
                    <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-success-400 rounded-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="h-4" />
    </div>
  );
}
