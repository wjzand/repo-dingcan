import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Upload,
  Filter,
  ToggleLeft,
  ToggleRight,
  ChefHat,
  Save,
} from "lucide-react";
import { useAppStore } from "@/store";
import { DISH_TAGS, STALLS } from "@/data/mockData";

export default function AdminDishes() {
  const dishes = useAppStore((s) => s.dishes);
  const toggleDishActive = useAppStore((s) => s.toggleDishActive);

  const [search, setSearch] = useState("");
  const [stallFilter, setStallFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [showModal, setShowModal] = useState(false);

  const categories = useMemo(() => {
    const set = new Set(dishes.map((d) => d.category));
    return Array.from(set);
  }, [dishes]);

  const filteredDishes = useMemo(() => {
    return dishes.filter(
      (d) =>
        (!search || d.name.toLowerCase().includes(search.toLowerCase())) &&
        (!stallFilter || d.stallId === stallFilter) &&
        (!categoryFilter || d.category === categoryFilter)
    );
  }, [dishes, search, stallFilter, categoryFilter]);

  const stats = {
    total: dishes.length,
    active: dishes.filter((d) => d.isActive).length,
    inactive: dishes.filter((d) => !d.isActive).length,
    categories: categories.length,
  };

  return (
    <div className="space-y-5">
      {/* 概览 + 筛选 */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <ChefHat className="w-5 h-5 text-primary-500" />
            菜品库管理
          </h2>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 text-xs px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-medium transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            新增菜品
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {[
            { label: "菜品总数", value: stats.total, color: "text-blue-500", bg: "bg-blue-50" },
            { label: "在售菜品", value: stats.active, color: "text-success-500", bg: "bg-success-50" },
            { label: "已下架", value: stats.inactive, color: "text-gray-500", bg: "bg-gray-100" },
            { label: "分类数", value: stats.categories, color: "text-warning-500", bg: "bg-warning-50" },
          ].map((item, i) => (
            <div key={i} className={`${item.bg} rounded-2xl p-4`}>
              <div className={`text-2xl font-black ${item.color}`}>{item.value}</div>
              <div className="text-[11px] text-gray-500 mt-0.5">{item.label}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px] max-w-sm relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索菜品名称、食材..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:bg-white transition-all"
            />
          </div>
          <select
            value={stallFilter}
            onChange={(e) => setStallFilter(e.target.value)}
            className="px-3.5 py-2 bg-gray-50 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-300"
          >
            <option value="">全部档口</option>
            {STALLS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3.5 py-2 bg-gray-50 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-300"
          >
            <option value="">全部分类</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <button className="p-2 bg-gray-50 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 菜品列表卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredDishes.map((d) => {
          const stall = STALLS.find((s) => s.id === d.stallId);
          return (
            <div
              key={d.id}
              className={`bg-white rounded-2xl shadow-sm overflow-hidden group ${
                !d.isActive ? "opacity-60" : ""
              }`}
            >
              <div className="aspect-[4/3] overflow-hidden relative bg-gray-100">
                <img
                  src={d.image}
                  alt={d.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                {!d.isActive && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-xs px-3 py-1 rounded-full bg-gray-800 text-white font-medium">
                      已下架
                    </span>
                  </div>
                )}
                <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                  {d.tags.slice(0, 2).map((t) => (
                    <span
                      key={t.id}
                      className="text-[9px] px-1.5 py-0.5 rounded-full text-white font-medium"
                      style={{ backgroundColor: t.color }}
                    >
                      {t.name}
                    </span>
                  ))}
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
                  <button className="w-7 h-7 rounded-lg bg-white/95 shadow flex items-center justify-center text-gray-600 hover:text-primary-500">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button className="w-7 h-7 rounded-lg bg-white/95 shadow flex items-center justify-center text-gray-600 hover:text-danger-500">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="p-3.5">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-gray-800 text-sm truncate">{d.name}</h4>
                  <div className="text-base font-black text-primary-600 flex-shrink-0">
                    ¥{d.price}
                  </div>
                </div>
                <div className="text-[11px] text-gray-400 mt-1">
                  成本: ¥{d.costPrice} · 毛利: ¥{(d.price - d.costPrice).toFixed(1)}
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                  <div className="text-[10px] text-gray-400 truncate max-w-[60%]">
                    {stall?.name.split("（")[0]}
                  </div>
                  <button
                    onClick={() => toggleDishActive(d.id)}
                    className="text-gray-400 hover:text-primary-500 transition-colors"
                  >
                    {d.isActive ? (
                      <ToggleRight className="w-6 h-6 text-success-500" />
                    ) : (
                      <ToggleLeft className="w-6 h-6" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 标签管理 */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4">菜品标签</h3>
        <div className="flex flex-wrap gap-2">
          {DISH_TAGS.map((t) => (
            <span
              key={t.id}
              className="px-3 py-1.5 rounded-full text-xs font-medium text-white flex items-center gap-1.5"
              style={{ backgroundColor: t.color }}
            >
              {t.name}
              <Edit2 className="w-3 h-3 opacity-70 cursor-pointer hover:opacity-100" />
            </span>
          ))}
          <button className="px-3 py-1.5 rounded-full border-2 border-dashed border-gray-200 text-xs text-gray-400 hover:border-primary-300 hover:text-primary-500 transition-colors flex items-center gap-1">
            <Plus className="w-3 h-3" />
            添加标签
          </button>
        </div>
      </div>

      {/* 新增菜品弹窗 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6" onClick={() => setShowModal(false)}>
          <div
            className="bg-white rounded-3xl w-full max-w-xl shadow-2xl max-h-[85vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">新增菜品</h3>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 text-xl"
              >
                ×
              </button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
              <div className="flex items-start gap-4">
                <div className="w-28 h-28 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-primary-300 hover:text-primary-500 cursor-pointer transition-colors bg-gray-50">
                  <Upload className="w-6 h-6 mb-1" />
                  <span className="text-[10px]">上传图片</span>
                </div>
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">菜品名称 *</label>
                    <input
                      placeholder="请输入菜品名称"
                      className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">菜品分类 *</label>
                    <select className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300">
                      <option>请选择分类</option>
                      {categories.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                      <option value="__new">+ 新建分类</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">所属档口 *</label>
                    <select className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300">
                      <option>请选择档口</option>
                      {STALLS.map((s) => (
                        <option key={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">成本价（元）*</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="0.00"
                    className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">售价（元）*</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="0.00"
                    className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">主要食材</label>
                <input
                  placeholder="如：猪肉、青椒、大米，用顿号分隔"
                  className="w-full px-3.5 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">菜品标签</label>
                <div className="flex flex-wrap gap-2">
                  {DISH_TAGS.map((t) => (
                    <label
                      key={t.id}
                      className="px-3 py-1.5 rounded-full text-xs font-medium border-2 cursor-pointer transition-all flex items-center gap-1"
                      style={{ borderColor: t.color + "40" }}
                    >
                      <input type="checkbox" className="hidden" />
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: t.color }}
                      />
                      {t.name}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl">
                <div>
                  <div className="text-sm font-medium text-gray-800">立即上架</div>
                  <div className="text-[11px] text-gray-400 mt-0.5">关闭后菜品将处于下架状态</div>
                </div>
                <button className="w-12 h-7 rounded-full bg-success-500 relative transition-colors">
                  <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-white shadow-sm" />
                </button>
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
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm bg-primary-500 hover:bg-primary-600 text-white font-medium transition-colors shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                保存菜品
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}