import { useState, useRef, useEffect } from "react";
import { useTransactions } from "../contexts/TransactionContext";
import { formatCurrency, formatDate, generateId } from "../utils/helpers";
import { CATEGORIES, CATEGORY_COLORS } from "../utils/mockData";

/* ─── ADD/EDIT MODAL ─── */
const TransactionModal = ({ mode, existing, onClose, onSave }) => {
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState(
    existing
      ? { ...existing }
      : { description: "", amount: "", date: today, category: CATEGORIES[0], type: "expense" }
  );
  const [error, setError] = useState("");
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.description.trim()) return setError("Description is required.");
    if (!form.amount || isNaN(form.amount) || +form.amount <= 0)
      return setError("Enter a valid amount.");
    if (!form.date) return setError("Date is required.");
    setError("");
    onSave({ ...form, amount: parseFloat(form.amount) });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="slide-up w-full max-w-md rounded-2xl p-7"
        style={{
          backgroundColor: "#0c0d1d",
          border: "1px solid rgba(0,245,200,0.14)",
          boxShadow: "0 40px 100px rgba(0,0,0,0.65)",
        }}
      >
        <h3
          className="text-lg font-bold mb-6 text-white"
          style={{ fontFamily: "'Syne', sans-serif", letterSpacing: "-0.02em" }}
        >
          {mode === "add" ? "+ New Transaction" : "✏️ Edit Transaction"}
        </h3>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="modal-label">Description</label>
            <input
              className="modal-input"
              placeholder="e.g. Zomato Order"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="modal-label">Amount (₹)</label>
              <input
                className="modal-input"
                type="number"
                placeholder="0"
                value={form.amount}
                onChange={(e) => set("amount", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="modal-label">Date</label>
              <input
                className="modal-input"
                type="date"
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="modal-label">Category</label>
              <select
                className="modal-input"
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} style={{ backgroundColor: "#0c0d1d" }}>{c}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="modal-label">Type</label>
              <select
                className="modal-input"
                value={form.type}
                onChange={(e) => set("type", e.target.value)}
              >
                <option value="expense" style={{ backgroundColor: "#0c0d1d" }}>Expense</option>
                <option value="income" style={{ backgroundColor: "#0c0d1d" }}>Income</option>
              </select>
            </div>
          </div>
          {error && <p className="text-xs" style={{ color: "#ef4444" }}>⚠ {error}</p>}
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            className="px-5 py-2 rounded-full text-sm font-semibold transition-all"
            style={{
              backgroundColor: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.45)",
            }}
            onClick={onClose}
          >Cancel</button>
          <button
            className="px-6 py-2 rounded-full text-sm font-bold transition-all"
            style={{ backgroundColor: "var(--accent)", color: "var(--ink)" }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 0 18px rgba(0,245,200,0.4)"; e.currentTarget.style.transform = "scale(1.03)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "scale(1)"; }}
            onClick={handleSave}
          >
            {mode === "add" ? "Save Entry ↗" : "Update Entry ↗"}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── DELETE CONFIRM ─── */
const DeleteConfirm = ({ tx, onClose, onConfirm }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center"
    style={{ backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)" }}
    onClick={(e) => e.target === e.currentTarget && onClose()}
  >
    <div
      className="slide-up w-full max-w-sm rounded-2xl p-7 text-center"
      style={{
        backgroundColor: "#0c0d1d",
        border: "1px solid rgba(239,68,68,0.2)",
        boxShadow: "0 40px 100px rgba(0,0,0,0.65)",
      }}
    >
      <div className="text-3xl mb-3">🗑️</div>
      <h3 className="text-base font-bold text-white mb-2">Delete Transaction?</h3>
      <p className="text-sm mb-6" style={{ color: "#64748b" }}>
        &ldquo;{tx.description}&rdquo; will be permanently removed.
      </p>
      <div className="flex gap-3 justify-center">
        <button
          className="px-5 py-2 rounded-full text-sm font-semibold"
          style={{
            backgroundColor: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.45)",
          }}
          onClick={onClose}
        >Cancel</button>
        <button
          className="px-5 py-2 rounded-full text-sm font-bold"
          style={{ backgroundColor: "#ef4444", color: "#fff" }}
          onClick={onConfirm}
        >Delete</button>
      </div>
    </div>
  </div>
);

