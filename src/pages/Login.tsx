import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UtensilsCrossed, User, Users, Shield, ChefHat, UserCog } from "lucide-react";
import { useAppStore } from "@/store";
import type { UserRole } from "@/types";

const roleOptions: { role: UserRole; label: string; desc: string; icon: typeof User; color: string; bgColor: string }[] = [
  { role: "employee", label: "员工登录", desc: "浏览菜单、预订餐食、查看消费记录", icon: User, color: "text-primary-600", bgColor: "bg-primary-50 hover:bg-primary-100 border-primary-200" },
  { role: "canteen_manager", label: "食堂经理", desc: "菜单管理、订单处理、数据看板、报表", icon: Users, color: "text-blue-600", bgColor: "bg-blue-50 hover:bg-blue-100 border-blue-200" },
  { role: "stall_manager", label: "档口负责人", desc: "本档口菜单发布、订单处理、备餐统计", icon: ChefHat, color: "text-success-600", bgColor: "bg-success-50 hover:bg-success-100 border-success-200" },
  { role: "super_admin", label: "超级管理员", desc: "全部功能、组织管理、权限控制", icon: Shield, color: "text-danger-600", bgColor: "bg-danger-50 hover:bg-danger-100 border-danger-200" },
];

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAppStore((s) => s.login);
  const currentUser = useAppStore((s) => s.currentUser);
  const [selectedRole, setSelectedRole] = useState<UserRole>("employee");

  const from = (location.state as any)?.from?.pathname || null;

  useEffect(() => {
    if (currentUser) {
      if (from) {
        navigate(from, { replace: true });
      } else if (currentUser.role === "employee") {
        navigate("/", { replace: true });
      } else {
        navigate("/admin", { replace: true });
      }
    }
  }, [currentUser, navigate, from]);

  const handleLogin = () => {
    login(selectedRole);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-100 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-14 h-14 bg-primary-500 rounded-2xl flex items-center justify-center shadow-lg">
              <UtensilsCrossed className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800">智慧食堂</h1>
          </div>
          <p className="text-gray-500 text-lg">订餐与结算管理系统</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2">
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-10 md:p-12 text-white flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-4">欢迎回来！</h2>
              <p className="text-primary-50 text-lg mb-8 leading-relaxed">
                选择您的身份后即可登录系统，开始享受便捷的订餐体验。支持移动端与管理端一体化管理。
              </p>
              <div className="space-y-4 text-sm text-primary-100">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-white" />
                  <span>每日菜单浏览，一键预订/退订</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-white" />
                  <span>餐补自动发放，消费明细清晰</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-white" />
                  <span>实时数据看板，运营高效透明</span>
                </div>
              </div>
            </div>

            <div className="p-8 md:p-12">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">选择登录身份</h3>
              <div className="space-y-3 mb-8">
                {roleOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = selectedRole === opt.role;
                  return (
                    <button
                      key={opt.role}
                      type="button"
                      onClick={() => setSelectedRole(opt.role)}
                      className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                        isSelected
                          ? `${opt.bgColor} border-current shadow-sm scale-[1.02]`
                          : "bg-gray-50 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center ${isSelected ? "bg-white shadow-sm" : "bg-white/80"
                        }`}
                        >
                          <Icon className={`w-6 h-6 ${opt.color}`} />
                        </div>
                        <div className="flex-1">
                          <div className={`font-semibold ${isSelected ? opt.color : "text-gray-700"}`}>
                            {opt.label}
                          </div>
                          <div className="text-sm text-gray-500">{opt.desc}</div>
                        </div>
                        {isSelected && <UserCog className={`w-5 h-5 ${opt.color}`} />}
                      </div>
                    </button>
                  );
                })}
              </div>
              <button
                onClick={handleLogin}
                className="w-full py-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all text-lg hover:-translate-y-0.5 active:translate-y-0"
              >
                立即登录
              </button>
              <p className="text-center text-sm text-gray-400 mt-6">
                演示模式 · 点击任意身份即可体验
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
