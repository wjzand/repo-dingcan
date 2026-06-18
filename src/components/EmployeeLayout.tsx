import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  Home,
  ClipboardList,
  User as UserIcon,
  Bell,
  Wallet,
  X,
} from "lucide-react";
import { useAppStore } from "@/store";
import { MEAL_TYPE_LABELS } from "@/types";

const navItems = [
  { path: "/", label: "首页", icon: Home },
  { path: "/orders", label: "订单", icon: ClipboardList },
  { path: "/balance", label: "余额", icon: Wallet },
  { path: "/profile", label: "我的", icon: UserIcon },
];

export default function EmployeeLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useAppStore((s) => s.currentUser);
  const notifications = useAppStore((s) => s.notifications);
  const markAllRead = useAppStore((s) => s.markAllNotificationsRead);
  const markNotificationRead = useAppStore((s) => s.markNotificationRead);
  const logout = useAppStore((s) => s.logout);
  const [showNotif, setShowNotif] = useState(false);

  const userNotifs = notifications.filter((n) => n.userId === currentUser?.id);
  const unreadCount = userNotifs.filter((n) => !n.isRead).length;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  void location;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {currentUser?.name?.charAt(0) || "U"}
              </span>
            </div>
            <div>
              <div className="font-semibold text-gray-800 text-sm leading-tight">
                你好，{currentUser?.name}
              </div>
              <div className="text-xs text-gray-500">{currentUser?.department}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setShowNotif(!showNotif)}
                className="w-9 h-9 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors relative"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {showNotif && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowNotif(false)}
                  />
                  <div className="absolute right-0 top-12 w-80 max-h-96 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                      <span className="font-semibold text-gray-700">消息通知</span>
                      {unreadCount > 0 && (
                        <button
                          onClick={() => markAllRead()}
                          className="text-xs text-primary-600 hover:text-primary-700"
                        >
                          全部已读
                        </button>
                      )}
                    </div>
                    <div className="overflow-y-auto max-h-80">
                      {userNotifs.length === 0 ? (
                        <div className="py-12 text-center text-gray-400 text-sm">暂无消息</div>
                      ) : (
                        userNotifs.slice(0, 10).map((n) => (
                          <div
                            key={n.id}
                            className={`px-4 py-3 border-b border-gray-50 ${
                              n.isRead ? "" : "bg-primary-50/30"
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <div
                              className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                                n.type === "success"
                                  ? "bg-success-500"
                                  : n.type === "warning"
                                  ? "bg-warning-500"
                                  : n.type === "danger"
                                  ? "bg-danger-500"
                                  : "bg-blue-500"
                              }`}
                            />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <span
                                    className={`text-sm ${
                                      n.isRead ? "font-normal text-gray-600" : "font-semibold text-gray-800"
                                    }`}
                                  >
                                    {n.title}
                                  </span>
                                  {!n.isRead && (
                                    <button
                                      onClick={() => markNotificationRead(n.id)}
                                      className="text-xs text-gray-400 hover:text-gray-600"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                  {n.content}
                                </p>
                                <div className="text-[10px] text-gray-400 mt-1">
                                  {n.createdAt.slice(5, 16)}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="text-xs text-gray-500 hover:text-danger-600 px-2 py-1.5 rounded-lg hover:bg-danger-50 transition-colors"
            >
              退出
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-100 safe-area-bottom">
        <div className="max-w-2xl mx-auto flex items-center justify-around py-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all min-w-[64px] ${
                    isActive
                      ? "text-primary-600"
                      : "text-gray-400 hover:text-gray-600"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-6 h-6 transition-transform ${
                      isActive ? "scale-110" : ""
                    }`}
                    />
                    <span className={`text-[11px] mt-0.5 font-medium`}>
                      {item.label}
                    </span>
                    {isActive && (
                      <span className="absolute bottom-0 w-8 h-1 bg-primary-500 rounded-t-full" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
        <div className="h-1" />
      </nav>

      <div className="h-1" />
    </div>
  );
}

export { MEAL_TYPE_LABELS };
