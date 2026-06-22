import type {
  User,
  Dish,
  DishTag,
  MenuItem,
  ComboItem,
  Order,
  CanteenStall,
  SubsidyRule,
  SubsidyRecord,
  Department,
  ConsumptionRecord,
  Notification,
  DailyStats,
  DishSalesRank,
  StallStats,
  MealType,
  OrderStatus,
  MealPrepSuggestion,
  MealPrepDishSuggestion,
  MealPrepReview,
  WeatherFactorConfig,
  SpecialEventConfig,
  SeasonalFactorConfig,
  MealPrepAlert,
  ConfidenceLevel,
  RiskLevel,
  WeatherType,
} from "@/types";

const today = new Date();
const formatDate = (d: Date) => d.toISOString().split("T")[0];
const todayStr = formatDate(today);
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const tomorrowStr = formatDate(tomorrow);
const dayAfter = new Date(today);
dayAfter.setDate(today.getDate() + 2);
const dayAfterStr = formatDate(dayAfter);

export const DISH_TAGS: DishTag[] = [
  { id: "t1", name: "辣", color: "#EF4444" },
  { id: "t2", name: "不辣", color: "#22C55E" },
  { id: "t3", name: "荤菜", color: "#F97316" },
  { id: "t4", name: "素菜", color: "#10B981" },
  { id: "t5", name: "主食", color: "#8B5CF6" },
  { id: "t6", name: "清真", color: "#3B82F6" },
  { id: "t7", name: "低脂", color: "#EC4899" },
  { id: "t8", name: "推荐", color: "#F59E0B" },
];

export const STALLS: CanteenStall[] = [
  { id: "s1", name: "一号档口（家常菜）", canteenName: "主食堂一楼", description: "家常炒菜、米饭套餐", isActive: true },
  { id: "s2", name: "二号档口（面食）", canteenName: "主食堂一楼", description: "面条、饺子、馄饨", isActive: true },
  { id: "s3", name: "三号档口（快餐）", canteenName: "主食堂二楼", description: "西式快餐、汉堡、炸鸡", isActive: true },
  { id: "s4", name: "四号档口（特色）", canteenName: "主食堂二楼", description: "地方特色菜、砂锅", isActive: true },
];

export const DISHES: Dish[] = [
  {
    id: "d1",
    name: "红烧肉",
    category: "荤菜",
    ingredients: "五花肉、冰糖、老抽、生抽",
    tags: [DISH_TAGS[2], DISH_TAGS[0], DISH_TAGS[7]],
    costPrice: 8,
    price: 18,
    image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=braised%20pork%20belly%20hongshaorou%20chinese%20food%20delicious%20photography&image_size=square",
    isActive: true,
    stallId: "s1",
  },
  {
    id: "d2",
    name: "宫保鸡丁",
    category: "荤菜",
    ingredients: "鸡胸肉、花生米、干辣椒、黄瓜",
    tags: [DISH_TAGS[2], DISH_TAGS[0], DISH_TAGS[7]],
    costPrice: 6,
    price: 16,
    image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=kung%20pao%20chicken%20gongbao%20jiding%20chinese%20dish%20peanuts%20photography&image_size=square",
    isActive: true,
    stallId: "s1",
  },
  {
    id: "d3",
    name: "麻婆豆腐",
    category: "素菜",
    ingredients: "嫩豆腐、豆瓣酱、花椒、肉末",
    tags: [DISH_TAGS[3], DISH_TAGS[0]],
    costPrice: 3,
    price: 8,
    image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=mapo%20tofu%20chinese%20sichuan%20spicy%20dish%20food%20photography&image_size=square",
    isActive: true,
    stallId: "s1",
  },
  {
    id: "d4",
    name: "清炒时蔬",
    category: "素菜",
    ingredients: "时令青菜、蒜末、盐",
    tags: [DISH_TAGS[3], DISH_TAGS[1], DISH_TAGS[6]],
    costPrice: 2,
    price: 6,
    image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=stir%20fried%20green%20vegetables%20chinese%20qingchao%20shucai%20food%20photography&image_size=square",
    isActive: true,
    stallId: "s1",
  },
  {
    id: "d5",
    name: "白米饭",
    category: "主食",
    ingredients: "东北大米",
    tags: [DISH_TAGS[4], DISH_TAGS[1]],
    costPrice: 0.5,
    price: 2,
    image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=bowl%20of%20white%20rice%20steamed%20japanese%20chinese%20food%20photography&image_size=square",
    isActive: true,
    stallId: "s1",
  },
  {
    id: "d6",
    name: "番茄鸡蛋汤",
    category: "汤品",
    ingredients: "番茄、鸡蛋、葱花",
    tags: [DISH_TAGS[1], DISH_TAGS[6]],
    costPrice: 2,
    price: 5,
    image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=tomato%20egg%20soup%20chinese%20fanqie%20jidan%20tang%20food%20photography&image_size=square",
    isActive: true,
    stallId: "s1",
  },
  {
    id: "d7",
    name: "牛肉面",
    category: "面食",
    ingredients: "手工拉面、卤牛肉、青菜、香菜",
    tags: [DISH_TAGS[2], DISH_TAGS[7]],
    costPrice: 7,
    price: 20,
    image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beef%20noodle%20soup%20lanzhou%20lamian%20chinese%20food%20photography&image_size=square",
    isActive: true,
    stallId: "s2",
  },
  {
    id: "d8",
    name: "炸酱面",
    category: "面食",
    ingredients: "手擀面、肉臊子、黄瓜丝、豆芽",
    tags: [DISH_TAGS[2]],
    costPrice: 5,
    price: 15,
    image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=zhajiang%20noodles%20beijing%20style%20noodles%20with%20meat%20sauce%20food%20photography&image_size=square",
    isActive: true,
    stallId: "s2",
  },
  {
    id: "d9",
    name: "猪肉白菜饺子",
    category: "面食",
    ingredients: "面粉、猪肉、白菜、葱姜",
    tags: [DISH_TAGS[2], DISH_TAGS[1]],
    costPrice: 6,
    price: 18,
    image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20pork%20dumplings%20jiaozi%20with%20cabbage%20food%20photography&image_size=square",
    isActive: true,
    stallId: "s2",
  },
  {
    id: "d10",
    name: "汉堡套餐",
    category: "快餐",
    ingredients: "牛肉饼、面包、生菜、番茄、芝士",
    tags: [DISH_TAGS[2]],
    costPrice: 10,
    price: 28,
    image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beef%20cheeseburger%20meal%20with%20fries%20fast%20food%20photography&image_size=square",
    isActive: true,
    stallId: "s3",
  },
  {
    id: "d11",
    name: "黄焖鸡米饭",
    category: "特色",
    ingredients: "鸡腿肉、香菇、青椒、米饭",
    tags: [DISH_TAGS[2], DISH_TAGS[7]],
    costPrice: 7,
    price: 22,
    image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=braised%20chicken%20rice%20huangmen%20ji%20chinese%20casserole%20food%20photography&image_size=square",
    isActive: true,
    stallId: "s4",
  },
  {
    id: "d12",
    name: "皮蛋瘦肉粥",
    category: "早餐",
    ingredients: "大米、皮蛋、瘦肉、葱花",
    tags: [DISH_TAGS[1], DISH_TAGS[6]],
    costPrice: 2,
    price: 8,
    image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=century%20egg%20lean%20meat%20congee%20chinese%20porridge%20food%20photography&image_size=square",
    isActive: true,
    stallId: "s1",
  },
  {
    id: "d13",
    name: "油条",
    category: "早餐",
    ingredients: "面粉、食用油",
    tags: [DISH_TAGS[4], DISH_TAGS[1]],
    costPrice: 0.5,
    price: 3,
    image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20fried%20dough%20youtiao%20breakfast%20food%20photography&image_size=square",
    isActive: true,
    stallId: "s1",
  },
  {
    id: "d14",
    name: "茶叶蛋",
    category: "早餐",
    ingredients: "鸡蛋、茶叶、八角、桂皮",
    tags: [DISH_TAGS[1]],
    costPrice: 0.5,
    price: 2,
    image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20tea%20egg%20chayedan%20breakfast%20marbled%20food%20photography&image_size=square",
    isActive: true,
    stallId: "s1",
  },
  {
    id: "d15",
    name: "小笼包",
    category: "早餐",
    ingredients: "面粉、猪肉、皮冻",
    tags: [DISH_TAGS[2], DISH_TAGS[7]],
    costPrice: 4,
    price: 12,
    image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=shanghai%20xiaolongbao%20soup%20dumplings%20chinese%20dim%20sum%20food%20photography&image_size=square",
    isActive: true,
    stallId: "s2",
  },
];

