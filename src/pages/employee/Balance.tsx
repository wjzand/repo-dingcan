import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Wallet,
  PiggyBank,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Plus,
  Sparkles,
  ChevronRight,
  QrCode,
  Check,
} from "lucide-react";
import { useAppStore } from "@/store";
import { MEAL_TYPE_LABELS } from "@/types";

const quickAmounts = [50, 100, 200, 500];

export default function EmployeeBalance() {
  const navigate = useNavigate();
  const currentUser = useAppStore((s) => s.currentUser);
  const consumptionRecords = useAppStore((s) => s.consumptionRecords);
  const subsidyRecords = useAppStore((s) => s.subsidyRecords);
  const topUpBalance = useAppStore((s) => s.topUpBalance);
  const [showTopUp, setShowTopUp] = useState(false);
  const [showAllRecords, setShowAllRecords] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(100);
  const [payMethod, setPayMethod] = useState<"wechat" | "alipay">("wechat");
  const [paying, setPaying] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string }>({
    show: false,
    message: "",
  });

  const userConsumptions = currentUser
    ? consumptionRecords.filter((c) => c.userId === currentUser.id)
    : [];
  const userSubsidies = currentUser
    ? subsidyRecords.filter((s) => s.userId === currentUser.id)
    : [];

  const allRecords = [
    ...userConsumptions.map((c) => ({
      id: c.id,
      type: "consume" as const,
      title: c.description,
      subtitle: `${MEAL_TYPE_LABELS[c.mealType]} · ${c.date.slice(5)}`,
      amount: -c.amount,
      subsidy: -c.subsidyAmount,
      time: c.date,
      orderNo: c.orderNo,
    })),
    ...userSubsidies
      .filter((s) => s.type === "grant" || s.type === "adjust")
      .map((s) => ({
        id: s.id,
        type: s.type === "grant" ? ("grant" as const) : ("adjust" as const),
        title: s.description,
        subtitle: s.operatorName ? `操作人：${s.operatorName}` : "系统发放",
        amount: s.amount,
        subsidy: 0,
        time: s.createdAt,
        orderNo: "",
      })),
  ].sort((a, b) => (b.time > a.time ? 1 : -1));

  const handlePay = async () => {
    setPaying(true);
    await new Promise((r) => setTimeout(r, 1500));
    topUpBalance(selectedAmount, payMethod);
    setPaying(false);
    setShowTopUp(false);
    setToast({ show: true, message: `充值成功 ¥${selectedAmount}` });
    setTimeout(() => setToast({ show: false, message: "" }), 2000);
  };

  return (
    <div className="px-4 py-4 space-y-4">
      {toast.show && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-full shadow-xl flex items-center gap-2 text-sm font-medium bg-success-500 text-white">
          <Check className="w-4 h-4" />
          {toast.message}
        </div>
      )}

      <h1 className="text-xl font-bold text-gray-800">余额中心</h1>

      {/* 总余额卡片 */}
      <div className="bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <Sparkles className="absolute -right-4 -top-4 w-24 h-24 text-white/10" />
        <div className="flex items-center gap-2 text-primary-100 text-sm mb-1">
          <Wallet className="w-4 h-4" />
          <span>账户总余额</span>
        </div>
        <div className="text-4xl font-black tracking-tight">
          ¥ {((currentUser?.balance || 0) + (currentUser?.subsidyBalance || 0)).toFixed(1)}
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-white/15 rounded-2xl p-3 backdrop-blur-sm">
            <div className="flex items-center gap-1.5 text-primary-100 text-xs mb-1">
              <PiggyBank className="w-3.5 h-3.5" />
              <span>餐补余额</span>
            </div>
            <div className="text-xl font-bold">¥{(currentUser?.subsidyBalance || 0).toFixed(1)}</div>
          </div>
          <div className="bg-white/15 rounded-2xl p-3 backdrop-blur-sm">
            <div className="flex items-center gap-1.5 text-primary-100 text-xs mb-1">
              <CreditCard className="w-3.5 h-3.5" />
              <span>自费余额</span>
            </div>
            <div className="text-xl font-bold">¥{(currentUser?.balance || 0).toFixed(1)}</div>
          </div>
        </div>
      </div>

      {/* 快捷操作 */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setShowTopUp(true)}
          className="bg-white rounded-2xl p-4 flex items-center gap-3 shadow-card hover:shadow-card-hover transition-shadow"
        >
          <div className="w-11 h-11 bg-primary-50 rounded-xl flex items-center justify-center">
            <Plus className="w-6 h-6 text-primary-500" />
          </div>
          <div className="text-left">
            <div className="font-semibold text-gray-800 text-sm">账户充值</div>
            <div className="text-xs text-gray-400">微信/支付宝</div>
          </div>
        </button>
        <button className="bg-white rounded-2xl p-4 flex items-center gap-3 shadow-card hover:shadow-card-hover transition-shadow">
          <div className="w-11 h-11 bg-success-50 rounded-xl flex items-center justify-center">
            <QrCode className="w-6 h-6 text-success-500" />
          </div>
          <div className="text-left">
            <div className="font-semibold text-gray-800 text-sm">扫码充值</div>
            <div className="text-xs text-gray-400">线下扫码</div>
          </div>
        </button>
      </div>

      {/* 本月统计 */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-800 text-sm">本月概览</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-danger-50 rounded-xl flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-danger-500" />
            </div>
            <div>
              <div className="text-xs text-gray-400">本月消费</div>
              <div className="text-lg font-bold text-gray-800">
                ¥{userConsumptions.reduce((s, c) => s + c.amount, 0).toFixed(1)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success-50 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-success-500" />
            </div>
            <div>
              <div className="text-xs text-gray-400">餐补抵扣</div>
              <div className="text-lg font-bold text-gray-800">
                ¥{Math.abs(userConsumptions.reduce((s, c) => s + c.subsidyAmount, 0)).toFixed(1)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 交易明细 */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-gray-800 text-sm">交易明细</h2>
          <button
            onClick={() => setShowAllRecords(!showAllRecords)}
            className="text-xs text-primary-500 text-sm flex items-center"
          >
            {showAllRecords ? "收起" : "查看全部"} <ChevronRight className={`w-4 h-4 transition-transform ${showAllRecords ? "rotate-90" : ""}`} />
          </button>
        </div>

        <div className="space-y-2">
          {allRecords.slice(0, showAllRecords ? undefined : 8).map((record) => (
            <div
              key={record.id}
              className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  record.type === "consume"
                    ? "bg-danger-50"
                    : record.type === "grant"
                    ? "bg-success-50"
                    : "bg-warning-50"
                }`}
              >
                {record.type === "consume" ? (
                  <TrendingDown
                    className={`w-5 h-5 ${
                      record.type === "consume" ? "text-danger-500" : ""
                    }`}
                  />
                ) : (
                  <TrendingUp
                    className={`w-5 h-5 ${
                      record.type === "grant"
                        ? "text-success-500"
                        : "text-warning-500"
                    }`}
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-800 truncate">
                  {record.title}
                </div>
                <div className="text-[11px] text-gray-400">{record.subtitle}</div>
              </div>
              <div className="text-right">
                <div
                  className={`text-base font-bold ${
                    record.amount >= 0 ? "text-success-600" : "text-gray-800"
                  }`}
                >
                  {record.amount >= 0 ? "+" : ""}¥{record.amount.toFixed(1)}
                </div>
                {record.subsidy !== 0 && (
                  <div className="text-[10px] text-primary-500">
                    餐补 {record.subsidy.toFixed(1)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 充值弹窗 */}
      {showTopUp && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center sm:p-6"
            onClick={() => !paying && setShowTopUp(false)}
          >
            <div
              className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-gray-800 mb-5 text-center">
                账户充值
              </h3>

              <div className="grid grid-cols-4 gap-2 mb-5">
                {quickAmounts.map((amt) => {
                  const isSelected = selectedAmount === amt;
                  return (
                    <button
                      key={amt}
                      onClick={() => setSelectedAmount(amt)}
                      className={`py-3 rounded-xl text-lg font-bold transition-all ${
                        isSelected
                          ? "bg-primary-500 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      ¥{amt}
                    </button>
                  );
                })}
              </div>

              <div className="space-y-2 mb-5">
                {[
                  {
                    key: "wechat",
                    label: "微信支付",
                    color: "text-[#07C160]",
                    desc: "推荐使用",
                  },
                  {
                    key: "alipay",
                    label: "支付宝",
                    color: "text-[#1677FF]",
                    desc: "支付宝快捷支付",
                  },
                ].map((m) => {
                  const isSelected = payMethod === m.key;
                  return (
                    <button
                      key={m.key}
                      onClick={() => setPayMethod(m.key as "wechat" | "alipay")}
                      className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center gap-3 ${
                        isSelected
                          ? "border-primary-500 bg-primary-50/50"
                          : "border-gray-100 hover:border-gray-200"
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          m.key === "wechat" ? "bg-[#07C160]/10" : "bg-[#1677FF]/10"
                        }`}
                      >
                        <CreditCard className={`w-5 h-5 ${m.color}`} />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-semibold text-gray-800 text-sm">
                          {m.label}
                        </div>
                        <div className="text-[11px] text-gray-400">{m.desc}</div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          isSelected
                            ? "border-primary-500"
                            : "border-gray-200"
                        }`}
                      >
                        {isSelected && (
                          <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={handlePay}
                disabled={paying}
                className="w-full py-4 bg-primary-500 hover:bg-primary-600 disabled:opacity-70 text-white font-bold rounded-2xl text-lg shadow-lg hover:shadow-xl transition-all"
              >
                {paying ? "支付中..." : `确认充值 ¥${selectedAmount}`}
              </button>
            </div>
          </div>
        </>
      )}

      <div className="h-4" />
    </div>
  );
}
