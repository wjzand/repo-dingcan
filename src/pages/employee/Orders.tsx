import { useState, useMemo } from "react";
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChefHat,
  QrCode,
  X,
  ChevronRight,
  CalendarDays,
  Filter,
  Trash2,
} from "lucide-react";
import { useAppStore } from "@/store";
import {
  MEAL_TYPE_LABELS,
  ORDER_STATUS_LABELS,
  type OrderStatus,
} from "@/types";

const statusFilters: { key: OrderStatus | "all"; label: string; icon: typeof Calendar }[] = [
  { key: "all", label: "全部", icon: Calendar },
  { key: "booked", label: "已预订", icon: Clock },
  { key: "picked_up", label: "已核销", icon: CheckCircle2 },
  { key: "no_show", label: "未取餐", icon: AlertTriangle },
  { key: "cancelled", label: "已取消", icon: XCircle },
];

const statusColors: Record<OrderStatus, string> = {
  booked: "bg-warning-50 text-warning-600 border-warning-200",
  picked_up: "bg-success-50 text-success-600 border-success-200",
  no_show: "bg-danger-50 text-danger-600 border-danger-200",
  cancelled: "bg-gray-100 text-gray-500 border-gray-200",
};

const dotColors: Record<OrderStatus, string> = {
  booked: "bg-warning-500",
  picked_up: "bg-success-500",
  no_show: "bg-danger-500",
  cancelled: "bg-gray-400",
};