const baseDish = (dishId: string, date: string, mealType: MealType, stallId: string, idx: number): MenuItem | null => {
  const dish = DISHES.find(d => d.id === dishId);
  if (!dish) return null;
  const deadlineMap: Record<MealType, string> = {
    breakfast: `${date} 08:00:00`,
    lunch: `${date} 11:00:00`,
    dinner: `${date} 17:00:00`,
    supper: `${date} 21:00:00`,
  };
  return {
    id: `mi-${dishId}-${date}-${mealType}-${idx}`,
    dishId,
    dish,
    date,
    mealType,
    stallId,
    supplyLimit: 100 + Math.floor(Math.random() * 100),
    bookedCount: Math.floor(Math.random() * 80),
    subsidyPrice: Math.max(1, dish.price - 10),
    subsidyRatio: 0.5,
    deadline: deadlineMap[mealType],
    sortOrder: idx,
  };
};

export const MENU_ITEMS: MenuItem[] = [
  baseDish("d12", todayStr, "breakfast", "s1", 1),
  baseDish("d13", todayStr, "breakfast", "s1", 2),
  baseDish("d14", todayStr, "breakfast", "s1", 3),
  baseDish("d15", todayStr, "breakfast", "s2", 1),
  baseDish("d5", todayStr, "breakfast", "s1", 4),
  baseDish("d1", todayStr, "lunch", "s1", 1),
  baseDish("d2", todayStr, "lunch", "s1", 2),
  baseDish("d3", todayStr, "lunch", "s1", 3),
  baseDish("d4", todayStr, "lunch", "s1", 4),
  baseDish("d5", todayStr, "lunch", "s1", 5),
  baseDish("d6", todayStr, "lunch", "s1", 6),
  baseDish("d7", todayStr, "lunch", "s2", 1),
  baseDish("d8", todayStr, "lunch", "s2", 2),
  baseDish("d9", todayStr, "lunch", "s2", 3),
  baseDish("d10", todayStr, "lunch", "s3", 1),
  baseDish("d11", todayStr, "lunch", "s4", 1),
  baseDish("d1", todayStr, "dinner", "s1", 1),
  baseDish("d3", todayStr, "dinner", "s1", 2),
  baseDish("d4", todayStr, "dinner", "s1", 3),
  baseDish("d5", todayStr, "dinner", "s1", 4),
  baseDish("d7", todayStr, "dinner", "s2", 1),
  baseDish("d10", todayStr, "dinner", "s3", 1),
  baseDish("d11", todayStr, "dinner", "s4", 1),
  baseDish("d12", tomorrowStr, "breakfast", "s1", 1),
  baseDish("d13", tomorrowStr, "breakfast", "s1", 2),
  baseDish("d14", tomorrowStr, "breakfast", "s1", 3),
  baseDish("d15", tomorrowStr, "breakfast", "s2", 1),
  baseDish("d1", tomorrowStr, "lunch", "s1", 1),
  baseDish("d2", tomorrowStr, "lunch", "s1", 2),
  baseDish("d3", tomorrowStr, "lunch", "s1", 3),
  baseDish("d5", tomorrowStr, "lunch", "s1", 4),
  baseDish("d7", tomorrowStr, "lunch", "s2", 1),
  baseDish("d8", tomorrowStr, "lunch", "s2", 2),
  baseDish("d10", tomorrowStr, "lunch", "s3", 1),
  baseDish("d11", tomorrowStr, "lunch", "s4", 1),
].filter(Boolean) as MenuItem[];

