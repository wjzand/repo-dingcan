import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  UtensilsCrossed,
  ClipboardList,
  LineChart,
  PiggyBank,
  Settings,
  LogOut,
  Users,
  Menu,
  X,
  Bell,
  ChefHat,
  ChevronRight,
  FileBarChart,
  Building2,
} from "lucide-react";
import { useAppStore } from "@/store";
import { ROLE_LABELS } from "@/types";

const adminNav = [
  { path: "/admin/dashboard", label: "数据看板", icon: LayoutDashboard, group: "运营" },
  { path: "/admin/menus", label: "菜单管理", icon: UtensilsCrossed, group: "运营" },
  { path: "/admin/orders", label: "订单管理", icon: ClipboardList, group: "运营" },
  { path: "/admin/dishes", label: "菜品库", icon: ChefHat, group: "运营" },
  { path: "/admin/reports", label: "统计报表", icon: LineChart, group: "财务" },
  { path: "/admin/subsidy", label: "餐补管理", icon: PiggyBank, group: "财务" },
  { path: "/admin/users", label: "用户管理", icon: Users, group: "系统" },
  { path: "/admin/departments", label: "部门管理", icon: Building2, group: "系统" },
  { path: "/admin/settings", label: "系统设置", icon: Settings, group: "系统" },
];

const groups = ["运营", "财务", "系统"];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useAppStore((s) => s.currentUser);
  const logout = useAppStore((s) => s.logout);
  const switchViewMode = useAppStore((s) => s.switchViewMode);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const switchToEmployee = () => {
    switchViewMode("employee");
    navigate("/");
  };

  const navItemClass = ({ isActive }: { isActive: boolean }) => {
    const base = "mx-2.5 my-0.5 flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ";
    const active = isActive
      ? "bg-primary-50 text-primary-600 font-medium"
      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900";
    const center = !sidebarOpen ? " justify-center" : "";
    return base + active + center;
  };

  const mainClass = "flex-1 " + (sidebarOpen ? "ml-64" : "ml-20") + " transition-all duration-300";

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside
        className={
          (sidebarOpen ? "w-64" : "w-20") +
          " transition-all duration-300 bg-white border-r border-gray-200 fixed h-full z-30 flex flex-col"
        }
      >
        <div className="h-16 px-4 flex items-center justify-between border-b border-gray-100">
          {sidebarOpen ? (
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <FileBarChart className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-gray-800 text-lg">管理后台</span>
            </div>
          ) : (
            <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center mx-auto">
              <FileBarChart className="w-5 h-5 text-white" />
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600"
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-3">
          {groups.map((group) => (
            <div key={group} className="mb-4">
              {sidebarOpen && (
                <div className="px-4 mb-1.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  {group}
                </div>
              )}
              {adminNav
                .filter((item) => item.group === group)
                .map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={navItemClass}
                    >
                      {({ isActive }) => (
                        <>
                          <Icon
                            className={
                              "w-5 h-5 flex-shrink-0 " + (isActive ? "text-primary-500" : "")
                            }
                          />
                          {sidebarOpen && (
                            <>
                              <span className="flex-1 text-sm">{item.label}</span>
                              {isActive && <ChevronRight className="w-4 h-4 text-primary-400" />}
                            </>
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}
            </div>
          ))}
        </nav>

        <div className="border-t border-gray-100 p-3">
          <button
            onClick={switchToEmployee}
            className={
              "w-full px-3 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50 hover:text-primary-600 transition-all flex items-center gap-2.5 " +
              (!sidebarOpen ? "justify-center" : "")
            }
          >
            <UtensilsCrossed className="w-5 h-5" />
            {sidebarOpen && <span>员工端视图</span>}
          </button>
        </div>
      </aside>

      <div className={mainClass}>
        <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-20 px-6 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-800">
              {adminNav.find((n) => location.pathname.startsWith(n.path))?.label ||
                "管理后台"}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-9 h-9 rounded-xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors relative">
              <Bell className="w-5 h-5 text-gray-500" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger-500 text-white text-[10px] rounded-full flex items-center justify-center font-medium">
                3
              </span>
            </button>
            <div className="h-6 w-px bg-gray-200" />
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center text-white font-semibold text-sm">
                {currentUser?.name?.charAt(0)}
              </div>
              <div className="hidden lg:block">
                <div className="text-sm font-medium text-gray-700 leading-tight">
                  {currentUser?.name}
                </div>
                <div className="text-[11px] text-gray-400">
                  {currentUser ? ROLE_LABELS[currentUser.role] : ""}
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-danger-600 p-2 rounded-lg hover:bg-danger-50 transition-colors"
              title="退出登录"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
