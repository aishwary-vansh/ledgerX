import { CATEGORIES } from "./mockData";

// Format currency in Indian Rupees
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format date to readable string
export const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// Format month label from YYYY-MM
export const formatMonth = (monthStr) => {
  const [year, month] = monthStr.split("-");
  return new Date(year, month - 1).toLocaleDateString("en-IN", {
    month: "short",
    year: "numeric",
  });
};

// Get total income from transactions
export const getTotalIncome = (transactions) =>
  transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0);

// Get total expenses from transactions
export const getTotalExpenses = (transactions) =>
  transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);

// Get net balance
export const getNetBalance = (transactions) =>
  getTotalIncome(transactions) - getTotalExpenses(transactions);

// Group transactions by month, return array sorted by date
export const getMonthlyData = (transactions) => {
  const map = {};
  transactions.forEach((t) => {
    const month = t.date.slice(0, 7); // "YYYY-MM"
    if (!map[month]) map[month] = { month, income: 0, expenses: 0 };
    if (t.type === "income") map[month].income += t.amount;
    else map[month].expenses += t.amount;
  });
  return Object.values(map)
    .sort((a, b) => a.month.localeCompare(b.month))
    .map((d) => ({ ...d, balance: d.income - d.expenses, label: formatMonth(d.month) }));
};

// Get spending by category (expenses only)
export const getCategoryBreakdown = (transactions) => {
  const map = {};
  transactions
    .filter((t) => t.type === "expense")
    .forEach((t) => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
  return Object.entries(map)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
};

// Get highest spending category
export const getHighestCategory = (transactions) => {
  const breakdown = getCategoryBreakdown(transactions);
  return breakdown[0] || null;
};

// Get month-over-month expense change
export const getMoMChange = (transactions) => {
  const monthly = getMonthlyData(transactions);
  if (monthly.length < 2) return null;
  const current = monthly[monthly.length - 1];
  const previous = monthly[monthly.length - 2];
  if (previous.expenses === 0) return null;
  const change = ((current.expenses - previous.expenses) / previous.expenses) * 100;
  return { change: change.toFixed(1), current, previous };
};

// Sort transactions
export const sortTransactions = (transactions, sortBy, sortDir) => {
  return [...transactions].sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];
    if (sortBy === "date") {
      valA = new Date(valA);
      valB = new Date(valB);
    }
    if (valA < valB) return sortDir === "asc" ? -1 : 1;
    if (valA > valB) return sortDir === "asc" ? 1 : -1;
    return 0;
  });
};

// Generate a new unique ID
export const generateId = (transactions) =>
  transactions.length > 0 ? Math.max(...transactions.map((t) => t.id)) + 1 : 1;

export { CATEGORIES };