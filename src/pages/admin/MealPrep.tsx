import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ChefHat,
  Users,
  UtensilsCrossed,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Download,
  Send,
  CheckCircle,
  Filter,
  CalendarDays,
  Clock,
  Sun,
  Cloud,
  CloudRain,
  Snowflake,
  AlertCircle,
  Check,
  X,
  RefreshCw,
  Printer,
  Info,
} from "lucide-react";
import { useAppStore } from "@/store";
import { MEAL_PREP_SUGGESTIONS, MEAL_PREP_ALERTS, STALLS, generateMealPrepSuggestion } from "@/data/mockData";
import {
  MEAL_TYPE_LABELS,
  FACTOR_TYPE_COLORS,
  CONFIDENCE_LABELS,
  CONFIDENCE_COLORS,
  RISK_LABELS,
  RISK_COLORS,
  WEATHER_LABELS,
  type MealType,
  type MealPrepDishSuggestion,
  type ConfidenceLevel,
  type WeatherType,
} from "@/types";

const weatherIcons: Record<WeatherType, typeof Sun> = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  snowy: Snowflake,
  extreme: AlertTriangle,
};

export default function MealPrep() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const todayStr = new Date().toISOString().split("T")[0];
  const meals: MealType[] = ["breakfast", "lunch", "dinner", "supper"];

  const paramDate = searchParams.get("date") || todayStr;
  const paramMeal = (searchParams.get("meal") as MealType) || "lunch";

  const [selectedDate, setSelectedDate] = useState(paramDate);
  const [selectedMeal, setSelectedMeal] = useState<MealType>(paramMeal);
  const [stallFilter, setStallFilter] = useState<string | null>(null);
  const [riskFilter, setRiskFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"risk" | "booking" | "name">("risk");
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "info" }>({
    show: false,
    message: "",
    type: "success",
  });

  const [suggestions, setSuggestions] = useState(() => {
    const existing = MEAL_PREP_SUGGESTIONS.find(s => s.date === selectedDate && s.mealType === selectedMeal);
    return existing || generateMealPrepSuggestion(selectedDate, selectedMeal, { weather: "cloudy" });
  });

  const [localDishes, setLocalDishes] = useState<MealPrepDishSuggestion[]>(suggestions.dishes);
  const [alerts] = useState(MEAL_PREP_ALERTS.filter(a => !a.acknowledged));

  useEffect(() => {
    const existing = MEAL_PREP_SUGGESTIONS.find(s => s.date === selectedDate && s.mealType === selectedMeal);
    const s = existing || generateMealPrepSuggestion(selectedDate, selectedMeal, { weather: "cloudy" });
    setSuggestions(s);
    setLocalDishes(s.dishes);
  }, [selectedDate, selectedMeal]);

  const filteredDishes = useMemo(() => {
    let result = [...localDishes];
    if (stallFilter) {
      result = result.filter(d => d.stallId === stallFilter);
    }
    if (riskFilter) {
      result = result.filter(d => d.riskLevel === riskFilter);
    }
    if (sortBy === "risk") {
      const riskOrder = { warning: 0, attention: 1, normal: 2 };
      result.sort((a, b) => riskOrder[a.riskLevel] - riskOrder[b.riskLevel]);
    } else if (sortBy === "booking") {
      result.sort((a, b) => (b.currentBooking / b.suggestedAmount) - (a.currentBooking / a.suggestedAmount));
    } else {
      result.sort((a, b) => a.dishName.localeCompare(b.dishName));
    }
    return result;
  }, [localDishes, stallFilter, riskFilter, sortBy]);

  const maxServing = Math.max(...filteredDishes.map(d => Math.max(d.suggestedAmount, d.currentBooking)), 1);

  const handleAmountChange = (id: string, value: number, reason?: string) => {
    setLocalDishes(prev => prev.map(d =>
      d.id === id ? { ...d, finalAmount: Math.max(0, value), adjustmentReason: reason || d.adjustmentReason } : d
    ));
  };

  const handleAdoptAll = () => {
    setLocalDishes(prev => prev.map(d => ({ ...d, finalAmount: d.suggestedAmount })));
    setToast({ show: true, message: "已采纳全部建议", type: "success" });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 2000);
  };

  const handleAdoptHighConfidence = () => {
    setLocalDishes(prev => prev.map(d =>
      d.confidence === "high" ? { ...d, finalAmount: d.suggestedAmount } : d
    ));
    setToast({ show: true, message: "已采纳高置信度菜品建议", type: "success" });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 2000);
  };

  const handleSaveAndNotify = () => {
    setToast({ show: true, message: "备餐方案已保存，已通知各档口负责人", type: "success" });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 2500);
  };

  const handleRefresh = () => {
    const newSuggestion = generateMealPrepSuggestion(selectedDate, selectedMeal, {
      weather: suggestions.weather,
      isHoliday: suggestions.isHoliday,
      specialEvent: suggestions.specialEvent,
    });
    setSuggestions(newSuggestion);
    setLocalDishes(newSuggestion.dishes);
    setToast({ show: true, message: "已重新生成备餐建议", type: "info" });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 2000);
  };

  const getProgressColor = (booking: number, suggested: number) => {
    const ratio = booking / suggested;
    if (ratio >= 0.7) return "from-success-400 to-success-500";
    if (ratio >= 0.3) return "from-warning-400 to-warning-500";
    return "from-danger-400 to-danger-500";
  };

  const WeatherIcon = suggestions.weather ? weatherIcons[suggestions.weather] : Cloud;

  return (
    <div className="space-y-6">
      {toast.show && (
        <div className={`fixed top-20 right-4 z-50 px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 text-sm font-medium animate-pulse ${
          toast.type === "success" ? "bg-success-500 text-white" : "bg-primary-500 text-white"
        }`}>
          <Check className="w-4 h-4" />
          {toast.message}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">智能备餐参谋</h1>
          <p className="text-sm text-gray-500 mt-1">基于历史数据和外部因素的AI备餐预测</p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm hover:bg-gray-50 text-sm text-gray-600"
        >
          <RefreshCw className="w-4 h-4" />
          重新生成
        </button>
      </div>

      {alerts.length > 0 && (
        <div className="bg-danger-50 border border-danger-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-danger-500" />
            <h3 className="font-bold text-danger-800">实时预警</h3>
            <span className="px-2 py-0.5 bg-danger-500 text-white text-[10px] rounded-full">{alerts.length}</span>
          </div>
          <div className="space-y-2">
            {alerts.map(alert => (
              <div key={alert.id} className="flex items-start gap-3 bg-white rounded-xl p-3">
                <AlertCircle className="w-4 h-4 text-danger-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-800">{alert.dishName}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{alert.message}</div>
                  <div className="text-[11px] text-danger-600 mt-1">
                    当前预订 {alert.currentBooking} / 建议 {alert.suggestedAmount} · 阈值 {alert.threshold}%
                  </div>
                </div>
                <button className="text-xs text-primary-500 hover:text-primary-600 font-medium">处理</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-gray-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-300"
          />
        </div>
        <div className="flex bg-white rounded-xl p-1 shadow-sm">
          {meals.map(m => {
            const isActive = selectedMeal === m;
            return (
              <button
                key={m}
                onClick={() => setSelectedMeal(m)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive ? "bg-primary-500 text-white shadow-sm" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {MEAL_TYPE_LABELS[m]}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <select
            value={stallFilter || ""}
            onChange={e => setStallFilter(e.target.value || null)}
            className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-300"
          >
            <option value="">全部档口</option>
            {STALLS.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <select
            value={riskFilter || ""}
            onChange={e => setRiskFilter(e.target.value || null)}
            className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-300"
          >
            <option value="">全部风险</option>
            <option value="warning">预警</option>
            <option value="attention">注意</option>
            <option value="normal">正常</option>
          </select>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-primary-300"
          >
            <option value="risk">按风险排序</option>
            <option value="booking">按预订进度</option>
            <option value="name">按菜品名称</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 text-white shadow-md">
          <div className="flex items-center gap-2 text-blue-100 text-xs mb-2">
            <Users className="w-4 h-4" />
            <span>预计总就餐人数</span>
          </div>
          <div className="text-3xl font-black">{suggestions.expectedTotalPeople}</div>
          <div className="text-xs text-blue-200 mt-2">基于历史数据预测</div>
        </div>
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-5 text-white shadow-md">
          <div className="flex items-center gap-2 text-primary-100 text-xs mb-2">
            <UtensilsCrossed className="w-4 h-4" />
            <span>建议备餐总份数</span>
          </div>
          <div className="text-3xl font-black">{suggestions.suggestedTotalServings}</div>
          <div className="text-xs text-primary-200 mt-2">共 {suggestions.dishes.length} 道菜品</div>
        </div>
        <div className="bg-gradient-to-br from-success-500 to-success-600 rounded-2xl p-5 text-white shadow-md">
          <div className="flex items-center gap-2 text-success-100 text-xs mb-2">
            <TrendingUp className="w-4 h-4" />
            <span>当前预订总份数</span>
          </div>
          <div className="text-3xl font-black">{suggestions.currentTotalBookings}</div>
          <div className="text-xs text-success-200 mt-2">预订率 {suggestions.bookingRate}%</div>
        </div>
        <div className={`bg-gradient-to-br ${
          suggestions.overallRisk === "warning" ? "from-danger-500 to-danger-600" :
          suggestions.overallRisk === "attention" ? "from-warning-500 to-warning-600" :
          "from-success-500 to-success-600"
        } rounded-2xl p-5 text-white shadow-md`}>
          <div className="flex items-center gap-2 text-white/80 text-xs mb-2">
            <AlertTriangle className="w-4 h-4" />
            <span>整体风险等级</span>
          </div>
          <div className="text-3xl font-black">{RISK_LABELS[suggestions.overallRisk]}</div>
          <div className="text-xs text-white/70 mt-2 flex items-center gap-2">
            <WeatherIcon className="w-3.5 h-3.5" />
            {suggestions.weather && WEATHER_LABELS[suggestions.weather]}
            {suggestions.temperature && ` · ${suggestions.temperature}°C`}
            {suggestions.isHoliday && " · 假期前夕"}
            {suggestions.specialEvent && ` · ${suggestions.specialEvent}`}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-gray-800">建议备餐量 vs 当前预订量</h3>
              <p className="text-xs text-gray-400 mt-0.5">蓝色为建议量，绿色为已预订量</p>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between gap-1 px-2">
            {filteredDishes.slice(0, 15).map(dish => {
              const suggestPct = Math.max(4, (dish.suggestedAmount / maxServing) * 100);
              const bookingPct = Math.max(4, (dish.currentBooking / maxServing) * 100);
              return (
                <div key={dish.id} className="flex-1 flex flex-col items-center gap-1.5 group">
                  <div className="w-full flex items-end justify-center gap-0.5 h-52">
                    <div
                      className="w-3 bg-gradient-to-t from-primary-400 to-primary-500 rounded-t transition-all"
                      style={{ height: `${suggestPct}%` }}
                      title={`建议: ${dish.suggestedAmount}`}
                    />
                    <div
                      className="w-3 bg-gradient-to-t from-success-400 to-success-500 rounded-t transition-all"
                      style={{ height: `${bookingPct}%` }}
                      title={`已订: ${dish.currentBooking}`}
                    />
                  </div>
                  <div className="text-[9px] text-gray-400 truncate w-full text-center group-hover:text-gray-600">
                    {dish.dishName.slice(0, 3)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">预订进度监控</h3>
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {filteredDishes.slice(0, 10).map(dish => {
              const progress = Math.min(100, (dish.currentBooking / dish.suggestedAmount) * 100);
              const ratio = dish.currentBooking / dish.suggestedAmount;
              let statusColor = "bg-success-500";
              if (ratio <= 0.3) statusColor = "bg-danger-500";
              else if (ratio <= 0.7) statusColor = "bg-warning-500";
              return (
                <div key={dish.id} className="p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-gray-700 truncate">{dish.dishName}</span>
                    <span className={`text-xs font-bold ${
                      ratio >= 0.7 ? "text-success-600" : ratio >= 0.3 ? "text-warning-600" : "text-danger-600"
                    }`}>
                      {progress.toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(dish.currentBooking, dish.suggestedAmount)}`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-gray-400 mt-1">
                    {dish.currentBooking} / {dish.suggestedAmount}份
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-800">菜品备餐明细</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={handleAdoptHighConfidence}
                className="px-3 py-2 text-sm bg-primary-50 text-primary-600 rounded-xl hover:bg-primary-100 font-medium"
              >
                仅采纳高置信度
              </button>
              <button
                onClick={handleAdoptAll}
                className="px-3 py-2 text-sm bg-primary-500 text-white rounded-xl hover:bg-primary-600 font-medium flex items-center gap-1.5"
              >
                <CheckCircle className="w-4 h-4" />
                采纳全部建议
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">菜品</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">档口</th>
                <th className="text-center px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">建议备餐</th>
                <th className="text-center px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">已预订</th>
                <th className="text-center px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">历史同期</th>
                <th className="text-center px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">影响因子</th>
                <th className="text-center px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">置信度</th>
                <th className="text-center px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">最终备餐</th>
                <th className="text-center px-4 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">上次情况</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredDishes.map(dish => (
                <tr key={dish.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${RISK_COLORS[dish.riskLevel]}`} title={RISK_LABELS[dish.riskLevel]} />
                      <span className="text-sm font-medium text-gray-800">{dish.dishName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-xs text-gray-600">{dish.stallName}</td>
                  <td className="px-4 py-4 text-center">
                    <div className="text-sm font-bold text-gray-800">{dish.suggestedMin}-{dish.suggestedMax}</div>
                    <div className="text-[10px] text-primary-500 font-medium">建议 {dish.suggestedAmount}</div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className={`text-sm font-bold ${
                      dish.currentBooking / dish.suggestedAmount >= 0.7 ? "text-success-600" :
                      dish.currentBooking / dish.suggestedAmount >= 0.3 ? "text-warning-600" : "text-danger-600"
                    }`}>
                      {dish.currentBooking}
                    </div>
                    <div className="text-[10px] text-gray-400">
                      {((dish.currentBooking / dish.suggestedAmount) * 100).toFixed(0)}%
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center text-sm text-gray-600">
                    {dish.historicalAvg}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1 justify-center">
                      {dish.factors.slice(0, 3).map((f, i) => (
                        <span
                          key={i}
                          className={`px-2 py-0.5 text-[10px] rounded-full border font-medium ${FACTOR_TYPE_COLORS[f.type]}`}
                          title={f.description}
                        >
                          {f.name}
                          {f.impact > 0 ? ` +${f.impact}%` : ` ${f.impact}%`}
                        </span>
                      ))}
                      {dish.factors.length > 3 && (
                        <span className="px-2 py-0.5 text-[10px] rounded-full bg-gray-100 text-gray-500 font-medium">
                          +{dish.factors.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${CONFIDENCE_COLORS[dish.confidence]}`}>
                      {CONFIDENCE_LABELS[dish.confidence]}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center gap-1 justify-center">
                      <button
                        onClick={() => handleAmountChange(dish.id, dish.finalAmount - 1)}
                        className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center"
                      >
                        <TrendingDown className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="number"
                        value={dish.finalAmount}
                        onChange={e => handleAmountChange(dish.id, parseInt(e.target.value) || 0)}
                        className="w-16 text-center text-sm font-bold text-gray-800 border border-gray-200 rounded-lg py-1.5 focus:outline-none focus:border-primary-300"
                        min="0"
                      />
                      <button
                        onClick={() => handleAmountChange(dish.id, dish.finalAmount + 1)}
                        className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center"
                      >
                        <TrendingUp className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    {dish.lastShortage !== undefined ? (
                      <div className="text-[11px] text-danger-600 font-medium">缺 {dish.lastShortage}份</div>
                    ) : dish.lastSurplus !== undefined ? (
                      <div className="text-[11px] text-gray-500">剩 {dish.lastSurplus}份</div>
                    ) : (
                      <div className="text-[11px] text-gray-400">-</div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center gap-3 justify-end">
        <button
          onClick={() => setShowPrintDialog(true)}
          className="flex items-center gap-2 px-5 py-3 bg-white rounded-xl shadow-sm hover:bg-gray-50 text-sm text-gray-700 font-medium"
        >
          <Printer className="w-4 h-4" />
          导出备餐单
        </button>
        <button
          onClick={handleSaveAndNotify}
          className="flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl shadow-lg hover:shadow-xl text-sm font-semibold"
        >
          <Send className="w-4 h-4" />
          保存并通知档口
        </button>
      </div>

      {showPrintDialog && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 print:hidden"
            onClick={() => setShowPrintDialog(false)}
          >
            <div
              className="bg-white w-full max-w-2xl rounded-2xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6 print:hidden">
                <h3 className="text-lg font-bold text-gray-800">备餐单预览</h3>
                <button onClick={() => setShowPrintDialog(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div id="print-area">
                <div className="border-b-2 border-gray-800 pb-4 mb-4">
                  <div className="text-center">
                    <div className="text-xl font-bold">智慧食堂备餐单</div>
                    <div className="text-sm text-gray-500 mt-1">
                      {selectedDate} {MEAL_TYPE_LABELS[selectedMeal]}
                    </div>
                  </div>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 font-semibold">菜品</th>
                      <th className="text-left py-2 font-semibold">档口</th>
                      <th className="text-center py-2 font-semibold">备餐量</th>
                      <th className="text-center py-2 font-semibold">责任人</th>
                      <th className="text-center py-2 font-semibold">确认</th>
                    </tr>
                  </thead>
                  <tbody>
                    {localDishes.map(d => (
                      <tr key={d.id} className="border-b border-gray-100">
                        <td className="py-2.5 font-medium">{d.dishName}</td>
                        <td className="py-2.5 text-gray-600">{d.stallName}</td>
                        <td className="py-2.5 text-center font-bold text-lg">{d.finalAmount}</td>
                        <td className="py-2.5 text-center text-gray-500">__________</td>
                        <td className="py-2.5 text-center text-gray-500">☐</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-end">
                  <div>
                    <div className="text-sm text-gray-500">合计备餐量</div>
                    <div className="text-2xl font-bold text-primary-600">
                      {localDishes.reduce((s, d) => s + d.finalAmount, 0)} 份
                    </div>
                  </div>
                  <div className="text-right text-xs text-gray-400">
                    打印时间：{new Date().toLocaleString("zh-CN")}
                  </div>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-3 justify-end print:hidden">
                <button
                  onClick={() => setShowPrintDialog(false)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium"
                >
                  取消
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-sm font-medium flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  打印备餐单
                </button>
              </div>
            </div>
          </div>
          <style>{`
            @media print {
              body * {
                visibility: hidden !important;
              }
              #print-area, #print-area * {
                visibility: visible !important;
              }
              #print-area {
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                padding: 30px !important;
              }
            }
          `}</style>
        </>
      )}
    </div>
  );
}