export const COMBO_ITEMS: ComboItem[] = [
  {
    id: "c1",
    name: "红烧肉套餐",
    description: "红烧肉 + 清炒时蔬 + 白米饭 + 番茄鸡蛋汤",
    items: [
      { dishId: "d1", dishName: "红烧肉", quantity: 1 },
      { dishId: "d4", dishName: "清炒时蔬", quantity: 1 },
      { dishId: "d5", dishName: "白米饭", quantity: 1 },
      { dishId: "d6", dishName: "番茄鸡蛋汤", quantity: 1 },
    ],
    originalPrice: 37,
    comboPrice: 28,
    image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=braised%20pork%20belly%20combo%20meal%20set%20lunch%20box%20chinese%20food%20photography&image_size=square",
    date: todayStr,
    mealType: "lunch",
    stallId: "s1",
    supplyLimit: 50,
    bookedCount: 32,
    deadline: `${todayStr} 11:00:00`,
  },
  {
    id: "c2",
    name: "宫保鸡丁套餐",
    description: "宫保鸡丁 + 麻婆豆腐 + 白米饭 + 番茄鸡蛋汤",
    items: [
      { dishId: "d2", dishName: "宫保鸡丁", quantity: 1 },
      { dishId: "d3", dishName: "麻婆豆腐", quantity: 1 },
      { dishId: "d5", dishName: "白米饭", quantity: 1 },
      { dishId: "d6", dishName: "番茄鸡蛋汤", quantity: 1 },
    ],
    originalPrice: 31,
    comboPrice: 25,
    image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=kung%20pao%20chicken%20combo%20meal%20set%20lunch%20box%20chinese%20food%20photography&image_size=square",
    date: todayStr,
    mealType: "lunch",
    stallId: "s1",
    supplyLimit: 50,
    bookedCount: 28,
    deadline: `${todayStr} 11:00:00`,
  },
  {
    id: "c3",
    name: "营养早餐套餐",
    description: "皮蛋瘦肉粥 + 油条 + 茶叶蛋",
    items: [
      { dishId: "d12", dishName: "皮蛋瘦肉粥", quantity: 1 },
      { dishId: "d13", dishName: "油条", quantity: 2 },
      { dishId: "d14", dishName: "茶叶蛋", quantity: 1 },
    ],
    originalPrice: 15,
    comboPrice: 12,
    image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20breakfast%20set%20congee%20you%20tiao%20tea%20egg%20food%20photography&image_size=square",
    date: todayStr,
    mealType: "breakfast",
    stallId: "s1",
    supplyLimit: 80,
    bookedCount: 45,
    deadline: `${todayStr} 08:00:00`,
  },
  {
    id: "c4",
    name: "黄焖鸡米饭套餐",
    description: "黄焖鸡米饭 + 清炒时蔬 + 汤",
    items: [
      { dishId: "d11", dishName: "黄焖鸡米饭", quantity: 1 },
      { dishId: "d4", dishName: "清炒时蔬", quantity: 1 },
      { dishId: "d6", dishName: "番茄鸡蛋汤", quantity: 1 },
    ],
    originalPrice: 33,
    comboPrice: 28,
    image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=braised%20chicken%20rice%20combo%20set%20lunch%20box%20food%20photography&image_size=square",
    date: todayStr,
    mealType: "lunch",
    stallId: "s4",
    supplyLimit: 50,
    bookedCount: 35,
    deadline: `${todayStr} 11:00:00`,
  },
];

