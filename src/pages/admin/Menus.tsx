import { useState, useMemo } from "react";
import {
  Plus,
  CalendarDays,
  ChefHat,
  Copy,
  Trash2,
  Edit2,
  Save,
  MoreHorizontal,
  Search,
  Clock,
  Eye,
  Download,
  Package,
} from "lucide-react";
import { useAppStore } from "@/store";
import { STALLS } from "@/data/mockData";
import { MEAL_TYPE_LABELS, type MealType } from "@/types";

export default function AdminMenus() {
  const menuItems = useAppStore((s) => s.menuItems);
  const comboItems = useAppStore((s) => s.comboItems);
  const dishes = useAppStore((s) => s.dishes);

  const todayStr = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedMeal, setSelectedMeal] = useState<MealType>("lunch");
  const [selectedStall, setSelectedStall] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);

  const filteredMenus = useMemo(() => {
    return menuItems.filter(
      (m) =>
        m.date === selectedDate &&
        m.mealType === selectedMeal &&
        (!selectedStall || m.stallId === selectedStall) &&
        (!searchQuery ||
          m.dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.dish.ingredients.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [menuItems, selectedDate, selectedMeal, selectedStall, searchQuery]);

  const filteredCombos = useMemo(() => {
    return comboItems.filter(
      (c) =>
        c.date === selectedDate &&
        c.mealType === selectedMeal &&
        (!selectedStall || c.stallId === selectedStall)
    );
  }, [comboItems, selectedDate, selectedMeal, selectedStall]);

  const stats = useMemo(() => {
    const items = filteredMenus;
    const totalBooked = items.reduce((s, m) => s + m.bookedCount, 0);
    const totalSupply = items.reduce((s, m) => s + m.supplyLimit, 0);
    return {
      dishCount: items.length,
      comboCount: filteredCombos.length,
      totalBooked,
      totalSupply,
      progress: totalSupply ? Math.round((totalBooked / totalSupply) * 100) : 0,
    };
  }, [filteredMenus, filteredCombos]);

  const dateOptions = [];
  for (let i = 0; i < 5; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    dateOptions.push({
      value: d.toISOString().split("T")[0],
      label:
        i === 0 ? "今天" : i === 1 ? "明天" : i === 2 ? "后天" : `${d.getMonth() + 1}/${d.getDate()}`,
      weekday: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"][d.getDay()],
    });
  }

  return (
    <div className="space-y-5">
      {/* 顶部操作区 */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-primary-500" />
            菜单管理
          </h2>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
              <Copy className="w-3.5 h-3.5" />
              复制上一天
            </button>
            <button className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
              <Download className="w-3.5 h-3.5" />
              导出菜单
            </button>
            <button
              onClick={() => setShowEditModal(true)}
              className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-medium transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              添加菜品
            </button>
          </div>
        </div>

        {/* 日期选择条 */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex items-center gap-1 p-1 bg-gray-50 rounded-xl">
            {dateOptions.map((d) => (
              <button
                key={d.value}
                onClick={() => setSelectedDate(d.value)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedDate === d.value
                    ? "bg-white text-primary-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {d.label}
                <span className="text-[10px] text-gray-400 ml-1">({d.weekday})</span>
              </button>
            ))}
            <div className="w-px h-5 bg-gray-200 mx-1" />
            <button className="p-1.5 text-gray-500 hover:text-primary-500 rounded-lg">
              <CalendarDays className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 min-w-[200px] relative max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索菜品..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* 餐别 + 档口筛选 */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-gray-50 rounded-xl">
            {(["breakfast", "lunch", "dinner", "supper"] as MealType[]).map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMeal(m)}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedMeal === m
                    ? "bg-white text-primary-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {MEAL_TYPE_LABELS[m]}
              </button>
            ))}
          </div>

          <select
            value={selectedStall}
            onChange={(e) => setSelectedStall(e.target.value)}
            className="px-3.5 py-2 bg-gray-50 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-300"
          >
            <option value="">全部档口</option>
            {STALLS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          {/* 概览统计 */}
          <div className="flex items-center gap-4 ml-auto text-xs">
            <div>
              <span className="text-gray-400">菜品: </span>
              <span className="font-semibold text-gray-700">{stats.dishCount}</span>
            </div>
            <div>
              <span className="text-gray-400">套餐: </span>
              <span className="font-semibold text-gray-700">{stats.comboCount}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-gray-400">预订进度:</span>
              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-400 to-primary-500 rounded-full"
                  style={{ width: `${stats.progress}%` }}
                />
              </div>
              <span className="font-semibold text-primary-600">{stats.progress}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 套餐区 */}
      {filteredCombos.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <Package className="w-4 h-4 text-warning-500" />
              套餐组合
            </h3>
            <button className="text-xs text-primary-500 hover:text-primary-600 font-medium">
              + 添加套餐
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {filteredCombos.map((c) => (
              <div
                key={c.id}
                className="group rounded-2xl border border-gray-100 overflow-hidden hover:border-primary-200 hover:shadow-md transition-all"
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img
                    src={c.image}
                    alt={c.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2 text-[10px] px-2 py-0.5 bg-warning-500 text-white rounded-full font-medium">
                    省¥{c.originalPrice - c.comboPrice}
                  </div>
                </div>
                <div className="p-3.5">
                  <h4 className="font-semibold text-gray-800 text-sm truncate">{c.name}</h4>
                  <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-2 min-h-[2em]">
                    {c.description}
                  </p>
                  <div className="mt-2.5 flex items-end justify-between">
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold text-primary-600">¥{c.comboPrice}</span>
                        <span className="text-[10px] text-gray-400 line-through">
                          ¥{c.originalPrice}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] text-gray-500">
                        已订 {c.bookedCount}/{c.supplyLimit}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 菜单表格 */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="px-5 py-3 text-left font-semibold text-xs text-gray-500 uppercase tracking-wider">
                  菜品
                </th>
                <th className="px-5 py-3 text-left font-semibold text-xs text-gray-500 uppercase tracking-wider">
                  食材
                </th>
                <th className="px-5 py-3 text-left font-semibold text-xs text-gray-500 uppercase tracking-wider">
                  档口
                </th>
                <th className="px-5 py-3 text-center font-semibold text-xs text-gray-500 uppercase tracking-wider">
                  价格/补贴
                </th>
                <th className="px-5 py-3 text-center font-semibold text-xs text-gray-500 uppercase tracking-wider">
                  数量
                </th>
                <th className="px-5 py-3 text-center font-semibold text-xs text-gray-500 uppercase tracking-wider">
                  截止时间
                </th>
                <th className="px-5 py-3 text-center font-semibold text-xs text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredMenus.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-20 text-center">
                    <ChefHat className="w-12 h-12 mx-auto mb-3 text-gray-200" />
                    <p className="text-gray-400 text-sm">该时段暂无菜单</p>
                    <button
                      onClick={() => setShowEditModal(true)}
                      className="mt-3 text-xs text-primary-500 hover:text-primary-600 font-medium"
                    >
                      + 立即添加菜品
                    </button>
                  </td>
                </tr>
              ) : (
                filteredMenus.map((m) => {
                  const pct = Math.round((m.bookedCount / m.supplyLimit) * 100);
                  const stall = STALLS.find((s) => s.id === m.stallId);
                  return (
                    <tr key={m.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                            <img
                              src={m.dish.image}
                              alt={m.dish.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800">{m.dish.name}</div>
                            <div className="flex items-center gap-1 mt-0.5">
                              {m.dish.tags.slice(0, 2).map((t) => (
                                <span
                                  key={t.id}
                                  className="text-[9px] px-1.5 py-0.5 rounded-full text-white"
                                  style={{ backgroundColor: t.color }}
                                >
                                  {t.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-gray-500 max-w-[200px] truncate">
                        {m.dish.ingredients}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="text-xs font-medium text-gray-700">
                          {stall?.name.split("（")[0]}
                        </div>
                        <div className="text-[10px] text-gray-400">{m.dish.category}</div>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <div className="font-bold text-gray-800">¥{m.dish.price}</div>
                        <div className="text-[10px] text-primary-500">
                          补贴后 ¥{m.subsidyPrice || Math.max(1, m.dish.price - 10)}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <div className="text-xs font-medium text-gray-700">
                          {m.bookedCount} / {m.supplyLimit}
                        </div>
                        <div className="w-24 mx-auto mt-1.5 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              pct >= 90
                                ? "bg-danger-500"
                                : pct >= 70
                                ? "bg-warning-500"
                                : "bg-success-500"
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className="text-[10px] text-gray-400 mt-0.5">{pct}%</div>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <div className="inline-flex items-center gap-1 text-xs text-gray-600">
                          <Clock className="w-3 h-3 text-gray-400" />
                          {m.deadline.slice(11, 16)}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <div className="flex items-center justify-center gap-0.5">
                          <button className="p-1.5 rounded-lg text-gray-400 hover:text-primary-500 hover:bg-primary-50 transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 rounded-lg text-gray-400 hover:text-warning-500 hover:bg-warning-50 transition-colors">
                            <Copy className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 rounded-lg text-gray-400 hover:text-danger-500 hover:bg-danger-50 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 菜品库快速选择 */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <ChefHat className="w-4 h-4 text-blue-500" />
            菜品库 · 快捷添加
          </h3>
          <button className="text-xs text-primary-500 hover:text-primary-600 font-medium">
            管理菜品库 →
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {dishes
            .filter((d) => d.isActive)
            .slice(0, 12)
            .map((d) => (
              <div
                key={d.id}
                className="group rounded-xl border border-gray-100 p-2 hover:border-primary-300 hover:shadow-sm transition-all cursor-pointer"
              >
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-2">
                  <img
                    src={d.image}
                    alt={d.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="text-xs font-medium text-gray-700 truncate">{d.name}</div>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-[10px] text-gray-400">{d.category}</span>
                  <span className="text-[11px] font-bold text-primary-600">¥{d.price}</span>
                </div>
                <button className="mt-2 w-full py-1.5 text-[11px] rounded-lg bg-primary-50 text-primary-600 font-medium hover:bg-primary-100 transition-colors flex items-center justify-center gap-1">
                  <Plus className="w-3 h-3" />
                  添加到菜单
                </button>
              </div>
            ))}
        </div>
      </div>

      {/* 添加菜品弹窗 */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6" onClick={() => setShowEditModal(false)}>
          <div
            className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl max-h-[85vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">添加菜品到菜单</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400"
              >
                ×
              </button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "日期", type: "date" },
                  { label: "餐别", type: "select", options: ["早餐", "午餐", "晚餐", "夜宵"] },
                  { label: "档口", type: "select", options: STALLS.map((s) => s.name) },
                  { label: "供应数量", type: "number", placeholder: "100" },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">{f.label}</label>
                    {f.type === "select" ? (
                      <select className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 border-0">
                        <option value="">请选择</option>
                        {f.options?.map((o) => (
                          <option key={o}>{o}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={f.type as any}
                        placeholder={f.placeholder as any}
                        className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 border-0"
                      />
                    )}
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">售价</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 border-0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">补贴后价格</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 border-0"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">选择菜品</label>
                <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto p-2 bg-gray-50 rounded-xl">
                  {dishes.slice(0, 8).map((d) => (
                    <div
                      key={d.id}
                      className="p-1.5 rounded-lg border-2 border-gray-200 hover:border-primary-300 cursor-pointer transition-all"
                    >
                      <img src={d.image} alt={d.name} className="w-full aspect-square object-cover rounded-md" />
                      <div className="text-[10px] text-center mt-1 text-gray-600 truncate">{d.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-5 py-2.5 text-sm rounded-xl border border-gray-200 text-gray-600 hover:bg-white transition-colors"
              >
                取消
              </button>
              <button className="px-5 py-2.5 text-sm rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-medium flex items-center gap-1.5 transition-colors">
                <Save className="w-4 h-4" />
                保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
