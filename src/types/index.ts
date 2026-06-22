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

// ===== 智能备餐参谋类型定义 =====

export type FactorType = "weather" | "holiday" | "special_event" | "new_dish" | "seasonal" | "booking_speed";
export type ConfidenceLevel = "high" | "medium" | "low";
export type RiskLevel = "normal" | "attention" | "warning";
export type WeatherType = "sunny" | "cloudy" | "rainy" | "snowy" | "extreme";
export type HolidayImpact = "normal" | "slight_reduce" | "heavy_reduce" | "increase";

export const FACTOR_TYPE_LABELS: Record<FactorType, string> = {
  weather: "天气",
  holiday: "节假日",
  special_event: "特殊日程",
  new_dish: "新品",
  seasonal: "季节性",
  booking_speed: "预订速度",
};

export const FACTOR_TYPE_COLORS: Record<FactorType, string> = {
  weather: "bg-blue-100 text-blue-700 border-blue-200",
  holiday: "bg-orange-100 text-orange-700 border-orange-200",
  special_event: "bg-purple-100 text-purple-700 border-purple-200",
  new_dish: "bg-pink-100 text-pink-700 border-pink-200",
  seasonal: "bg-green-100 text-green-700 border-green-200",
  booking_speed: "bg-red-100 text-red-700 border-red-200",
};

export const CONFIDENCE_LABELS: Record<ConfidenceLevel, string> = {
  high: "高置信",
  medium: "中置信",
  low: "低置信",
};

export const CONFIDENCE_COLORS: Record<ConfidenceLevel, string> = {
  high: "bg-success-100 text-success-700",
  medium: "bg-warning-100 text-warning-700",
  low: "bg-danger-100 text-danger-700",
};

export const RISK_LABELS: Record<RiskLevel, string> = {
  normal: "正常",
  attention: "注意",
  warning: "预警",
};

export const RISK_COLORS: Record<RiskLevel, string> = {
  normal: "bg-success-500",
  attention: "bg-warning-500",
  warning: "bg-danger-500",
};

export const WEATHER_LABELS: Record<WeatherType, string> = {
  sunny: "晴天",
  cloudy: "多云",
  rainy: "雨天",
  snowy: "雪天",
  extreme: "极端天气",
};

export interface MealPrepFactor {
  type: FactorType;
  name: string;
  impact: number;
  description: string;
}

export interface MealPrepDishSuggestion {
  id: string;
  dishId: string;
  dishName: string;
  stallId: string;
  stallName: string;
  suggestedMin: number;
  suggestedMax: number;
  suggestedAmount: number;
  currentBooking: number;
  historicalAvg: number;
  lastWeekSales: number;
  factors: MealPrepFactor[];
  confidence: ConfidenceLevel;
  riskLevel: RiskLevel;
  finalAmount: number;
  adjustmentReason?: string;
  lastShortage?: number;
  lastSurplus?: number;
}

export interface MealPrepSuggestion {
  id: string;
  date: string;
  mealType: MealType;
  generatedAt: string;
  expectedTotalPeople: number;
  suggestedTotalServings: number;
  currentTotalBookings: number;
  bookingRate: number;
  overallRisk: RiskLevel;
  dishes: MealPrepDishSuggestion[];
  weather?: WeatherType;
  temperature?: number;
  isHoliday?: boolean;
  specialEvent?: string;
}

export interface MealPrepReview {
  id: string;
  date: string;
  mealType: MealType;
  totalPrepped: number;
  totalPickedUp: number;
  shortageRate: number;
  surplusRate: number;
  accuracyScore: number;
  dishReviews: {
    dishId: string;
    dishName: string;
    preppedAmount: number;
    pickedUpAmount: number;
    diff: number;
    diffPercent: number;
    factors: MealPrepFactor[];
    reason: string;
  }[];
  suggestions: string[];
}

export interface WeatherFactorConfig {
  type: WeatherType;
  impact: number;
  description: string;
}

export interface SpecialEventConfig {
  id: string;
  date: string;
  name: string;
  impact: HolidayImpact;
  impactPercent: number;
  description: string;
}

export interface SeasonalFactorConfig {
  month: number;
  impact: number;
  description: string;
}

export interface MealPrepAlert {
  id: string;
  type: "shortage_risk" | "surplus_risk" | "booking_abnormal";
  dishId: string;
  dishName: string;
  message: string;
  currentBooking: number;
  suggestedAmount: number;
  threshold: number;
  createdAt: string;
  acknowledged: boolean;
}
