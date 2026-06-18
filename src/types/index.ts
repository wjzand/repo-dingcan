export type UserRole = "super_admin" | "canteen_manager" | "stall_manager" | "employee" | "visitor";

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: "超级管理员",
  canteen_manager: "食堂经理",
  stall_manager: "档口负责人",
  employee: "普通员工",
  visitor: "访客",
};

export interface User {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  deptId?: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  email?: string;
  balance: number;
  subsidyBalance: number;
  subsidyRuleId?: string;
  stallId?: string;
  isActive?: boolean;
}

export type MealType = "breakfast" | "lunch" | "dinner" | "supper";

export const MEAL_TYPE_LABELS: Record<MealType, string> = {
  breakfast: "早餐",
  lunch: "午餐",
  dinner: "晚餐",
  supper: "夜宵",
};

export interface DishTag {
  id: string;
  name: string;
  color: string;
}

export interface Dish {
  id: string;
  name: string;
  category: string;
  ingredients: string;
  tags: DishTag[];
  costPrice: number;
  price: number;
  image?: string;
  isActive: boolean;
  stallId: string;
}

export interface MenuItem {
  id: string;
  dishId: string;
  dish: Dish;
  date: string;
  mealType: MealType;
  stallId: string;
  supplyLimit: number;
  bookedCount: number;
  subsidyPrice?: number;
  subsidyRatio?: number;
  deadline: string;
  sortOrder: number;
}

export interface ComboItem {
  id: string;
  name: string;
  description: string;
  items: { dishId: string; dishName: string; quantity: number }[];
  originalPrice: number;
  comboPrice: number;
  image?: string;
  date: string;
  mealType: MealType;
  stallId: string;
  supplyLimit: number;
  bookedCount: number;
  deadline: string;
}

export type OrderStatus = "booked" | "picked_up" | "cancelled" | "no_show";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  booked: "已预订",
  picked_up: "已核销",
  cancelled: "已取消",
  no_show: "未取餐",
};

export interface OrderItem {
  menuItemId?: string;
  comboId?: string;
  dishName: string;
  quantity: number;
  unitPrice: number;
  subsidyAmount: number;
  actualPrice: number;
}

export interface Order {
  id: string;
  orderNo: string;
  userId: string;
  userName: string;
  employeeId: string;
  department: string;
  date: string;
  mealType: MealType;
  stallId: string;
  stallName: string;
  items: OrderItem[];
  totalAmount: number;
  subsidyAmount: number;
  actualAmount: number;
  status: OrderStatus;
  pickupCode: string;
  qrCode?: string;
  bookedAt: string;
  pickedUpAt?: string;
  cancelledAt?: string;
  paymentMethod?: "balance" | "subsidy" | "mixed" | "wechat" | "alipay";
}

export interface CanteenStall {
  id: string;
  name: string;
  canteenName: string;
  description?: string;
  isActive: boolean;
}

export type SubsidyRuleType = "per_meal" | "per_day" | "per_month" | "per_role";

export const SUBSIDY_RULE_TYPE_LABELS: Record<SubsidyRuleType, string> = {
  per_meal: "按次补贴",
  per_day: "按日补贴",
  per_month: "按月补贴",
  per_role: "按角色补贴",
};

export interface SubsidyRule {
  id: string;
  name: string;
  type: SubsidyRuleType;
  amount: number;
  description: string;
  mealTypes?: MealType[];
  weekdaysOnly?: boolean;
  applicableRoles?: UserRole[];
  effectiveFrom?: string;
  effectiveTo?: string;
  isActive: boolean;
}

export interface SubsidyRecord {
  id: string;
  userId: string;
  userName: string;
  ruleId?: string;
  ruleName?: string;
  ruleType?: string;
  amount: number;
  usedAmount: number;
  type: "grant" | "consume" | "adjust";
  orderId?: string;
  description: string;
  grantedAt: string;
  expireAt: string;
  createdAt: string;
  operatorId?: string;
  operatorName?: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  parentId?: string;
  managerId?: string;
  manager?: string;
  employeeCount: number;
}

export interface ConsumptionRecord {
  id: string;
  userId: string;
  date: string;
  mealType: MealType;
  orderId: string;
  orderNo: string;
  amount: number;
  subsidyAmount: number;
  balanceChange: number;
  subsidyChange: number;
  description: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: "info" | "success" | "warning" | "danger";
  isRead: boolean;
  createdAt: string;
  link?: string;
}

export interface DashboardStats {
  todayTotalOrders: number;
  todayPickedUp: number;
  todayNoShow: number;
  todayTotalAmount: number;
  todaySubsidyAmount: number;
  todayActualAmount: number;
  bookingRate: number;
  pickupRate: number;
}

export interface DailyStats {
  date: string;
  breakfast: { booked: number; pickedUp: number };
  lunch: { booked: number; pickedUp: number };
  dinner: { booked: number; pickedUp: number };
  supper: { booked: number; pickedUp: number };
  booked: number;
  pickedUp: number;
  revenue: number;
}

export interface DishSalesRank {
  id: string;
  dishId: string;
  name: string;
  dishName: string;
  image: string;
  quantity: number;
  sales: number;
  price: number;
  revenue: number;
}

export interface StallStats {
  id: string;
  stallId: string;
  name: string;
  stallName: string;
  orderCount: number;
  revenue: number;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}
