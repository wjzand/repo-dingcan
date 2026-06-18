import { useState } from "react";
import {
  Settings,
  Bell,
  Shield,
  Printer,
  Camera,
  CreditCard,
  Clock,
  Globe,
  Save,
  ToggleLeft,
  ToggleRight,
  ChevronRight,
  FileText,
  ScanLine,
  DollarSign,
  AlertTriangle,
  Palette,
} from "lucide-react";

export default function AdminSettings() {
  const [activeSection, setActiveSection] = useState("general");
  const [settings, setSettings] = useState({
    bookingDeadline: 60,
    autoCancelMins: 30,
    breakfastStart: "06:30",
    breakfastEnd: "09:00",
    lunchStart: "11:00",
    lunchEnd: "13:30",
    dinnerStart: "17:00",
    dinnerEnd: "19:30",
    defaultSubsidyPerMeal: 15,
    maxDailyBook: 3,
    minTopUp: 50,
    currency: "CNY",
    timezone: "Asia/Shanghai",
    pushBooking: true,
    pushPickup: true,
    pushLowBalance: true,
    pushExpense: false,
    emailNotify: false,
    smsNotify: false,
    autoGrantSubsidy: true,
    autoGrantDay: 1,
    printTemplate: "standard",
    autoPrint: true,
    enableScanCamera: true,
    enableScanGun: true,
    enableWechatPay: true,
    enableAlipay: true,
    enableBank: false,
    lowBalanceThreshold: 50,
    maxOrderAmount: 200,
    theme: "light",
    language: "zh-CN",
  });

  const toggle = (key: string) => {
    setSettings((s) => ({ ...s, [key]: !(s as any)[key] }));
  };

  const sections = [
    { id: "general", label: "通用设置", icon: Settings },
    { id: "meal", label: "餐别时段", icon: Clock },
    { id: "booking", label: "订餐规则", icon: FileText },
    { id: "notify", label: "通知设置", icon: Bell },
    { id: "payment", label: "支付设置", icon: CreditCard },
    { id: "scan", label: "扫码核销", icon: ScanLine },
    { id: "print", label: "打印模板", icon: Printer },
    { id: "security", label: "安全与权限", icon: Shield },
    { id: "display", label: "显示设置", icon: Palette },
  ];

  return (
    <div className="flex gap-5 flex-col lg:flex-row">
      <div className="lg:w-56 bg-white rounded-2xl p-3 shadow-sm h-fit lg:sticky lg:top-5">
        <div className="p-2 mb-2">
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">设置中心</div>
        </div>
        <div className="space-y-0.5">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeSection === s.id
                  ? "bg-primary-50 text-primary-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <s.icon className={`w-4 h-4 ${activeSection === s.id ? "text-primary-500" : "text-gray-400"}`} />
              {s.label}
              <ChevronRight
                className={`w-3 h-3 ml-auto transition-all ${
                  activeSection === s.id ? "text-primary-400 opacity-100" : "opacity-0"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 space-y-5">
        {activeSection === "general" && (
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <Settings className="w-4 h-4 text-primary-500" />
                  通用设置
                </h3>
                <p className="text-[11px] text-gray-400 mt-1">系统基础参数配置</p>
              </div>
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-xs font-medium transition-colors shadow-sm">
                <Save className="w-3.5 h-3.5" />
                保存设置
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">默认餐补金额（元/餐）</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    value={settings.defaultSubsidyPerMeal}
                    onChange={(e) => setSettings({ ...settings, defaultSubsidyPerMeal: Number(e.target.value) })}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:bg-white transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">每日最大订餐份数</label>
                <input
                  type="number"
                  value={settings.maxDailyBook}
                  onChange={(e) => setSettings({ ...settings, maxDailyBook: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">最低充值金额（元）</label>
                <input
                  type="number"
                  value={settings.minTopUp}
                  onChange={(e) => setSettings({ ...settings, minTopUp: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">低余额提醒阈值（元）</label>
                <input
                  type="number"
                  value={settings.lowBalanceThreshold}
                  onChange={(e) => setSettings({ ...settings, lowBalanceThreshold: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 focus:bg-white transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">货币单位</label>
                <select
                  value={settings.currency}
                  onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                >
                  <option value="CNY">人民币 (¥)</option>
                  <option value="USD">美元 ($)</option>
                  <option value="EUR">欧元 (€)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  <Globe className="w-3 h-3 inline mr-1" />
                  时区设置
                </label>
                <select
                  value={settings.timezone}
                  onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                >
                  <option value="Asia/Shanghai">UTC+8 北京时间</option>
                  <option value="Asia/Tokyo">UTC+9 东京时间</option>
                  <option value="UTC">UTC 标准时间</option>
                </select>
              </div>
            </div>

            <div className="mt-6 p-4 bg-warning-50/50 border border-warning-200 rounded-xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-warning-500 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-warning-700">修改提示</div>
                <div className="text-[11px] text-warning-600 mt-0.5">
                  以上设置修改后会立即生效，建议在非订餐时段进行调整。
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "meal" && (
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary-500" />
                  餐别时段设置
                </h3>
                <p className="text-[11px] text-gray-400 mt-1">配置各餐别的供应时间段</p>
              </div>
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-xs font-medium transition-colors shadow-sm">
                <Save className="w-3.5 h-3.5" />
                保存设置
              </button>
            </div>
            <div className="space-y-4">
              {[
                { name: "早餐", key: "breakfast", color: "from-yellow-400 to-orange-400", icon: "🌅" },
                { name: "午餐", key: "lunch", color: "from-primary-400 to-primary-500", icon: "🍱" },
                { name: "晚餐", key: "dinner", color: "from-purple-400 to-purple-500", icon: "🍽️" },
                { name: "夜宵", key: "snack", color: "from-indigo-400 to-indigo-500", icon: "🌙" },
              ].map((m) => (
                <div key={m.key} className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center text-lg shadow-sm`}
                    >
                      {m.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">{m.name}</h4>
                      <div className="text-[11px] text-gray-400">供应时段设置</div>
                    </div>
                    <div className="ml-auto">
                      <button className="text-xs text-primary-600 font-medium hover:text-primary-700">
                        启用/禁用
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-gray-500 mb-1">开始时间</label>
                      <input
                        type="time"
                        value={(settings as any)[`${m.key}Start`]}
                        className="w-full px-3 py-2 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-gray-500 mb-1">结束时间</label>
                      <input
                        type="time"
                        value={(settings as any)[`${m.key}End`]}
                        className="w-full px-3 py-2 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === "booking" && (
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary-500" />
                  订餐规则
                </h3>
                <p className="text-[11px] text-gray-400 mt-1">预订、退订、自动取消等规则配置</p>
              </div>
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-xs font-medium transition-colors shadow-sm">
                <Save className="w-3.5 h-3.5" />
                保存设置
              </button>
            </div>
            <div className="space-y-4">
              {[
                {
                  key: "bookingDeadline",
                  label: "订餐截止时间（取餐前N分钟）",
                  desc: "到达该时间后，不可再预订该餐别",
                  type: "number",
                  unit: "分钟",
                },
                {
                  key: "autoCancelMins",
                  label: "未取餐自动取消（取餐结束后N分钟）",
                  desc: "超时未取餐订单将自动标记为未取餐状态",
                  type: "number",
                  unit: "分钟",
                },
                {
                  key: "maxOrderAmount",
                  label: "单笔订单最大金额",
                  desc: "超过此金额的订单无法提交，防止误操作",
                  type: "number",
                  unit: "元",
                },
              ].map((item: any) => (
                <div key={item.key} className="flex items-start justify-between gap-6 p-4 bg-gray-50 rounded-xl">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-800">{item.label}</div>
                    <div className="text-[11px] text-gray-400 mt-0.5">{item.desc}</div>
                  </div>
                  <div className="flex items-center gap-2 w-32">
                    <input
                      type={item.type}
                      value={(settings as any)[item.key]}
                      onChange={(e) => setSettings({ ...settings, [item.key]: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 text-right"
                    />
                    <span className="text-[11px] text-gray-400 w-8">{item.unit}</span>
                  </div>
                </div>
              ))}

              <div className="p-4 border border-success-200 bg-success-50/30 rounded-xl">
                <h4 className="text-sm font-semibold text-gray-800 mb-3">补贴发放规则</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-700">启用自动发放餐补</div>
                      <div className="text-[11px] text-gray-400">系统按设定规则自动为员工发放补贴</div>
                    </div>
                    <button onClick={() => toggle("autoGrantSubsidy")} className="text-gray-400">
                      {settings.autoGrantSubsidy ? (
                        <ToggleRight className="w-10 h-6 text-success-500" />
                      ) : (
                        <ToggleLeft className="w-10 h-6" />
                      )}
                    </button>
                  </div>
                  <div className="flex items-center justify-between pl-6 border-l-2 border-success-200">
                    <div>
                      <div className="text-sm text-gray-600">自动发放日</div>
                      <div className="text-[11px] text-gray-400">每月几号发放月度餐补</div>
                    </div>
                    <select
                      value={settings.autoGrantDay}
                      onChange={(e) => setSettings({ ...settings, autoGrantDay: Number(e.target.value) })}
                      className="px-3 py-2 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                    >
                      {Array.from({ length: 28 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          每月{i + 1}日
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "notify" && (
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-primary-500" />
                  通知设置
                </h3>
                <p className="text-[11px] text-gray-400 mt-1">配置各类通知的推送方式与触发条件</p>
              </div>
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-xs font-medium transition-colors shadow-sm">
                <Save className="w-3.5 h-3.5" />
                保存设置
              </button>
            </div>
            <div className="space-y-2">
              {[
                {
                  key: "pushBooking",
                  label: "订餐成功通知",
                  desc: "预订成功后发送确认消息",
                  tag: "高频",
                  tagColor: "bg-primary-50 text-primary-600",
                },
                {
                  key: "pushPickup",
                  label: "取餐提醒通知",
                  desc: "取餐开始前15分钟发送提醒",
                  tag: "必开",
                  tagColor: "bg-success-50 text-success-600",
                },
                {
                  key: "pushLowBalance",
                  label: "余额不足提醒",
                  desc: "余额低于阈值时发送提醒",
                  tag: "推荐",
                  tagColor: "bg-warning-50 text-warning-600",
                },
                {
                  key: "pushExpense",
                  label: "消费明细推送",
                  desc: "每次消费后发送消费明细",
                  tag: "可选",
                  tagColor: "bg-gray-100 text-gray-500",
                },
              ].map((item: any) => (
                <div
                  key={item.key}
                  className="flex items-start justify-between gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-500 flex items-center justify-center flex-shrink-0">
                      <Bell className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium text-gray-800">{item.label}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${item.tagColor}`}>
                          {item.tag}
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-400 mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                  <button onClick={() => toggle(item.key)} className="text-gray-400">
                    {(settings as any)[item.key] ? (
                      <ToggleRight className="w-10 h-6 text-success-500" />
                    ) : (
                      <ToggleLeft className="w-10 h-6" />
                    )}
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-5 p-4 border border-gray-100 rounded-xl">
              <h4 className="text-sm font-semibold text-gray-800 mb-3">通知渠道</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { key: "pushNotify", name: "站内推送", desc: "浏览器/Web通知", enabled: true },
                  { key: "emailNotify", name: "邮件通知", desc: "绑定邮箱接收", enabled: settings.emailNotify },
                  { key: "smsNotify", name: "短信通知", desc: "手机号接收（计费）", enabled: settings.smsNotify },
                ].map((c) => (
                  <div key={c.key} className="p-3 border border-gray-100 rounded-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-800">{c.name}</span>
                      <button
                        onClick={() => c.key !== "pushNotify" && toggle(c.key)}
                        className="text-gray-400"
                      >
                        {c.enabled ? (
                          <ToggleRight
                            className={`w-9 h-5 ${
                              c.key === "pushNotify" ? "text-primary-500 cursor-default" : "text-success-500"
                            }`}
                          />
                        ) : (
                          <ToggleLeft className="w-9 h-5" />
                        )}
                      </button>
                    </div>
                    <div className="text-[11px] text-gray-400 mt-1">{c.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === "payment" && (
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-primary-500" />
                  支付设置
                </h3>
                <p className="text-[11px] text-gray-400 mt-1">配置在线支付渠道与参数</p>
              </div>
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-xs font-medium transition-colors shadow-sm">
                <Save className="w-3.5 h-3.5" />
                保存设置
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  key: "enableWechatPay",
                  name: "微信支付",
                  desc: "推荐使用，覆盖最广",
                  color: "from-green-500 to-green-600",
                  logo: "💚",
                },
                {
                  key: "enableAlipay",
                  name: "支付宝",
                  desc: "支持花呗分期",
                  color: "from-blue-500 to-blue-600",
                  logo: "🔵",
                },
                {
                  key: "enableBank",
                  name: "银行卡支付",
                  desc: "银联借记卡/信用卡",
                  color: "from-red-500 to-red-600",
                  logo: "💳",
                },
              ].map((p: any) => (
                <div
                  key={p.key}
                  className={`p-4 border-2 rounded-2xl transition-all cursor-pointer ${
                    (settings as any)[p.key] ? "border-success-300 bg-success-50/30" : "border-gray-100 hover:border-gray-200"
                  }`}
                  onClick={() => toggle(p.key)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center text-2xl shadow-sm`}
                    >
                      {p.logo}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">{p.name}</div>
                      <div className="text-[11px] text-gray-400">{p.desc}</div>
                    </div>
                    {(settings as any)[p.key] && (
                      <div className="w-6 h-6 rounded-full bg-success-500 text-white flex items-center justify-center">
                        <span className="text-xs">✓</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === "scan" && (
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <ScanLine className="w-4 h-4 text-primary-500" />
                  扫码核销设置
                </h3>
                <p className="text-[11px] text-gray-400 mt-1">取餐码扫描核销相关配置</p>
              </div>
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-xs font-medium transition-colors shadow-sm">
                <Save className="w-3.5 h-3.5" />
                保存设置
              </button>
            </div>
            <div className="space-y-2">
              {[
                {
                  key: "enableScanCamera",
                  label: "摄像头扫码",
                  desc: "调用浏览器摄像头扫描取餐码（需HTTPS或localhost环境）",
                  icon: Camera,
                  color: "text-primary-500 bg-primary-50",
                },
                {
                  key: "enableScanGun",
                  label: "扫码枪支持",
                  desc: "支持USB扫码枪键盘输入模式，自动识别取餐码",
                  icon: ScanLine,
                  color: "text-purple-500 bg-purple-50",
                },
              ].map((item: any) => (
                <div key={item.key} className="flex items-start justify-between gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-800">{item.label}</div>
                      <div className="text-[11px] text-gray-400 mt-0.5">{item.desc}</div>
                    </div>
                  </div>
                  <button onClick={() => toggle(item.key)} className="text-gray-400">
                    {(settings as any)[item.key] ? (
                      <ToggleRight className="w-10 h-6 text-success-500" />
                    ) : (
                      <ToggleLeft className="w-10 h-6" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === "print" && (
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <Printer className="w-4 h-4 text-primary-500" />
                  打印模板
                </h3>
                <p className="text-[11px] text-gray-400 mt-1">备餐单、报表等打印模板配置</p>
              </div>
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-xs font-medium transition-colors shadow-sm">
                <Save className="w-3.5 h-3.5" />
                保存设置
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-warning-50 text-warning-500 flex items-center justify-center flex-shrink-0">
                    <Printer className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-800">打印时自动弹出预览窗口</div>
                    <div className="text-[11px] text-gray-400 mt-0.5">备餐统计、报表等生成后自动打开打印预览</div>
                  </div>
                </div>
                <button onClick={() => toggle("autoPrint")} className="text-gray-400">
                  {settings.autoPrint ? (
                    <ToggleRight className="w-10 h-6 text-success-500" />
                  ) : (
                    <ToggleLeft className="w-10 h-6" />
                  )}
                </button>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <label className="block text-xs font-medium text-gray-600 mb-2">打印纸张模板</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "standard", name: "标准A4", size: "210×297mm" },
                    { id: "thermo", name: "热敏小票", size: "80mm宽" },
                    { id: "label", name: "标签打印", size: "50×30mm" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSettings({ ...settings, printTemplate: t.id })}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        settings.printTemplate === t.id
                          ? "border-primary-400 bg-primary-50/50"
                          : "border-gray-100 hover:border-gray-200 bg-white"
                      }`}
                    >
                      <div className="text-xs font-semibold text-gray-800">{t.name}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">{t.size}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "security" && (
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary-500" />
                  安全与权限
                </h3>
                <p className="text-[11px] text-gray-400 mt-1">系统安全防护与敏感操作配置</p>
              </div>
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-xs font-medium transition-colors shadow-sm">
                <Save className="w-3.5 h-3.5" />
                保存设置
              </button>
            </div>
            <div className="space-y-3">
              {[
                { label: "敏感操作二次验证", desc: "退款、删除等操作需再次确认密码", enabled: true },
                { label: "同账号多端登录限制", desc: "最多同时登录2个设备", enabled: true },
                { label: "操作日志审计", desc: "记录所有管理端操作行为", enabled: true },
                { label: "数据自动备份", desc: "每日凌晨自动备份数据库", enabled: true },
              ].map((s, i) => (
                <div key={i} className="flex items-start justify-between gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                  <div>
                    <div className="text-sm font-medium text-gray-800">{s.label}</div>
                    <div className="text-[11px] text-gray-400 mt-0.5">{s.desc}</div>
                  </div>
                  <ToggleRight className="w-10 h-6 text-success-500" />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === "display" && (
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-primary-500" />
                  显示设置
                </h3>
                <p className="text-[11px] text-gray-400 mt-1">主题、语言等个性化配置</p>
              </div>
              <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-xs font-medium transition-colors shadow-sm">
                <Save className="w-3.5 h-3.5" />
                保存设置
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">主题风格</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "light", name: "浅色模式", preview: "bg-white border-gray-200" },
                    { id: "dark", name: "深色模式", preview: "bg-gray-800 border-gray-700" },
                    { id: "auto", name: "跟随系统", preview: "bg-gradient-to-br from-white to-gray-800 border-gray-300" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSettings({ ...settings, theme: t.id })}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        settings.theme === t.id
                          ? "border-primary-400 ring-2 ring-primary-100"
                          : "border-gray-100 hover:border-gray-200"
                      }`}
                    >
                      <div className={`h-16 rounded-lg ${t.preview} border mb-2`} />
                      <div className="text-xs font-medium text-gray-700">{t.name}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">界面语言</label>
                <select
                  value={settings.language}
                  onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                  className="w-full max-w-xs px-4 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
                >
                  <option value="zh-CN">简体中文</option>
                  <option value="zh-TW">繁體中文</option>
                  <option value="en-US">English</option>
                  <option value="ja-JP">日本語</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
