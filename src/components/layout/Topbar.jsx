import { useState } from "react";
import { useTransactions } from "../../contexts/TransactionContext";
import { CATEGORIES } from "../../utils/mockData";
import { generateId, formatCurrency } from "../../utils/helpers";

const PAGE_SUBTITLES = {
  dashboard:    "YOUR FINANCIAL SNAPSHOT AT A GLANCE",
  transactions: "ALL ENTRIES & LEDGER HISTORY",
  insights:     "ANALYTICS & FINANCIAL INTELLIGENCE",
};
const PAGE_TITLES = {
  dashboard: "Overview",
  transactions: "Transactions",
  insights: "Insights",
};

/* Quick-add modal lives in Topbar so it's globally accessible */
const QuickAddModal = ({ onClose }) => {
  const { addTransaction, transactions } = useTransactions();
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState({ description: "", amount: "", date: today, category: CATEGORIES[0], type: "expense" });
  const [error, setError] = useState("");
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.description.trim()) return setError("Description is required.");
    if (!form.amount || isNaN(form.amount) || +form.amount <= 0) return setError("Enter a valid amount.");
    addTransaction({ ...form, amount: parseFloat(form.amount), id: generateId(transactions) });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="slide-up w-full max-w-md rounded-2xl p-7"
        style={{ backgroundColor: "#0c0d1d", border: "1px solid rgba(0,245,200,0.14)", boxShadow: "0 40px 100px rgba(0,0,0,0.65)" }}
      >
        <h3 className="text-lg font-bold mb-6 text-white" style={{ fontFamily: "'Syne', sans-serif", letterSpacing: "-0.02em" }}>
          + New Transaction
        </h3>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="modal-label">Description</label>
            <input className="modal-input" placeholder="e.g. Zomato Order" value={form.description} onChange={(e) => set("description", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="modal-label">Amount (₹)</label>
              <input className="modal-input" type="number" placeholder="0" value={form.amount} onChange={(e) => set("amount", e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="modal-label">Date</label>
              <input className="modal-input" type="date" value={form.date} onChange={(e) => set("date", e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="modal-label">Category</label>
              <select className="modal-input" value={form.category} onChange={(e) => set("category", e.target.value)}>
                {CATEGORIES.map((c) => <option key={c} value={c} style={{ backgroundColor: "#0c0d1d" }}>{c}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="modal-label">Type</label>
              <select className="modal-input" value={form.type} onChange={(e) => set("type", e.target.value)}>
                <option value="expense" style={{ backgroundColor: "#0c0d1d" }}>Expense</option>
                <option value="income"  style={{ backgroundColor: "#0c0d1d" }}>Income</option>
              </select>
            </div>
          </div>
          {error && <p className="text-xs" style={{ color: "#ef4444" }}>⚠ {error}</p>}
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            className="px-5 py-2 rounded-full text-sm font-semibold"
            style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.45)" }}
            onClick={onClose}
          >Cancel</button>
          <button
            className="px-6 py-2 rounded-full text-sm font-bold"
            style={{ backgroundColor: "var(--accent)", color: "var(--ink)" }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 0 18px rgba(0,245,200,0.4)"; e.currentTarget.style.transform = "scale(1.03)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "scale(1)"; }}
            onClick={handleSave}
          >Save Entry ↗</button>
        </div>
      </div>
    </div>
  );
};

const Topbar = () => {
  const { role, setRole, activePage } = useTransactions();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div
        className="w-full px-6 py-3 flex justify-between items-center shrink-0"
        style={{
          backgroundColor: "rgba(7,7,15,0.92)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--border)",
          zIndex: 40,
        }}
      >
        <div>
          <h2
            className="text-lg font-extrabold text-white"
            style={{ fontFamily: "'Syne', sans-serif", letterSpacing: "-0.02em" }}
          >
            {PAGE_TITLES[activePage]}
          </h2>
          <p
            className="text-xs mt-0.5"
            style={{ fontFamily: "'DM Mono', monospace", color: "rgba(255,255,255,0.28)", letterSpacing: "0.08em" }}
          >
            {PAGE_SUBTITLES[activePage]}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Live badge */}
          <span
            className="text-xs px-3 py-1 rounded-full"
            style={{
              fontFamily: "'DM Mono', monospace",
              letterSpacing: "0.1em",
              backgroundColor: "rgba(0,245,200,0.08)",
              border: "1px solid rgba(0,245,200,0.2)",
              color: "var(--accent)",
            }}
          >◈ LIVE</span>

          {/* Role switcher */}
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="text-sm rounded-lg px-3 py-1.5 outline-none"
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              backgroundColor: "#1e293b",
              color: "#94a3b8",
              border: "1px solid #334155",
              letterSpacing: "0.04em",
            }}
          >
            <option value="viewer">👁 Viewer</option>
            <option value="admin">🛡 Admin</option>
          </select>

          {/* Add Entry button — admin only */}
          {role === "admin" && (
            <button
              className="px-4 py-1.5 rounded-full text-sm font-bold transition-all"
              style={{ backgroundColor: "var(--accent)", color: "var(--ink)", letterSpacing: "0.02em" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.04)"; e.currentTarget.style.boxShadow = "0 0 18px rgba(0,245,200,0.4)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "none"; }}
              onClick={() => setShowModal(true)}
            >+ Add Entry</button>
          )}

          {/* Avatar */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
            style={{ background: "linear-gradient(135deg, #5b4fff, var(--accent))" }}
          >RK</div>
        </div>
      </div>
      {showModal && <QuickAddModal onClose={() => setShowModal(false)} />}
    </>
  );
};

export default Topbar;
