import { createContext, useContext, useState, useMemo } from "react";
import { mockTransactions } from "../utils/mockData";
import { sortTransactions } from "../utils/helpers";

const TransactionContext = createContext(null);

export const TransactionProvider = ({ children }) => {
  // Core data
  const [transactions, setTransactions] = useState(mockTransactions);

  // Role
  const [role, setRole] = useState("viewer"); // "viewer" | "admin"

  // Active page
  const [activePage, setActivePage] = useState("dashboard"); // "dashboard" | "transactions" | "insights"

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");     // "all" | "income" | "expense"
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortDir, setSortDir] = useState("desc");

  // Filtered + sorted transactions (memoized)
  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      );
    }

    if (filterType !== "all") {
      result = result.filter((t) => t.type === filterType);
    }

    if (filterCategory !== "all") {
      result = result.filter((t) => t.category === filterCategory);
    }

    return sortTransactions(result, sortBy, sortDir);
  }, [transactions, searchQuery, filterType, filterCategory, sortBy, sortDir]);

  // Admin actions
  const addTransaction = (tx) => {
    setTransactions((prev) => [tx, ...prev]);
  };

  const editTransaction = (updated) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === updated.id ? updated : t))
    );
  };

  const deleteTransaction = (id) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleSort = (column) => {
    if (sortBy === column) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(column);
      setSortDir("desc");
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setFilterType("all");
    setFilterCategory("all");
    setSortBy("date");
    setSortDir("desc");
  };

  return (
    <TransactionContext.Provider
      value={{
        // Data
        transactions,
        filteredTransactions,
        // Role
        role,
        setRole,
        // Navigation
        activePage,
        setActivePage,
        // Filters
        searchQuery,
        setSearchQuery,
        filterType,
        setFilterType,
        filterCategory,
        setFilterCategory,
        sortBy,
        sortDir,
        toggleSort,
        resetFilters,
        // Admin actions
        addTransaction,
        editTransaction,
        deleteTransaction,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

// Custom hook
export const useTransactions = () => {
  const ctx = useContext(TransactionContext);
  if (!ctx) throw new Error("useTransactions must be used inside TransactionProvider");
  return ctx;
};