export const USERS: User[] = [
  {
    id: "u1",
    name: "张小明",
    employeeId: "EMP001",
    department: "技术研发部",
    deptId: "dep1",
    role: "employee",
    balance: 256.5,
    subsidyBalance: 180,
    subsidyRuleId: "r1",
    phone: "13800138001",
    email: "zhangxm@company.com",
    isActive: true,
  },
  {
    id: "u2",
    name: "李华",
    employeeId: "EMP002",
    department: "市场部",
    deptId: "dep2",
    role: "employee",
    balance: 189.0,
    subsidyBalance: 200,
    subsidyRuleId: "r1",
    phone: "13800138002",
    email: "lihua@company.com",
    isActive: true,
  },
  {
    id: "u3",
    name: "王芳",
    employeeId: "EMP003",
    department: "人力资源部",
    deptId: "dep3",
    role: "employee",
    balance: 312.0,
    subsidyBalance: 150,
    subsidyRuleId: "r1",
    phone: "13800138003",
    email: "wangfang@company.com",
    isActive: true,
  },
  {
    id: "u4",
    name: "赵经理",
    employeeId: "MAN001",
    department: "食堂管理",
    deptId: "dep9",
    role: "canteen_manager",
    balance: 0,
    subsidyBalance: 0,
    phone: "13900139001",
    email: "zhaojl@company.com",
    isActive: true,
  },
  {
    id: "u5",
    name: "陈大厨",
    employeeId: "STL001",
    department: "食堂管理",
    deptId: "dep9",
    role: "stall_manager",
    balance: 0,
    subsidyBalance: 0,
    stallId: "s1",
    phone: "13900139002",
    email: "chendc@company.com",
    isActive: true,
  },
  {
    id: "u6",
    name: "超级管理员",
    employeeId: "ADM001",
    department: "信息中心",
    deptId: "dep8",
    role: "super_admin",
    balance: 0,
    subsidyBalance: 0,
    phone: "13900139000",
    email: "admin@company.com",
    isActive: true,
  },
  {
    id: "u7",
    name: "刘强",
    employeeId: "EMP004",
    department: "财务部",
    deptId: "dep4",
    role: "employee",
    balance: 145.5,
    subsidyBalance: 160,
    subsidyRuleId: "r1",
    phone: "13800138004",
    email: "liuqiang@company.com",
    isActive: true,
  },
  {
    id: "u8",
    name: "孙丽",
    employeeId: "EMP005",
    department: "技术研发部",
    deptId: "dep1",
    role: "employee",
    balance: 278.0,
    subsidyBalance: 220,
    subsidyRuleId: "r1",
    phone: "13800138005",
    email: "sunli@company.com",
    isActive: true,
  },
];

export const CURRENT_USER: User = USERS[0];

export const ADMIN_USER: User = USERS[3];
export const STALL_USER: User = USERS[4];
export const SUPER_USER: User = USERS[5];

const pickStatus = (i: number): OrderStatus => {
  const r = i % 5;
  if (r === 0) return "picked_up";
  if (r === 1) return "booked";
  if (r === 2) return "no_show";
  if (r === 3) return "cancelled";
  return "booked";
};

export const ORDERS: Order[] = [
  {
    id: "o1",
    orderNo: "DD20260618001",
    userId: "u1",
    userName: "张小明",
    employeeId: "EMP001",
    department: "技术研发部",
    date: todayStr,
    mealType: "lunch",
    stallId: "s1",
    stallName: "一号档口（家常菜）",
    items: [
      { menuItemId: "mi-d1-lunch", dishName: "红烧肉套餐", quantity: 1, unitPrice: 37, subsidyAmount: 10, actualPrice: 18 },
    ],
    totalAmount: 37,
    subsidyAmount: 10,
    actualAmount: 28,
    status: "booked",
    pickupCode: "A8821",
    bookedAt: `${todayStr} 09:15:30`,
    paymentMethod: "mixed",
  },
  {
    id: "o2",
    orderNo: "DD20260618002",
    userId: "u1",
    userName: "张小明",
    employeeId: "EMP001",
    department: "技术研发部",
    date: todayStr,
    mealType: "breakfast",
    stallId: "s1",
    stallName: "一号档口（家常菜）",
    items: [
      { menuItemId: "mi-c3-breakfast", dishName: "营养早餐套餐", quantity: 1, unitPrice: 15, subsidyAmount: 5, actualPrice: 7 },
    ],
    totalAmount: 15,
    subsidyAmount: 5,
    actualAmount: 12,
    status: "picked_up",
    pickupCode: "B3342",
    bookedAt: `${todayStr} 07:20:15`,
    pickedUpAt: `${todayStr} 07:45:22`,
    paymentMethod: "subsidy",
  },
  {
    id: "o3",
    orderNo: "DD20260617003",
    userId: "u1",
    userName: "张小明",
    employeeId: "EMP001",
    department: "技术研发部",
    date: new Date(today.getTime() - 86400000).toISOString().split("T")[0],
    mealType: "dinner",
    stallId: "s4",
    stallName: "四号档口（特色）",
    items: [
      { menuItemId: "mi-d11-dinner", dishName: "黄焖鸡米饭套餐", quantity: 1, unitPrice: 33, subsidyAmount: 10, actualPrice: 18 },
    ],
    totalAmount: 33,
    subsidyAmount: 10,
    actualAmount: 28,
    status: "picked_up",
    pickupCode: "C5512",
    bookedAt: `${new Date(today.getTime() - 86400000).toISOString().split("T")[0]} 16:30:00`,
    pickedUpAt: `${new Date(today.getTime() - 86400000).toISOString().split("T")[0]} 18:12:45`,
    paymentMethod: "mixed",
  },
  {
    id: "o4",
    orderNo: "DD20260617004",
    userId: "u1",
    userName: "张小明",
    employeeId: "EMP001",
    department: "技术研发部",
    date: new Date(today.getTime() - 86400000).toISOString().split("T")[0],
    mealType: "lunch",
    stallId: "s2",
    stallName: "二号档口（面食）",
    items: [
      { menuItemId: "mi-d7-lunch", dishName: "牛肉面", quantity: 1, unitPrice: 20, subsidyAmount: 10, actualPrice: 10 },
    ],
    totalAmount: 20,
    subsidyAmount: 10,
    actualAmount: 10,
    status: "cancelled",
    pickupCode: "D7781",
    bookedAt: `${new Date(today.getTime() - 86400000).toISOString().split("T")[0]} 09:30:00`,
    cancelledAt: `${new Date(today.getTime() - 86400000).toISOString().split("T")[0]} 10:15:00`,
    paymentMethod: "subsidy",
  },
  ...Array.from({ length: 45 }, (_, i) => {
    const user = USERS[(i + 1) % USERS.filter(u => u.role === "employee").length];
    const mealTypes: MealType[] = ["breakfast", "lunch", "dinner"];
    const mealType = mealTypes[i % 3];
    const dishes = MENU_ITEMS.filter(m => m.mealType === mealType && m.date === todayStr);
    const dish = dishes[i % dishes.length];
    const date = i < 10 ? todayStr : new Date(today.getTime() - (Math.floor(i / 10) * 86400000)).toISOString().split("T")[0];
    const stall = STALLS.find(s => s.id === dish?.stallId) || STALLS[0];
    return {
      id: `o${i + 100}`,
      orderNo: `DD${date.replace(/-/g, "")}${String(i + 100).padStart(3, "0")}`,
      userId: user.id,
      userName: user.name,
      employeeId: user.employeeId,
      department: user.department,
      date,
      mealType,
      stallId: stall.id,
      stallName: stall.name,
      items: [
        {
          menuItemId: dish?.id || "mi-unknown",
          dishName: dish?.dish?.name || "未知菜品",
          quantity: 1,
          unitPrice: dish?.dish?.price || 15,
          subsidyAmount: 10,
          actualPrice: (dish?.dish?.price || 15) - 10,
        },
      ],
      totalAmount: dish?.dish?.price || 15,
      subsidyAmount: 10,
      actualAmount: (dish?.dish?.price || 15) - 10,
      status: pickStatus(i),
      pickupCode: `${String.fromCharCode(65 + (i % 26))}${String(1000 + i)}`,
      bookedAt: `${date} 0${9 + (i % 3)}:${String(10 + i % 50).padStart(2, "0")}:00`,
      pickedUpAt: pickStatus(i) === "picked_up" ? `${date} 1${1 + (i % 2)}:${String(20 + i % 40).padStart(2, "0")}:00` : undefined,
      paymentMethod: (["balance", "subsidy", "mixed"] as const)[i % 3] as Order["paymentMethod"],
    } as Order;
  }),
];