/* ─── TRANSACTIONS PAGE ─── */
const Transactions = () => {
  const {
    filteredTransactions, transactions,
    searchQuery, setSearchQuery,
    filterType, setFilterType,
    filterCategory, setFilterCategory,
    sortBy, sortDir, toggleSort,
    role, editTransaction, deleteTransaction, addTransaction,
  } = useTransactions();

  const [editTx, setEditTx] = useState(null);
  const [deleteTx, setDeleteTx] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const tbodyRef = useRef(null);

  useEffect(() => {
    if (!tbodyRef.current) return;
    const rows = tbodyRef.current.querySelectorAll("tr");
    import("animejs").then(({ default: anime }) => {
      anime({ targets: rows, opacity: [0, 1], translateY: [8, 0], duration: 300, delay: anime.stagger(25), easing: "easeOutExpo" });
    });
  }, [filteredTransactions]);

  const SortIcon = ({ col }) => {
    if (sortBy !== col) return <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 10 }}>⇅</span>;
    return <span style={{ color: "var(--accent)", fontSize: 10 }}>{sortDir === "asc" ? "↑" : "↓"}</span>;
  };

  const cols = [
    { label: "Description", col: "description" },
    { label: "Category",    col: null },
    { label: "Date",        col: "date" },
    { label: "Type",        col: null },
    { label: "Amount",      col: "amount", right: true },
    ...(role === "admin" ? [{ label: "Actions", col: null, right: true }] : []),
  ];

  return (
    <div className="flex flex-col gap-5 fade-up">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs mb-1" style={{ fontFamily: "'DM Mono', monospace", color: "var(--accent)", letterSpacing: "0.15em" }}>
            02 — LEDGER
          </p>
          <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif", letterSpacing: "-0.03em" }}>
            All Transactions
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <input
            className="text-sm px-3 py-2 rounded-xl outline-none transition-all"
            style={{
              fontFamily: "'DM Mono', monospace",
              backgroundColor: "rgba(255,255,255,0.04)",
              border: "1px solid var(--border)",
              color: "var(--paper)",
              width: 210,
            }}
            placeholder="Search…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={(e) => (e.target.style.borderColor = "rgba(0,245,200,0.3)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
          />
          {role === "admin" && (
            <button
              className="px-4 py-2 rounded-full text-sm font-bold transition-all"
              style={{ backgroundColor: "var(--accent)", color: "var(--ink)" }}
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 0 16px rgba(0,245,200,0.4)"; e.currentTarget.style.transform = "scale(1.04)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "scale(1)"; }}
              onClick={() => setShowAddModal(true)}
            >+ Add Entry</button>
          )}
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 flex-wrap">
        {["all", "income", "expense"].map((f) => (
          <button
            key={f}
            className="filter-pill"
            style={{
              backgroundColor: filterType === f ? "rgba(0,245,200,0.08)" : "rgba(255,255,255,0.04)",
              borderColor: filterType === f ? "rgba(0,245,200,0.28)" : "var(--border)",
              color: filterType === f ? "var(--accent)" : "rgba(255,255,255,0.35)",
            }}
            onClick={() => { setFilterType(f); setFilterCategory("all"); }}
          >{f.toUpperCase()}</button>
        ))}
        <span style={{ width: 1, background: "var(--border)", margin: "0 4px" }} />
        {CATEGORIES.map((c) => {
          const active = filterCategory === c;
          const color = CATEGORY_COLORS[c];
          return (
            <button
              key={c}
              className="filter-pill"
              style={{
                backgroundColor: active ? `${color}12` : "rgba(255,255,255,0.04)",
                borderColor: active ? `${color}44` : "var(--border)",
                color: active ? color : "rgba(255,255,255,0.35)",
              }}
              onClick={() => { setFilterCategory(active ? "all" : c); setFilterType("all"); }}
            >{c}</button>
          );
        })}
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)" }}>
              {cols.map(({ label, col, right }) => (
                <th
                  key={label}
                  className="px-4 py-3"
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 10,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.18)",
                    textAlign: right ? "right" : "left",
                    cursor: col ? "pointer" : "default",
                    userSelect: "none",
                    whiteSpace: "nowrap",
                  }}
                  onClick={() => col && toggleSort(col)}
                >
                  {label} {col && <SortIcon col={col} />}
                </th>
              ))}
            </tr>
          </thead>
          <tbody ref={tbodyRef}>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={cols.length} className="px-4 py-10 text-center text-sm" style={{ color: "rgba(255,255,255,0.2)" }}>
                  No transactions found.
                </td>
              </tr>
            ) : (
              filteredTransactions.map((t) => {
                const color = CATEGORY_COLORS[t.category] || "#9d6cff";
                return (
                  <tr
                    key={t.id}
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.035)", transition: "background 0.15s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.025)")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    <td className="px-4 py-3">
                      <span className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.82)" }}>{t.description}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full"
                        style={{ fontFamily: "'DM Mono', monospace", backgroundColor: `${color}14`, border: `1px solid ${color}28`, color }}>
                        <span style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: color, display: "inline-block", flexShrink: 0 }} />
                        {t.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: "rgba(255,255,255,0.28)" }}>
                        {formatDate(t.date)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full"
                        style={{
                          fontFamily: "'DM Mono', monospace",
                          letterSpacing: "0.06em",
                          backgroundColor: t.type === "income" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)",
                          border: `1px solid ${t.type === "income" ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
                          color: t.type === "income" ? "#22c55e" : "#ef4444",
                        }}>
                        {t.type.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="font-bold text-sm"
                        style={{ fontFamily: "'Syne', sans-serif", color: t.type === "income" ? "#22c55e" : "#ef4444" }}>
                        {t.type === "income" ? "+" : "−"}{formatCurrency(t.amount)}
                      </span>
                    </td>
                    {role === "admin" && (
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="text-xs px-2.5 py-1 rounded-lg transition-all"
                            style={{ backgroundColor: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", color: "#818cf8" }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(99,102,241,0.2)")}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(99,102,241,0.1)")}
                            onClick={() => setEditTx(t)}
                          >Edit</button>
                          <button
                            className="text-xs px-2.5 py-1 rounded-lg transition-all"
                            style={{ backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444" }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.2)")}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.1)")}
                            onClick={() => setDeleteTx(t)}
                          >Del</button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        <div className="px-4 py-2.5 flex items-center justify-between" style={{ borderTop: "1px solid var(--border)" }}>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.2)" }}>
            {filteredTransactions.length} of {transactions.length} entries
          </span>
          {(searchQuery || filterType !== "all" || filterCategory !== "all") && (
            <button
              className="text-xs transition-colors"
              style={{ color: "var(--accent)", fontFamily: "'DM Mono', monospace" }}
              onClick={() => { setSearchQuery(""); setFilterType("all"); setFilterCategory("all"); }}
            >✕ Clear filters</button>
          )}
        </div>
      </div>

      {showAddModal && <TransactionModal mode="add" onClose={() => setShowAddModal(false)} onSave={(form) => { addTransaction({ ...form, id: generateId(transactions) }); setShowAddModal(false); }} />}
      {editTx && <TransactionModal mode="edit" existing={editTx} onClose={() => setEditTx(null)} onSave={(form) => { editTransaction(form); setEditTx(null); }} />}
      {deleteTx && <DeleteConfirm tx={deleteTx} onClose={() => setDeleteTx(null)} onConfirm={() => { deleteTransaction(deleteTx.id); setDeleteTx(null); }} />}
    </div>
  );
};

export default Transactions;
