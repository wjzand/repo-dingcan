import { create } from "zustand";
import type {
  User,
  UserRole,
  MealType,
  Order,
  OrderStatus,
  MenuItem,
  ComboItem,
  Notification,
  SubsidyRecord,
  ConsumptionRecord,
  Dish,
  SubsidyRule,
} from "@/types";
import {
  CURRENT_USER,
  ADMIN_USER,
  SUPER_USER,
  STALL_USER,
  ORDERS,
  MENU_ITEMS,
  COMBO_ITEMS,
  NOTIFICATIONS,
  SUBSIDY_RECORDS,
  CONSUMPTION_RECORDS,
  DISHES,
  SUBSIDY_RULES,
  STALLS,
  USERS,
} from "@/data/mockData";

interface AppState {
  currentUser: User | null;
  users: User[];
  viewMode: "employee" | "admin";
  orders: Order[];
  menuItems: MenuItem[];
  comboItems: ComboItem[];
  notifications: Notification[];
  subsidyRecords: SubsidyRecord[];
  consumptionRecords: ConsumptionRecord[];
  dishes: Dish[];
  subsidyRules: SubsidyRule[];
  selectedDate: string;
  selectedMealType: MealType;
  selectedStallId: string | null;

  login: (role: UserRole) => void;
  logout: () => void;
  switchViewMode: (mode: "employee" | "admin") => void;

  setSelectedDate: (date: string) => void;
  setSelectedMealType: (meal: MealType) => void;
  setSelectedStallId: (stallId: string | null) => void;

  bookMenuItem: (menuItemId: string) => { success: boolean; message: string; order?: Order };
  bookComboItem: (comboId: string) => { success: boolean; message: string; order?: Order };
  cancelOrder: (orderId: string) => { success: boolean; message: string };
  markOrderPickedUp: (orderId: string) => void;
  markOrderNoShow: (orderId: string) => void;

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  getUserOrders: (userId: string) => Order[];
  getTodayOrders: () => Order[];
  getOrdersByStatus: (status: OrderStatus) => Order[];
  getFilteredOrders: (filters: {
    date?: string;
    mealType?: MealType;
    stallId?: string;
    status?: OrderStatus;
    keyword?: string;
  }) => Order[];

  getMenuForDate: (date: string, mealType: MealType, stallId?: string | null) => {
    items: MenuItem[];
    combos: ComboItem[];
  };

  addDish: (dish: Omit<Dish, "id">) => void;
  updateDish: (dish: Dish) => void;
  toggleDishActive: (dishId: string) => void;

  addMenuItem: (item: Omit<MenuItem, "id">) => void;
  updateMenuItem: (item: MenuItem) => void;

  topUpBalance: (amount: number, method: "wechat" | "alipay") => void;
  grantSubsidy: (params: { userId: string; amount: number; ruleType?: string; ruleName?: string }) => void;
}

const todayStr = new Date().toISOString().split("T")[0];

