import { useNavigate } from "react-router-dom";
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
} from "lucide-react";
import { useAppStore } from "@/store";

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
  const logout = useAppStore((s) => s.logout);
  const switchViewMode = useAppStore((s) => s.switchViewMode);

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