export const SUBSIDY_RULES: SubsidyRule[] = [
  {
    id: "r1",
    name: "员工每餐补贴",
    type: "per_meal",
    amount: 10,
    description: "每顿餐补10元，早餐、午餐、晚餐可享受，周末不享受",
    mealTypes: ["breakfast", "lunch", "dinner"],
    weekdaysOnly: true,
    applicableRoles: ["employee"],
    isActive: true,
  },
  {
    id: "r2",
    name: "工作日每日补贴",
    type: "per_day",
    amount: 25,
    description: "工作日每天补贴25元，按日结算发放到餐补账户",
    weekdaysOnly: true,
    applicableRoles: ["employee"],
    isActive: true,
  },
  {
    id: "r3",
    name: "月度餐补",
    type: "per_month",
    amount: 400,
    description: "每月1日自动发放400元餐补，当月有效，过期作废",
    applicableRoles: ["employee"],
    isActive: true,
    effectiveFrom: "2026-01-01",
  },
  {
    id: "r4",
    name: "访客无补贴",
    type: "per_role",
    amount: 0,
    description: "访客等临时人员无餐补，需全额自费就餐",
    applicableRoles: ["visitor"],
    isActive: true,
  },
];

export const SUBSIDY_RECORDS: SubsidyRecord[] = [
  {
    id: "sr1",
    userId: "u1",
    userName: "张小明",
    ruleId: "r3",
    ruleName: "月度餐补",
    ruleType: "per_month",
    amount: 400,
    usedAmount: 185,
    type: "grant",
    description: "2026年6月月度餐补发放",
    grantedAt: "2026-06-01 08:00:00",
    expireAt: "2026-06-30 23:59:59",
    createdAt: "2026-06-01 08:00:00",
    operatorId: "u6",
    operatorName: "超级管理员",
  },
  {
    id: "sr2",
    userId: "u1",
    userName: "张小明",
    ruleName: "按次补贴",
    ruleType: "per_meal",
    orderId: "o2",
    amount: 400,
    usedAmount: 5,
    type: "consume",
    description: "订单DD20260618002餐补抵扣",
    grantedAt: "2026-06-01 08:00:00",
    expireAt: "2026-06-30 23:59:59",
    createdAt: `${todayStr} 07:20:16`,
  },
  {
    id: "sr3",
    userId: "u1",
    userName: "张小明",
    ruleName: "按次补贴",
    ruleType: "per_meal",
    orderId: "o1",
    amount: 400,
    usedAmount: 10,
    type: "consume",
    description: "订单DD20260618001餐补抵扣",
    grantedAt: "2026-06-01 08:00:00",
    expireAt: "2026-06-30 23:59:59",
    createdAt: `${todayStr} 09:15:31`,
  },
  {
    id: "sr4",
    userId: "u1",
    userName: "张小明",
    ruleName: "按次补贴",
    ruleType: "per_meal",
    orderId: "o3",
    amount: 400,
    usedAmount: 10,
    type: "consume",
    description: "订单DD20260617003餐补抵扣",
    grantedAt: "2026-06-01 08:00:00",
    expireAt: "2026-06-30 23:59:59",
    createdAt: `${new Date(today.getTime() - 86400000).toISOString().split("T")[0]} 16:30:01`,
  },
  {
    id: "sr5",
    userId: "u1",
    userName: "张小明",
    ruleName: "加班餐补",
    ruleType: "special",
    amount: 50,
    usedAmount: 0,
    type: "adjust",
    description: "加班餐补调整",
    grantedAt: "2026-06-15 14:30:00",
    expireAt: "2026-07-15 23:59:59",
    createdAt: "2026-06-15 14:30:00",
    operatorId: "u4",
    operatorName: "赵经理",
  },
];

