export const CATEGORIES = [
  "Food & Dining",
  "Transport",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Health",
  "Travel",
  "Salary",
  "Freelance",
  "Investment",
];

export const CATEGORY_COLORS = {
  "Food & Dining": "#f97316",
  "Transport": "#3b82f6",
  "Shopping": "#a855f7",
  "Entertainment": "#ec4899",
  "Bills & Utilities": "#ef4444",
  "Health": "#10b981",
  "Travel": "#06b6d4",
  "Salary": "#22c55e",
  "Freelance": "#84cc16",
  "Investment": "#6366f1",
};

export const mockTransactions = [
  // January
  { id: 1,  date: "2025-01-03", description: "Monthly Salary",        category: "Salary",           type: "income",  amount: 85000 },
  { id: 2,  date: "2025-01-05", description: "Zomato Order",          category: "Food & Dining",    type: "expense", amount: 450  },
  { id: 3,  date: "2025-01-08", description: "Electricity Bill",      category: "Bills & Utilities", type: "expense", amount: 1800 },
  { id: 4,  date: "2025-01-12", description: "Uber Ride",             category: "Transport",        type: "expense", amount: 280  },
  { id: 5,  date: "2025-01-15", description: "Freelance Project",     category: "Freelance",        type: "income",  amount: 22000},
  { id: 6,  date: "2025-01-18", description: "Amazon Shopping",       category: "Shopping",         type: "expense", amount: 3200 },
  { id: 7,  date: "2025-01-22", description: "Movie Tickets",         category: "Entertainment",    type: "expense", amount: 600  },
  { id: 8,  date: "2025-01-28", description: "Gym Membership",        category: "Health",           type: "expense", amount: 1500 },

  // February
  { id: 9,  date: "2025-02-01", description: "Monthly Salary",        category: "Salary",           type: "income",  amount: 85000 },
  { id: 10, date: "2025-02-04", description: "Swiggy Order",          category: "Food & Dining",    type: "expense", amount: 380  },
  { id: 11, date: "2025-02-10", description: "Internet Bill",         category: "Bills & Utilities", type: "expense", amount: 999  },
  { id: 12, date: "2025-02-14", description: "Valentine's Dinner",   category: "Food & Dining",    type: "expense", amount: 2800 },
  { id: 13, date: "2025-02-18", description: "Mutual Fund SIP",       category: "Investment",       type: "expense", amount: 10000},
  { id: 14, date: "2025-02-22", description: "Freelance Design",      category: "Freelance",        type: "income",  amount: 15000},
  { id: 15, date: "2025-02-26", description: "Medical Checkup",       category: "Health",           type: "expense", amount: 1200 },

  // March
  { id: 16, date: "2025-03-01", description: "Monthly Salary",        category: "Salary",           type: "income",  amount: 85000 },
  { id: 17, date: "2025-03-05", description: "Ola Auto",              category: "Transport",        type: "expense", amount: 120  },
  { id: 18, date: "2025-03-09", description: "Myntra Purchase",       category: "Shopping",         type: "expense", amount: 4500 },
  { id: 19, date: "2025-03-12", description: "Spotify Premium",       category: "Entertainment",    type: "expense", amount: 119  },
  { id: 20, date: "2025-03-15", description: "Goa Trip Booking",      category: "Travel",           type: "expense", amount: 18000},
  { id: 21, date: "2025-03-20", description: "Freelance Content",     category: "Freelance",        type: "income",  amount: 8000 },
  { id: 22, date: "2025-03-25", description: "Water Bill",            category: "Bills & Utilities", type: "expense", amount: 450  },
  { id: 23, date: "2025-03-28", description: "Restaurant Dinner",     category: "Food & Dining",    type: "expense", amount: 1600 },

  // April
  { id: 24, date: "2025-04-01", description: "Monthly Salary",        category: "Salary",           type: "income",  amount: 85000 },
  { id: 25, date: "2025-04-03", description: "Metro Card Recharge",   category: "Transport",        type: "expense", amount: 500  },
  { id: 26, date: "2025-04-07", description: "Pharmacy",              category: "Health",           type: "expense", amount: 780  },
  { id: 27, date: "2025-04-11", description: "Investment Returns",    category: "Investment",       type: "income",  amount: 4200 },
  { id: 28, date: "2025-04-15", description: "Netflix Subscription",  category: "Entertainment",    type: "expense", amount: 649  },
  { id: 29, date: "2025-04-20", description: "Grocery Shopping",      category: "Food & Dining",    type: "expense", amount: 2100 },
  { id: 30, date: "2025-04-25", description: "Freelance UI Project",  category: "Freelance",        type: "income",  amount: 30000},
];

export const ADMIN_PASSWORD = "1234";