export default function EmployeeOrders() {
  const currentUser = useAppStore((s) => s.currentUser);
  const getUserOrders = useAppStore((s) => s.getUserOrders);
  const cancelOrder = useAppStore((s) => s.cancelOrder);
  const [activeFilter, setActiveFilter] = useState<OrderStatus | "all">("all");
  const [showQR, setShowQR] = useState<string | null>(null);
  const [toast, setToast] = useState<{ show: boolean; type: "success" | "error"; message: string }>({
    show: false,
    type: "success",
    message: "",
  });

  const userOrders = currentUser ? getUserOrders(currentUser.id) : [];

  const filteredOrders = useMemo(() => {
    if (activeFilter === "all") return userOrders;
    return userOrders.filter((o) => o.status === activeFilter);
  }, [userOrders, activeFilter]);

  const stats = useMemo(() => {
    return {
      booked: userOrders.filter((o) => o.status === "booked").length,
      picked_up: userOrders.filter((o) => o.status === "picked_up").length,
      no_show: userOrders.filter((o) => o.status === "no_show").length,
      cancelled: userOrders.filter((o) => o.status === "cancelled").length,
    };
  }, [userOrders]);

  const groupedByDate = useMemo(() => {
    const groups = new Map<string, typeof userOrders>();
    filteredOrders.forEach((o) => {
      if (!groups.has(o.date)) groups.set(o.date, []);
      groups.get(o.date)!.push(o);
    });
    return Array.from(groups.entries());
  }, [filteredOrders]);

  const handleCancel = (orderId: string) => {
    if (!window.confirm("确定要取消此订单吗？款项将原路退回。")) return;
    const result = cancelOrder(orderId);
    setToast({
      show: true,
      type: result.success ? "success" : "error",
      message: result.message,
    });
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 2500);
  };

  const formatDateLabel = (date: string) => {
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    if (date === today) return "今天";
    if (date === yesterday) return "昨天";
    const d = new Date(date);
    return `${d.getMonth() + 1}月${d.getDate()}日`;
  };

  return (
    <div className="px-4 py-4 space-y-4">
      {toast.show && (
        <div
          className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full shadow-xl flex items-center gap-2 text-sm font-medium ${
            toast.type === "success" ? "bg-success-500 text-white" : "bg-danger-500 text-white"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">我的订单</h1>
        <button className="flex items-center gap-1.5 text-xs text-gray-500">
          <CalendarDays className="w-4 h-4" />
          <Filter className="w-4 h-4" />
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-4 gap-2">
        {(["booked", "picked_up", "no_show", "cancelled"] as OrderStatus[]).map(
          (status) => (
            <div
              key={status}
              className="bg-white rounded-2xl p-3 text-center shadow-sm"
            >
              <div
                className={`text-2xl font-bold ${
                  status === "booked"
                    ? "text-warning-600"
                    : status === "picked_up"
                    ? "text-success-600"
                    : status === "no_show"
                    ? "text-danger-600"
                    : "text-gray-500"
                }`}
              >
                {stats[status]}
              </div>
              <div className="text-[11px] text-gray-400 mt-0.5">
                {ORDER_STATUS_LABELS[status]}
              </div>
            </div>
          )
        )}
      </div>

      {/* 筛选Tab */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
        {statusFilters.map((f) => {
          const Icon = f.icon;
          const isActive = activeFilter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap flex items-center gap-1.5 transition-all ${
                isActive
                  ? "bg-gray-900 text-white shadow-sm"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {f.label}
            </button>
          );
        })}
      </div>

      {groupedByDate.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center mt-8">
          <ChefHat className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-400">暂无订单记录</p>
          <p className="text-gray-300 text-xs mt-1">快去首页订餐吧～</p>
        </div>
      ) : (
        <div className="space-y-5">
          {groupedByDate.map(([date, orders]) => (
            <div key={date} className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                <Calendar className="w-3.5 h-3.5" />
                {formatDateLabel(date)}
                <span className="text-gray-300">·</span>
                <span className="font-normal">共{orders.length}单</span>
              </div>
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl shadow-card overflow-hidden"
                >
                  {/* 订单头部 */}
                  <div className="px-4 pt-3.5 pb-2.5 flex items-center justify-between border-b border-gray-50">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${dotColors[order.status]}`} />
                      <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${statusColors[order.status]}`}
                      >
                        {ORDER_STATUS_LABELS[order.status]}
                      </span>
                      <span className="text-xs text-gray-400">
                        {MEAL_TYPE_LABELS[order.mealType]}
                      </span>
                    </div>
                    <span className="text-[11px] text-gray-400">{order.orderNo}</span>
                  </div>

                  {/* 订单内容 */}
                  <div className="px-4 py-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                        <ChefHat className="w-5 h-5 text-primary-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        {order.items
                          .filter((i) => i.actualPrice > 0 || !i.comboId)
                          .map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between text-sm"
                            >
                              <span className="text-gray-700 truncate">
                                {item.quantity > 1 ? `${item.quantity}x ` : ""}
                                {item.dishName}
                              </span>
                              {item.unitPrice > 0 && (
                                <span className="text-gray-500 ml-2 flex-shrink-0">
                                  ¥{item.actualPrice}
                                </span>
                              )}
                            </div>
                          ))}
                        <div className="text-[11px] text-gray-400 mt-1">
                          {order.stallName}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 金额和操作 */}
                  <div className="px-4 py-3 border-t border-gray-50 bg-gray-50/50 flex items-center justify-between gap-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-xs text-gray-400">实付</span>
                      <span className="text-lg font-bold text-gray-800">
                        ¥{order.actualAmount}
                      </span>
                      <span className="text-[10px] text-primary-500">
                        (补贴¥{order.subsidyAmount})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {order.status === "booked" && (
                        <>
                          <button
                            onClick={() => setShowQR(order.id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-primary-50 text-primary-600 flex items-center gap-1 hover:bg-primary-100"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                            取餐码
                          </button>
                          <button
                            onClick={() => handleCancel(order.id)}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium text-danger-600 hover:bg-danger-50 flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            退订
                          </button>
                        </>
                      )}
                      {order.status === "picked_up" && (
                        <ChevronRight className="w-4 h-4 text-gray-300" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* 取餐码弹窗 */}
      {showQR && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6"
            onClick={() => setShowQR(null)}
          >
            <div
              className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-gray-800">取餐码</h3>
                <button
                  onClick={() => setShowQR(null)}
                  className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {(() => {
                const order = userOrders.find((o) => o.id === showQR);
                if (!order) return null;
                return (
                  <div className="text-center">
                    <div className="text-xs text-gray-500 mb-1">
                      {order.stallName}
                    </div>
                    <div className="text-sm text-gray-600 mb-4">
                      {MEAL_TYPE_LABELS[order.mealType]} ·{" "}
                      {order.items.find((i) => i.dishName.includes("套餐"))?.dishName ||
                        order.items.map((i) => i.dishName).slice(0, 2).join("、")}
                    </div>

                    {/* 大号取餐码 */}
                    <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-8 mb-5 shadow-lg">
                      <div className="text-primary-100 text-xs mb-2">取餐码</div>
                      <div className="text-6xl font-black text-white tracking-wider">
                        {order.pickupCode}
                      </div>
                    </div>

                    {/* 模拟二维码 */}
                    <div className="w-48 h-48 mx-auto bg-gray-100 rounded-xl p-3 mb-5">
                      <div className="w-full h-full bg-white border-2 border-gray-200 rounded-lg relative overflow-hidden flex items-center justify-center">
                        <div className="grid grid-cols-8 gap-0.5 p-2">
                          {Array.from({ length: 64 }).map((_, i) => {
                            const patterns = [0,1,2,3,5,8,13,21,34,55];
                            const isDark = patterns.some((p) => (i + p) % 3 === 0);
                            return (
                              <div
                                key={i}
                                className={`aspect-square rounded-sm ${
                                  isDark ? "bg-gray-800" : "bg-transparent"
                                }`}
                              />
                            );
                          })}
                        </div>
                      </div>
                      <div className="absolute inset-0 m-auto w-12 h-12 bg-white flex items-center justify-center">
                        <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                          <QrCode className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-gray-400 space-y-1">
                      <div>下单时间：{order.bookedAt}</div>
                      <div>请在取餐时出示此码</div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </>
      )}

      <div className="h-4" />
    </div>
  );
}
