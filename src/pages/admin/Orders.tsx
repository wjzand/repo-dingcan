import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Download,
  Printer,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  Calendar,
  Users,
  ChefHat,
  MoreHorizontal,
  Eye,
  X as XIcon,
  Package,
} from "lucide-react";
import { useAppStore } from "@/store";
import {
  MEAL_TYPE_LABELS,
  ORDER_STATUS_LABELS,
  type MealType,
  type OrderStatus,
} from "@/types";
import { STALLS } from "@/data/mockData";

const statusColors: Record<OrderStatus, string> = {
  booked: "bg-warning-50 text-warning-600 border-warning-200",
  picked_up: "bg-success-50 text-success-600 border-success-200",
  no_show: "bg-danger-50 text-danger-600 border-danger-200",
  cancelled: "bg-gray-100 text-gray-500 border-gray-200",
};

export default function AdminOrders() {
  const getFilteredOrders = useAppStore((s) => s.getFilteredOrders);
  const markOrderPickedUp = useAppStore((s) => s.markOrderPickedUp);
  const markOrderNoShow = useAppStore((s) => s.markOrderNoShow);
  const todayStr = new Date().toISOString().split("T")[0];

  const [filters, setFilters] = useState({
    date: todayStr,
    mealType: "" as MealType | "",
    stallId: "" as string,
    status: "" as OrderStatus | "",
    keyword: "",
  });
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showDetail, setShowDetail] = useState<string | null>(null);

  const orders = useMemo(
    () =>
      getFilteredOrders({
        date: filters.date,
        mealType: filters.mealType || undefined,
        stallId: filters.stallId || undefined,
        status: filters.status || undefined,
        keyword: filters.keyword || undefined,
      }),
    [filters, getFilteredOrders]
  );

  const prepStats = useMemo(() => {
    const map = new Map<string, { name: string; qty: number; stall: string }>();
    orders.forEach((o) => {
      if (o.status !== "cancelled") {
        o.items.forEach((it) => {
          if (it.quantity > 0 && it.dishName && !it.dishName.startsWith("[套餐]")) {
            const key = it.dishName;
            if (!map.has(key)) {
              map.set(key, { name: key, qty: 0, stall: o.stallName });
            }
            map.get(key)!.qty += it.quantity;
          }
        });
      }
    });
    return Array.from(map.values()).sort((a, b) => b.qty - a.qty);
  }, [orders]);

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === orders.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(orders.map((o) => o.id)));
  };

  const batchMarkPicked = () => {
    selectedIds.forEach((id) => markOrderPickedUp(id));
    setSelectedIds(new Set());
  };

  const batchMarkNoShow = () => {
    selectedIds.forEach((id) => markOrderNoShow(id));
    setSelectedIds(new Set());
  };

  const detailOrder = orders.find((o) => o.id === showDetail);

  return (
    <div className="space-y-5">
      {/* 筛选区 */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={filters.keyword}
              onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
              placeholder="搜索订单号、姓名、工号、取餐码..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:bg-white transition-all"
            />
          </div>

          {[
            {
              key: "date",
              icon: Calendar,
              options: [{ label: "今天", value: todayStr }],
              type: "date",
            },
          ].map(() => (
            <div key="date" className="relative">
              <input
                type="date"
                value={filters.date}
                onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                className="px-3.5 py-2.5 bg-gray-50 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-300"
              />
            </div>
          ))}

          {[
            {
              key: "mealType",
              placeholder: "餐别",
              options: [
                { label: "全部餐别", value: "" },
                ...(["breakfast", "lunch", "dinner", "supper"] as MealType[]).map((m) => ({
                  label: MEAL_TYPE_LABELS[m],
                  value: m,
                })),
              ],
            },
            {
              key: "stallId",
              placeholder: "档口",
              options: [
                { label: "全部档口", value: "" },
                ...STALLS.map((s) => ({ label: s.name, value: s.id })),
              ],
            },
            {
              key: "status",
              placeholder: "状态",
              options: [
                { label: "全部状态", value: "" },
                ...(["booked", "picked_up", "no_show", "cancelled"] as OrderStatus[]).map((s) => ({
                  label: ORDER_STATUS_LABELS[s],
                  value: s,
                })),
              ],
            },
          ].map((sel) => (
            <select
              key={sel.key}
              value={(filters as any)[sel.key]}
              onChange={(e) => setFilters({ ...filters, [sel.key]: e.target.value })}
              className="px-3.5 py-2.5 bg-gray-50 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-300 appearance-none pr-8 cursor-pointer"
            >
              {sel.options.map((op) => (
                <option key={op.value} value={op.value}>
                  {op.label}
                </option>
              ))}
            </select>
          ))}

          <button className="p-2.5 bg-gray-50 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>

        {/* 备餐统计摘要 */}
        <div className="mt-4 pt-4 border-t border-gray-50 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "订单总数", value: orders.length, icon: Package, color: "text-blue-500", bg: "bg-blue-50" },
            {
              label: "已核销",
              value: orders.filter((o) => o.status === "picked_up").length,
              icon: CheckCircle2,
              color: "text-success-500",
              bg: "bg-success-50",
            },
            {
              label: "待取餐",
              value: orders.filter((o) => o.status === "booked").length,
              icon: Users,
              color: "text-warning-500",
              bg: "bg-warning-50",
            },
            {
              label: "未取餐",
              value: orders.filter((o) => o.status === "no_show").length,
              icon: AlertTriangle,
              color: "text-danger-500",
              bg: "bg-danger-50",
            },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl ${item.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-800 leading-tight">{item.value}</div>
                  <div className="text-[11px] text-gray-400">{item.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 操作条 */}
        <div className="mt-4 pt-4 border-t border-gray-50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedIds(new Set())}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                selectedIds.size > 0
                  ? "border-primary-200 bg-primary-50 text-primary-600"
                  : "border-gray-200 text-gray-500"
              }`}
            >
              已选 {selectedIds.size} / {orders.length}
            </button>
            {selectedIds.size > 0 && (
              <>
                <button
                  onClick={batchMarkPicked}
                  className="text-xs px-3 py-1.5 rounded-lg bg-success-500 hover:bg-success-600 text-white font-medium transition-colors"
                >
                  批量核销
                </button>
                <button
                  onClick={batchMarkNoShow}
                  className="text-xs px-3 py-1.5 rounded-lg bg-warning-500 hover:bg-warning-600 text-white font-medium transition-colors"
                >
                  标记未取餐
                </button>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
              <Printer className="w-3.5 h-3.5" />
              打印备餐单
            </button>
            <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
              <Download className="w-3.5 h-3.5" />
              导出
            </button>
            <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-primary-500 hover:bg-primary-600 text-white font-medium transition-colors">
              <QrCode className="w-3.5 h-3.5" />
              扫码核销
            </button>
          </div>
        </div>
      </div>

      {/* 备餐统计 */}
      {prepStats.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-primary-500" />
              <h3 className="font-bold text-gray-800">备餐统计</h3>
              <span className="text-xs text-gray-400">· 按当前筛选条件汇总</span>
            </div>
            <button className="text-xs text-primary-500 hover:text-primary-600">
              查看全部 →
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
            {prepStats.slice(0, 12).map((p) => (
              <div
                key={p.name}
                className="p-3 rounded-xl bg-gradient-to-br from-primary-50/80 to-white border border-primary-100/60"
              >
                <div className="text-xs text-gray-500 truncate">{p.name}</div>
                <div className="mt-1 text-2xl font-black text-primary-600 leading-tight">
                  {p.qty}
                  <span className="text-xs font-normal text-gray-400 ml-0.5">份</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 订单列表 */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === orders.length && orders.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded text-primary-500"
                  />
                </th>
                <th className="px-4 py-3 text-left font-semibold text-xs text-gray-500 uppercase tracking-wider">订单号</th>
                <th className="px-4 py-3 text-left font-semibold text-xs text-gray-500 uppercase tracking-wider">订餐人</th>
                <th className="px-4 py-3 text-left font-semibold text-xs text-gray-500 uppercase tracking-wider">部门</th>
                <th className="px-4 py-3 text-left font-semibold text-xs text-gray-500 uppercase tracking-wider">餐别/档口</th>
                <th className="px-4 py-3 text-left font-semibold text-xs text-gray-500 uppercase tracking-wider">菜品</th>
                <th className="px-4 py-3 text-left font-semibold text-xs text-gray-500 uppercase tracking-wider">取餐码</th>
                <th className="px-4 py-3 text-right font-semibold text-xs text-gray-500 uppercase tracking-wider">实付</th>
                <th className="px-4 py-3 text-center font-semibold text-xs text-gray-500 uppercase tracking-wider">状态</th>
                <th className="px-4 py-3 text-center font-semibold text-xs text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-16 text-center text-gray-400">
                    <Package className="w-12 h-12 mx-auto mb-3 text-gray-200" />
                    暂无匹配的订单
                  </td>
                </tr>
              ) : (
                orders.slice(0, 20).map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-4 py-3.5">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(o.id)}
                        onChange={() => toggleSelect(o.id)}
                        className="w-4 h-4 rounded text-primary-500"
                      />
                    </td>
                    <td className="px-4 py-3.5 font-mono text-xs text-gray-600">{o.orderNo}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600 text-xs font-bold">
                          {o.userName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-800 text-sm">{o.userName}</div>
                          <div className="text-[10px] text-gray-400">{o.employeeId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-gray-600">{o.department}</td>
                    <td className="px-4 py-3.5">
                      <div className="text-xs text-gray-700 font-medium">{MEAL_TYPE_LABELS[o.mealType]}</div>
                      <div className="text-[10px] text-gray-400 truncate max-w-[130px]">
                        {o.stallName.split("（")[0]}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="text-xs text-gray-700 truncate max-w-[180px]">
                        {o.items.filter(i => !i.comboId || i.dishName.startsWith("[套餐]")).map((i) => i.dishName).join("、")}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-block px-2.5 py-1 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-mono font-bold text-xs rounded-lg shadow-sm">
                        {o.pickupCode}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="font-bold text-gray-800">¥{o.actualAmount}</div>
                      <div className="text-[10px] text-primary-500">补贴 ¥{o.subsidyAmount}</div>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${statusColors[o.status]}`}
                      >
                        {ORDER_STATUS_LABELS[o.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setShowDetail(o.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-primary-500 hover:bg-primary-50 transition-colors"
                          title="查看详情"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {o.status === "booked" && (
                          <>
                            <button
                              onClick={() => markOrderPickedUp(o.id)}
                              className="p-1.5 rounded-lg text-success-500 hover:bg-success-50 transition-colors"
                              title="核销"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => markOrderNoShow(o.id)}
                              className="p-1.5 rounded-lg text-warning-500 hover:bg-warning-50 transition-colors"
                              title="未取餐"
                            >
                              <AlertTriangle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {orders.length > 20 && (
          <div className="px-5 py-3.5 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400">
            <span>显示 1-20 条，共 {orders.length} 条记录</span>
            <div className="flex items-center gap-1">
              <button className="px-2.5 py-1 rounded-lg border border-gray-200 hover:bg-gray-50">上一页</button>
              <button className="px-2.5 py-1 rounded-lg bg-primary-500 text-white">1</button>
              <button className="px-2.5 py-1 rounded-lg border border-gray-200 hover:bg-gray-50">2</button>
              <button className="px-2.5 py-1 rounded-lg border border-gray-200 hover:bg-gray-50">下一页</button>
            </div>
          </div>
        )}
      </div>

      {/* 订单详情弹窗 */}
      {showDetail && detailOrder && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6"
            onClick={() => setShowDetail(null)}
          >
            <div
              className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">订单详情</h3>
                  <button
                    onClick={() => setShowDetail(null)}
                    className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>
                <div className="font-mono text-sm text-primary-100">{detailOrder.orderNo}</div>
                <div className="mt-4 flex items-center gap-2">
                  <div className="text-5xl font-black tracking-wider">{detailOrder.pickupCode}</div>
                </div>
                <div className="mt-1 text-xs text-primary-100">取餐码</div>
              </div>
              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "订餐人", value: `${detailOrder.userName} (${detailOrder.employeeId})` },
                    { label: "部门", value: detailOrder.department },
                    { label: "餐别", value: MEAL_TYPE_LABELS[detailOrder.mealType] },
                    { label: "档口", value: detailOrder.stallName },
                    { label: "下单时间", value: detailOrder.bookedAt },
                    { label: "取餐时间", value: detailOrder.pickedUpAt || "-" },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="text-[11px] text-gray-400 mb-0.5">{item.label}</div>
                      <div className="text-sm text-gray-700 font-medium">{item.value}</div>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <div className="text-xs font-semibold text-gray-500 mb-2">菜品明细</div>
                  <div className="space-y-1.5">
                    {detailOrder.items.filter(i => i.dishName).map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between py-1.5">
                        <div className="text-sm text-gray-700">
                          {item.quantity > 1 ? `${item.quantity}x ` : ""}{item.dishName}
                        </div>
                        {item.unitPrice > 0 && (
                          <div className="text-sm text-gray-600">¥{item.actualPrice}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-100 space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">商品总额</span>
                    <span className="text-gray-700">¥{detailOrder.totalAmount}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">补贴抵扣</span>
                    <span className="text-primary-500">-¥{detailOrder.subsidyAmount}</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 mt-1 border-t border-gray-50">
                    <span className="font-medium text-gray-700">实付金额</span>
                    <span className="text-lg font-bold text-primary-600">¥{detailOrder.actualAmount}</span>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-2">
                <button
                  onClick={() => setShowDetail(null)}
                  className="px-4 py-2 text-sm rounded-xl border border-gray-200 text-gray-600 hover:bg-white transition-colors"
                >
                  关闭
                </button>
                {detailOrder.status === "booked" && (
                  <>
                    <button
                      onClick={() => {
                        markOrderPickedUp(detailOrder.id);
                        setShowDetail(null);
                      }}
                      className="px-4 py-2 text-sm rounded-xl bg-success-500 hover:bg-success-600 text-white font-medium transition-colors"
                    >
                      核销取餐
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