export const DEPARTMENTS: Department[] = [
  { id: "dep1", code: "TECH", name: "技术研发部", manager: "王建国", employeeCount: 58 },
  { id: "dep2", code: "MKT", name: "市场部", manager: "李海峰", employeeCount: 32 },
  { id: "dep3", code: "HR", name: "人力资源部", manager: "王芳", employeeCount: 15 },
  { id: "dep4", code: "FIN", name: "财务部", manager: "刘强", employeeCount: 12 },
  { id: "dep5", code: "ADM", name: "行政部", manager: "赵敏", employeeCount: 18 },
  { id: "dep6", code: "SAL", name: "销售部", manager: "陈刚", employeeCount: 45 },
  { id: "dep7", code: "PROD", name: "产品部", manager: "周婷", employeeCount: 25 },
  { id: "dep8", code: "IT", name: "信息中心", manager: "超级管理员", employeeCount: 8 },
  { id: "dep9", code: "CAN", name: "食堂管理", manager: "赵经理", employeeCount: 22 },
];

export const CONSUMPTION_RECORDS: ConsumptionRecord[] = SUBSIDY_RECORDS.filter(sr => sr.orderId).map((sr, i) => {
  const order = ORDERS.find(o => o.id === sr.orderId)!;
  return {
    id: `cr${i + 1}`,
    userId: sr.userId,
    date: order.date,
    mealType: order.mealType,
    orderId: order.id,
    orderNo: order.orderNo,
    amount: order.totalAmount,
    subsidyAmount: order.subsidyAmount,
    balanceChange: -(order.actualAmount - 5),
    subsidyChange: -order.subsidyAmount,
    description: `${order.stallName} - ${order.items[0].dishName}`,
  };
});

export const NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    userId: "u1",
    title: "订餐成功",
    content: "您已成功预订今日午餐的红烧肉套餐，取餐码A8821",
    type: "success",
    isRead: false,
    createdAt: `${todayStr} 09:15:32`,
    link: "/orders",
  },
  {
    id: "n2",
    userId: "u1",
    title: "取餐提醒",
    content: "午餐已开始供应，请前往一号档口凭取餐码取餐",
    type: "info",
    isRead: false,
    createdAt: `${todayStr} 11:30:00`,
    link: "/orders",
  },
  {
    id: "n3",
    userId: "u1",
    title: "余额不足提醒",
    content: "您的自费余额已不足100元，请及时充值",
    type: "warning",
    isRead: true,
    createdAt: "2026-06-17 18:00:00",
    link: "/balance",
  },
  {
    id: "n4",
    userId: "u1",
    title: "菜单更新通知",
    content: "明天的午餐菜单已更新，欢迎提前预订",
    type: "info",
    isRead: true,
    createdAt: `${tomorrowStr} 17:00:00`,
    link: "/",
  },
  {
    id: "n5",
    userId: "u1",
    title: "餐补发放成功",
    content: "2026年6月餐补400元已发放至您的账户",
    type: "success",
    isRead: true,
    createdAt: "2026-06-01 08:00:01",
  },
];

export const DAILY_STATS: DailyStats[] = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(today);
  d.setDate(today.getDate() - i);
  const dateStr = formatDate(d);
  const breakfast = { booked: 80 + Math.floor(Math.random() * 40), pickedUp: 70 + Math.floor(Math.random() * 35) };
  const lunch = { booked: 180 + Math.floor(Math.random() * 50), pickedUp: 160 + Math.floor(Math.random() * 45) };
  const dinner = { booked: 60 + Math.floor(Math.random() * 40), pickedUp: 50 + Math.floor(Math.random() * 35) };
  const supper = { booked: 10 + Math.floor(Math.random() * 20), pickedUp: 8 + Math.floor(Math.random() * 15) };
  const booked = breakfast.booked + lunch.booked + dinner.booked + supper.booked;
  const pickedUp = breakfast.pickedUp + lunch.pickedUp + dinner.pickedUp + supper.pickedUp;
  return {
    date: dateStr,
    breakfast,
    lunch,
    dinner,
    supper,
    booked,
    pickedUp,
    revenue: pickedUp * 18 + Math.floor(Math.random() * 2000),
  };
}).reverse();

export const DISH_SALES_RANK: DishSalesRank[] = DISHES.slice(0, 10).map(d => {
  const sales = 50 + Math.floor(Math.random() * 200);
  return {
    id: d.id,
    dishId: d.id,
    name: d.name,
    dishName: d.name,
    image: d.image || "",
    quantity: sales,
    sales,
    price: d.price,
    revenue: sales * d.price,
  };
}).sort((a, b) => b.sales - a.sales);

export const STALL_STATS: StallStats[] = STALLS.map(s => {
  const count = 100 + Math.floor(Math.random() * 300);
  return {
    id: s.id,
    stallId: s.id,
    name: s.name,
    stallName: s.name,
    orderCount: count,
    revenue: count * 20 + Math.floor(Math.random() * 2000),
  };
});

// ===== 智能备餐参谋Mock数据 =====

function generatePrepFactors(dishName: string, weather: WeatherType, isHoliday: boolean) {
  const factors = [];
  if (weather === "rainy") {
    factors.push({ type: "weather" as const, name: "雨天", impact: -10, description: "降雨降低到店意愿，预计减少10%" });
  } else if (weather === "extreme") {
    factors.push({ type: "weather" as const, name: "极端天气", impact: -25, description: "极端天气大幅减少就餐人数，预计减少25%" });
  } else if (weather === "sunny") {
    factors.push({ type: "weather" as const, name: "晴天", impact: 5, description: "晴好天气增加就餐意愿，预计增加5%" });
  }
  if (isHoliday) {
    factors.push({ type: "holiday" as const, name: "假期前夕", impact: -20, description: "假期前最后一个工作日，预计减少20%" });
  }
  if (dishName.includes("新品") || dishName.includes("黄焖")) {
    factors.push({ type: "new_dish" as const, name: "新品上市", impact: 15, description: "新品推广期，参考同类菜品销量预计增加15%" });
  }
  if (Math.random() > 0.7) {
    factors.push({ type: "booking_speed" as const, name: "预订较快", impact: 10, description: "当前预订速度高于历史同期12%，建议增加备餐" });
  }
  return factors;
}