export const useAppStore = create<AppState>((set, get) => ({
  currentUser: null,
  users: [...USERS],
  viewMode: "employee",
  orders: [...ORDERS],
  menuItems: [...MENU_ITEMS],
  comboItems: [...COMBO_ITEMS],
  notifications: [...NOTIFICATIONS],
  subsidyRecords: [...SUBSIDY_RECORDS],
  consumptionRecords: [...CONSUMPTION_RECORDS],
  dishes: [...DISHES],
  subsidyRules: [...SUBSIDY_RULES],
  selectedDate: todayStr,
  selectedMealType: "lunch",
  selectedStallId: null,

  login: (role: UserRole) => {
    let user: User;
    switch (role) {
      case "super_admin":
        user = SUPER_USER;
        break;
      case "canteen_manager":
        user = ADMIN_USER;
        break;
      case "stall_manager":
        user = STALL_USER;
        break;
      default:
        user = CURRENT_USER;
    }
    set({
      currentUser: user,
      viewMode: role === "employee" ? "employee" : "admin",
    });
  },

  logout: () => set({ currentUser: null }),

  switchViewMode: (mode) => set({ viewMode: mode }),

  setSelectedDate: (date) => set({ selectedDate: date }),
  setSelectedMealType: (meal) => set({ selectedMealType: meal }),
  setSelectedStallId: (stallId) => set({ selectedStallId: stallId }),

  bookMenuItem: (menuItemId) => {
    const state = get();
    const user = state.currentUser;
    if (!user) return { success: false, message: "请先登录" };

    const menuItem = state.menuItems.find((m) => m.id === menuItemId);
    if (!menuItem) return { success: false, message: "菜品不存在" };

    const now = new Date();
    const deadline = new Date(menuItem.deadline);
    if (now > deadline) return { success: false, message: "已超过预订截止时间" };

    if (menuItem.bookedCount >= menuItem.supplyLimit) {
      return { success: false, message: "该菜品已售罄" };
    }

    const existingOrder = state.orders.find(
      (o) =>
        o.userId === user.id &&
        o.date === menuItem.date &&
        o.mealType === menuItem.mealType &&
        (o.status === "booked" || o.status === "picked_up")
    );
    if (existingOrder) {
      return { success: false, message: "该餐别您已预订，不能重复预订" };
    }

    const unitPrice = menuItem.dish.price;
    const subsidyAmount = Math.min(10, unitPrice);
    const actualPrice = unitPrice - subsidyAmount;

    if (user.subsidyBalance + user.balance < actualPrice) {
      return { success: false, message: "余额不足，请先充值" };
    }

    const orderNo = `DD${menuItem.date.replace(/-/g, "")}${String(state.orders.length + 1).padStart(3, "0")}`;
    const newOrder: Order = {
      id: `o${Date.now()}`,
      orderNo,
      userId: user.id,
      userName: user.name,
      employeeId: user.employeeId,
      department: user.department,
      date: menuItem.date,
      mealType: menuItem.mealType,
      stallId: menuItem.stallId,
      stallName: STALLS.find((s) => s.id === menuItem.stallId)?.name || "未知档口",
      items: [
        {
          menuItemId,
          dishName: menuItem.dish.name,
          quantity: 1,
          unitPrice,
          subsidyAmount,
          actualPrice,
        },
      ],
      totalAmount: unitPrice,
      subsidyAmount,
      actualAmount: actualPrice,
      status: "booked",
      pickupCode: `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(1000 + Math.random() * 9000)}`,
      bookedAt: new Date().toISOString().replace("T", " ").slice(0, 19),
      paymentMethod: user.subsidyBalance >= actualPrice ? "subsidy" : user.balance >= actualPrice ? "balance" : "mixed",
    };

    set({
      orders: [...state.orders, newOrder],
      menuItems: state.menuItems.map((m) =>
        m.id === menuItemId ? { ...m, bookedCount: m.bookedCount + 1 } : m
      ),
      currentUser: {
        ...user,
        subsidyBalance: Math.max(0, user.subsidyBalance - Math.min(user.subsidyBalance, actualPrice)),
        balance: Math.max(0, user.balance - Math.max(0, actualPrice - user.subsidyBalance)),
      },
      subsidyRecords: [
        ...state.subsidyRecords,
        {
          id: `sr${Date.now()}`,
          userId: user.id,
          userName: user.name,
          orderId: newOrder.id,
          ruleType: "per_meal",
          ruleName: "按次补贴抵扣",
          amount: subsidyAmount,
          usedAmount: subsidyAmount,
          type: "consume",
          description: `订单${orderNo}餐补抵扣`,
          grantedAt: new Date().toISOString().replace("T", " ").slice(0, 19),
          expireAt: new Date(Date.now() + 30 * 86400000).toISOString().replace("T", " ").slice(0, 19),
          createdAt: new Date().toISOString().replace("T", " ").slice(0, 19),
        },
      ],
      consumptionRecords: [
        ...state.consumptionRecords,
        {
          id: `cr${Date.now()}`,
          userId: user.id,
          date: menuItem.date,
          mealType: menuItem.mealType,
          orderId: newOrder.id,
          orderNo,
          amount: unitPrice,
          subsidyAmount,
          balanceChange: -Math.max(0, actualPrice - user.subsidyBalance),
          subsidyChange: -Math.min(user.subsidyBalance, actualPrice),
          description: `${newOrder.stallName} - ${menuItem.dish.name}`,
        },
      ],
      notifications: [
        {
          id: `n${Date.now()}`,
          userId: user.id,
          title: "订餐成功",
          content: `您已成功预订${menuItem.date}${
            { breakfast: "早餐", lunch: "午餐", dinner: "晚餐", supper: "夜宵" }[menuItem.mealType]
          }的${menuItem.dish.name}，取餐码${newOrder.pickupCode}`,
          type: "success",
          isRead: false,
          createdAt: new Date().toISOString().replace("T", " ").slice(0, 19),
          link: "/orders",
        },
        ...state.notifications,
      ],
    });

    return { success: true, message: "预订成功", order: newOrder };
  },

  bookComboItem: (comboId) => {
    const state = get();
    const user = state.currentUser;
    if (!user) return { success: false, message: "请先登录" };

    const combo = state.comboItems.find((c) => c.id === comboId);
    if (!combo) return { success: false, message: "套餐不存在" };

    const now = new Date();
    const deadline = new Date(combo.deadline);
    if (now > deadline) return { success: false, message: "已超过预订截止时间" };

    if (combo.bookedCount >= combo.supplyLimit) {
      return { success: false, message: "该套餐已售罄" };
    }

    const existingOrder = state.orders.find(
      (o) =>
        o.userId === user.id &&
        o.date === combo.date &&
        o.mealType === combo.mealType &&
        (o.status === "booked" || o.status === "picked_up")
    );
    if (existingOrder) {
      return { success: false, message: "该餐别您已预订，不能重复预订" };
    }

    const unitPrice = combo.comboPrice;
    const subsidyAmount = Math.min(10, unitPrice);
    const actualPrice = unitPrice - subsidyAmount;

    if (user.subsidyBalance + user.balance < actualPrice) {
      return { success: false, message: "余额不足，请先充值" };
    }

    const orderNo = `DD${combo.date.replace(/-/g, "")}${String(state.orders.length + 1).padStart(3, "0")}`;
    const newOrder: Order = {
      id: `o${Date.now()}`,
      orderNo,
      userId: user.id,
      userName: user.name,
      employeeId: user.employeeId,
      department: user.department,
      date: combo.date,
      mealType: combo.mealType,
      stallId: combo.stallId,
      stallName: STALLS.find((s) => s.id === combo.stallId)?.name || "未知档口",
      items: [
        ...combo.items.map((it) => ({
          comboId,
          dishName: it.dishName,
          quantity: it.quantity,
          unitPrice: 0,
          subsidyAmount: 0,
          actualPrice: 0,
        })),
        {
          comboId,
          dishName: `[套餐]${combo.name}`,
          quantity: 1,
          unitPrice,
          subsidyAmount,
          actualPrice,
        },
      ],
      totalAmount: unitPrice,
      subsidyAmount,
      actualAmount: actualPrice,
      status: "booked",
      pickupCode: `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(1000 + Math.random() * 9000)}`,
      bookedAt: new Date().toISOString().replace("T", " ").slice(0, 19),
      paymentMethod: user.subsidyBalance >= actualPrice ? "subsidy" : user.balance >= actualPrice ? "balance" : "mixed",
    };

    set({
      orders: [...state.orders, newOrder],
      comboItems: state.comboItems.map((c) =>
        c.id === comboId ? { ...c, bookedCount: c.bookedCount + 1 } : c
      ),
      currentUser: {
        ...user,
        subsidyBalance: Math.max(0, user.subsidyBalance - Math.min(user.subsidyBalance, actualPrice)),
        balance: Math.max(0, user.balance - Math.max(0, actualPrice - user.subsidyBalance)),
      },
      subsidyRecords: [
        ...state.subsidyRecords,
        {
          id: `sr${Date.now()}`,
          userId: user.id,
          userName: user.name,
          orderId: newOrder.id,
          ruleType: "per_meal",
          ruleName: "按次补贴抵扣",
          amount: subsidyAmount,
          usedAmount: subsidyAmount,
          type: "consume",
          description: `订单${orderNo}餐补抵扣`,
          grantedAt: new Date().toISOString().replace("T", " ").slice(0, 19),
          expireAt: new Date(Date.now() + 30 * 86400000).toISOString().replace("T", " ").slice(0, 19),
          createdAt: new Date().toISOString().replace("T", " ").slice(0, 19),
        },
      ],
      consumptionRecords: [
        ...state.consumptionRecords,
        {
          id: `cr${Date.now()}`,
          userId: user.id,
          date: combo.date,
          mealType: combo.mealType,
          orderId: newOrder.id,
          orderNo,
          amount: unitPrice,
          subsidyAmount,
          balanceChange: -Math.max(0, actualPrice - user.subsidyBalance),
          subsidyChange: -Math.min(user.subsidyBalance, actualPrice),
          description: `${newOrder.stallName} - ${combo.name}`,
        },
      ],
      notifications: [
        {
          id: `n${Date.now()}`,
          userId: user.id,
          title: "订餐成功",
          content: `您已成功预订${combo.date}${
            { breakfast: "早餐", lunch: "午餐", dinner: "晚餐", supper: "夜宵" }[combo.mealType]
          }的${combo.name}，取餐码${newOrder.pickupCode}`,
          type: "success",
          isRead: false,
          createdAt: new Date().toISOString().replace("T", " ").slice(0, 19),
          link: "/orders",
        },
        ...state.notifications,
      ],
    });

    return { success: true, message: "预订成功", order: newOrder };
  },

  cancelOrder: (orderId) => {
    const state = get();
    const order = state.orders.find((o) => o.id === orderId);
    if (!order) return { success: false, message: "订单不存在" };
    if (order.status !== "booked") return { success: false, message: "该订单不可取消" };

    const deadline = new Date(order.date + " " + { breakfast: "08:00", lunch: "11:00", dinner: "17:00", supper: "21:00" }[order.mealType]);
    if (new Date() > deadline) {
      return { success: false, message: "已超过退订截止时间，请联系管理员" };
    }

    set({
      orders: state.orders.map((o) =>
        o.id === orderId
          ? { ...o, status: "cancelled" as OrderStatus, cancelledAt: new Date().toISOString().replace("T", " ").slice(0, 19) }
          : o
      ),
      currentUser: state.currentUser
        ? {
            ...state.currentUser,
            subsidyBalance: state.currentUser.subsidyBalance + order.subsidyAmount,
            balance: state.currentUser.balance + Math.max(0, order.actualAmount - order.subsidyAmount),
          }
        : null,
    });

    return { success: true, message: "退订成功，款项已退回" };
  },

  markOrderPickedUp: (orderId) => {
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId
          ? { ...o, status: "picked_up" as OrderStatus, pickedUpAt: new Date().toISOString().replace("T", " ").slice(0, 19) }
          : o
      ),
    }));
  },

  markOrderNoShow: (orderId) => {
    set((state) => ({
      orders: state.orders.map((o) => (o.id === orderId ? { ...o, status: "no_show" as OrderStatus } : o)),
    }));
  },

  markNotificationRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    }));
  },

  markAllNotificationsRead: () => {
    const user = get().currentUser;
    if (!user) return;
    set((state) => ({
      notifications: state.notifications.map((n) => (n.userId === user.id ? { ...n, isRead: true } : n)),
    }));
  },

  getUserOrders: (userId) => get().orders.filter((o) => o.userId === userId).sort((a, b) => (b.bookedAt > a.bookedAt ? 1 : -1)),

  getTodayOrders: () => get().orders.filter((o) => o.date === todayStr),

  getOrdersByStatus: (status) => get().orders.filter((o) => o.status === status),

  getFilteredOrders: (filters) => {
    return get().orders.filter((o) => {
      if (filters.date && o.date !== filters.date) return false;
      if (filters.mealType && o.mealType !== filters.mealType) return false;
      if (filters.stallId && o.stallId !== filters.stallId) return false;
      if (filters.status && o.status !== filters.status) return false;
      if (filters.keyword) {
        const kw = filters.keyword.toLowerCase();
        if (
          !o.orderNo.toLowerCase().includes(kw) &&
          !o.userName.toLowerCase().includes(kw) &&
          !o.employeeId.toLowerCase().includes(kw) &&
          !o.pickupCode.toLowerCase().includes(kw)
        ) {
          return false;
        }
      }
      return true;
    });
  },

  getMenuForDate: (date, mealType, stallId) => {
    const items = get().menuItems.filter(
      (m) => m.date === date && m.mealType === mealType && (!stallId || m.stallId === stallId)
    );
    const combos = get().comboItems.filter(
      (c) => c.date === date && c.mealType === mealType && (!stallId || c.stallId === stallId)
    );
    return { items, combos };
  },

  addDish: (dish) => {
    set((state) => ({
      dishes: [...state.dishes, { ...dish, id: `d${Date.now()}` }],
    }));
  },

  updateDish: (dish) => {
    set((state) => ({
      dishes: state.dishes.map((d) => (d.id === dish.id ? dish : d)),
    }));
  },

  toggleDishActive: (dishId) => {
    set((state) => ({
      dishes: state.dishes.map((d) => (d.id === dishId ? { ...d, isActive: !d.isActive } : d)),
    }));
  },

  addMenuItem: (item) => {
    set((state) => ({
      menuItems: [...state.menuItems, { ...item, id: `mi${Date.now()}` }],
    }));
  },

  updateMenuItem: (item) => {
    set((state) => ({
      menuItems: state.menuItems.map((m) => (m.id === item.id ? item : m)),
    }));
  },

  topUpBalance: (amount, method) => {
    const user = get().currentUser;
    if (!user) return;
    set({
      currentUser: {
        ...user,
        balance: user.balance + amount,
      },
    });
    void method;
  },

  grantSubsidy: ({ userId, amount, ruleType, ruleName }) => {
    const state = get();
    const now = new Date();
    const expire = new Date(now);
    expire.setMonth(expire.getMonth() + 1);
    const fmt = (d: Date) => d.toISOString().replace("T", " ").slice(0, 19);
    const user = state.orders.find((o) => o.userId === userId)?.userName || state.currentUser?.name || "员工";
    set({
      subsidyRecords: [
        {
          id: `sr${Date.now()}`,
          userId,
          userName: user,
          ruleType: ruleType || "special",
          ruleName: ruleName || "手动发放补贴",
          amount,
          usedAmount: 0,
          type: "grant",
          description: ruleName || "手动发放补贴",
          grantedAt: fmt(now),
          expireAt: fmt(expire),
          createdAt: fmt(now),
          operatorId: state.currentUser?.id,
          operatorName: state.currentUser?.name,
        },
        ...state.subsidyRecords,
      ],
    });
  },
}));