function calcConfidence(factors: any[]): ConfidenceLevel {
  if (factors.length === 0) return "high";
  if (factors.some(f => f.type === "new_dish")) return "low";
  if (factors.some(f => f.type === "extreme")) return "medium";
  return factors.length <= 2 ? "high" : "medium";
}

function calcRiskLevel(booking: number, suggested: number): RiskLevel {
  const ratio = booking / suggested;
  if (ratio >= 0.9 || ratio <= 0.2) return "warning";
  if (ratio >= 0.7 || ratio <= 0.4) return "attention";
  return "normal";
}

export const WEATHER_CONFIG: WeatherFactorConfig[] = [
  { type: "sunny", impact: 5, description: "晴好天气增加5%就餐意愿" },
  { type: "cloudy", impact: 0, description: "多云天气对就餐无明显影响" },
  { type: "rainy", impact: -15, description: "雨天降低15%到店就餐意愿" },
  { type: "snowy", impact: -20, description: "雪天降低20%到店就餐意愿" },
  { type: "extreme", impact: -30, description: "极端天气降低30%到店就餐意愿" },
];

export const SEASONAL_CONFIG: SeasonalFactorConfig[] = [
  { month: 1, impact: -5, description: "1月冬季寒冷，略有减少" },
  { month: 2, impact: -10, description: "2月春节假期，大幅减少" },
  { month: 7, impact: -8, description: "7月炎热天气，略有减少" },
  { month: 8, impact: -5, description: "8月高温，略有减少" },
];

export const SPECIAL_EVENTS: SpecialEventConfig[] = [
  { id: "evt1", date: tomorrowStr, name: "全员大会", impact: "increase", impactPercent: 15, description: "全员大会后员工就餐人数增加" },
  { id: "evt2", date: dayAfterStr, name: "部门外出", impact: "slight_reduce", impactPercent: -10, description: "销售部外出团建，减少就餐" },
  { id: "evt3", date: "2026-10-01", name: "国庆节", impact: "heavy_reduce", impactPercent: -80, description: "国庆假期，食堂仅留少量值班" },
];

export const MEAL_PREP_SUGGESTIONS: MealPrepSuggestion[] = (() => {
  const meals: MealType[] = ["breakfast", "lunch", "dinner", "supper"];
  const weatherTypes: WeatherType[] = ["sunny", "cloudy", "rainy", "sunny"];
  return meals.map((meal, idx) => {
    const weather = weatherTypes[idx] as WeatherType;
    const isHoliday = meal === "lunch" && idx === 1;
    const dishSuggestions: MealPrepDishSuggestion[] = DISHES.slice(0, 12).map((dish, i) => {
      const historicalAvg = 30 + Math.floor(Math.random() * 80);
      const weatherFactor = weather === "rainy" ? 0.85 : weather === "sunny" ? 1.05 : 1;
      const holidayFactor = isHoliday ? 0.8 : 1;
      const suggestedAmount = Math.round(historicalAvg * weatherFactor * holidayFactor);
      const suggestedMin = Math.round(suggestedAmount * 0.9);
      const suggestedMax = Math.round(suggestedAmount * 1.1);
      const currentBooking = Math.floor(Math.random() * suggestedAmount);
      const factors = generatePrepFactors(dish.name, weather, isHoliday);
      const confidence = calcConfidence(factors);
      const riskLevel = calcRiskLevel(currentBooking, suggestedAmount);
      return {
        id: `prep-dish-${meal}-${i}`,
        dishId: dish.id,
        dishName: dish.name,
        stallId: dish.stallId,
        stallName: STALLS.find(s => s.id === dish.stallId)?.name.split("（")[0] || "",
        suggestedMin,
        suggestedMax,
        suggestedAmount,
        currentBooking,
        historicalAvg,
        lastWeekSales: historicalAvg + Math.floor(Math.random() * 20) - 10,
        factors,
        confidence,
        riskLevel,
        finalAmount: suggestedAmount,
        lastShortage: Math.random() > 0.8 ? Math.floor(Math.random() * 10) : undefined,
        lastSurplus: Math.random() > 0.7 ? Math.floor(Math.random() * 15) : undefined,
      };
    });
    const totalBookings = dishSuggestions.reduce((s, d) => s + d.currentBooking, 0);
    const totalSuggested = dishSuggestions.reduce((s, d) => s + d.suggestedAmount, 0);
    const overallRisk: RiskLevel = dishSuggestions.some(d => d.riskLevel === "warning") ? "warning"
      : dishSuggestions.some(d => d.riskLevel === "attention") ? "attention" : "normal";
    return {
      id: `prep-${meal}`,
      date: todayStr,
      mealType: meal,
      generatedAt: `${todayStr} 06:30:00`,
      expectedTotalPeople: Math.round(totalSuggested * 0.9),
      suggestedTotalServings: totalSuggested,
      currentTotalBookings: totalBookings,
      bookingRate: Math.round((totalBookings / totalSuggested) * 100),
      overallRisk,
      dishes: dishSuggestions,
      weather,
      temperature: 22 + Math.floor(Math.random() * 8),
      isHoliday,
      specialEvent: isHoliday ? "假期前夕" : undefined,
    };
  });
})();

export const MEAL_PREP_REVIEWS: MealPrepReview[] = [
  {
    id: "review-1",
    date: new Date(today.getTime() - 86400000).toISOString().split("T")[0],
    mealType: "lunch",
    totalPrepped: 850,
    totalPickedUp: 782,
    shortageRate: 2.3,
    surplusRate: 8.0,
    accuracyScore: 89,
    dishReviews: DISHES.slice(0, 8).map(d => {
      const prepped = 40 + Math.floor(Math.random() * 60);
      const pickedUp = Math.round(prepped * (0.85 + Math.random() * 0.2));
      const diff = pickedUp - prepped;
      return {
        dishId: d.id,
        dishName: d.name,
        preppedAmount: prepped,
        pickedUpAmount: pickedUp,
        diff,
        diffPercent: Math.round((diff / prepped) * 100),
        factors: Math.random() > 0.5 ? [{ type: "weather" as const, name: "多云", impact: 0, description: "天气正常" }] : [],
        reason: diff > 10 ? "当日实际就餐人数超预期" : diff < -10 ? "部分员工外出就餐" : "预测准确",
      };
    }),
    suggestions: [
      "红烧肉连续3周预测偏低，建议上调基线系数10%",
      "考虑增加素食菜品的备餐比例",
      "周五午餐建议整体减少5%备餐量",
    ],
  },
];

export const MEAL_PREP_ALERTS: MealPrepAlert[] = [
  {
    id: "alert-1",
    type: "shortage_risk",
    dishId: "d1",
    dishName: "红烧肉",
    message: "红烧肉预订量已达建议备餐量的85%，预计将提前售罄",
    currentBooking: 76,
    suggestedAmount: 90,
    threshold: 80,
    createdAt: `${todayStr} 10:15:00`,
    acknowledged: false,
  },
  {
    id: "alert-2",
    type: "booking_abnormal",
    dishId: "d3",
    dishName: "麻婆豆腐",
    message: "麻婆豆腐预订开启1小时仅完成目标的18%，低于历史同期",
    currentBooking: 14,
    suggestedAmount: 78,
    threshold: 30,
    createdAt: `${todayStr} 09:30:00`,
    acknowledged: true,
  },
];

// ===== 备餐预测算法（前端简化版） =====
export function generateMealPrepSuggestion(
  date: string,
  mealType: MealType,
  options: { weather?: WeatherType; isHoliday?: boolean; specialEvent?: string } = {}
): MealPrepSuggestion {
  const menuItems = MENU_ITEMS.filter(m => m.date === date && m.mealType === mealType);
  const dishes = [...new Set(menuItems.map(m => m.dishId))].map(dishId => DISHES.find(d => d.id === dishId)).filter(Boolean) as Dish[];

  const dishSuggestions: MealPrepDishSuggestion[] = dishes.map((dish, i) => {
    const last4Weeks = Array.from({ length: 4 }, (_, wi) => {
      const d = new Date(date);
      d.setDate(d.getDate() - (wi + 1) * 7);
      const dateStr = formatDate(d);
      return ORDERS.filter(o => o.date === dateStr && o.mealType === mealType)
        .flatMap(o => o.items)
        .filter(item => item.dishName === dish.name)
        .reduce((s, item) => s + item.quantity, 0);
    });
    const weights = [0.4, 0.3, 0.2, 0.1];
    const weightedAvg = last4Weeks.reduce((s, v, i) => s + v * weights[i], 0);

    let weatherFactor = 1;
    if (options.weather === "rainy") weatherFactor = 0.85;
    if (options.weather === "extreme") weatherFactor = 0.7;
    if (options.weather === "sunny") weatherFactor = 1.05;

    let holidayFactor = 1;
    if (options.isHoliday) holidayFactor = 0.8;

    const baseSuggestion = Math.max(20, Math.round(weightedAvg * weatherFactor * holidayFactor));
    const factors = generatePrepFactors(dish.name, options.weather || "cloudy", !!options.isHoliday);
    const currentBooking = Math.floor(Math.random() * baseSuggestion);

    return {
      id: `prep-dish-${date}-${mealType}-${i}`,
      dishId: dish.id,
      dishName: dish.name,
      stallId: dish.stallId,
      stallName: STALLS.find(s => s.id === dish.stallId)?.name.split("（")[0] || "",
      suggestedMin: Math.round(baseSuggestion * 0.9),
      suggestedMax: Math.round(baseSuggestion * 1.1),
      suggestedAmount: baseSuggestion,
      currentBooking,
      historicalAvg: Math.round(weightedAvg),
      lastWeekSales: last4Weeks[0],
      factors,
      confidence: calcConfidence(factors),
      riskLevel: calcRiskLevel(currentBooking, baseSuggestion),
      finalAmount: baseSuggestion,
    };
  });

  const totalBookings = dishSuggestions.reduce((s, d) => s + d.currentBooking, 0);
  const totalSuggested = dishSuggestions.reduce((s, d) => s + d.suggestedAmount, 0);
  const overallRisk: RiskLevel = dishSuggestions.some(d => d.riskLevel === "warning") ? "warning"
    : dishSuggestions.some(d => d.riskLevel === "attention") ? "attention" : "normal";

  return {
    id: `prep-${date}-${mealType}`,
    date,
    mealType,
    generatedAt: new Date().toISOString().replace("T", " ").slice(0, 19),
    expectedTotalPeople: Math.round(totalSuggested * 0.9),
    suggestedTotalServings: totalSuggested,
    currentTotalBookings: totalBookings,
    bookingRate: Math.round((totalBookings / Math.max(totalSuggested, 1)) * 100),
    overallRisk,
    dishes: dishSuggestions,
    weather: options.weather,
    isHoliday: options.isHoliday,
    specialEvent: options.specialEvent,
  };
}
