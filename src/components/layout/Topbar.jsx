import { useState } from "react";
import { useTransactions } from "../../contexts/TransactionContext";
import { CATEGORIES, ADMIN_PASSWORD } from "../../utils/mockData";
import { generateId } from "../../utils/helpers";

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

const PasswordModal = ({ onConfirm, onClose }) => {
  const [val, setVal] = useState("");
  const [err, setErr] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (val === ADMIN_PASSWORD) {
      onConfirm();
    } else {
      setErr(true);
      setTimeout(() => setErr(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-[12px] z-[300] flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`w-full max-w-[360px] bg-card2 border ${err ? 'border-red/40' : 'border-white/10'} p-8 rounded-[24px] shadow-2xl transition-all duration-300 slide-up ${err ? 'animate-pulse' : ''}`}>
        <div className="flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-2xl border border-accent/20">🛡️</div>
          <div>
            <h3 className="font-syne text-[1.2rem] font-extrabold text-white">Owner Access</h3>
            <p className="text-[0.7rem] text-white/30 font-mono-dm uppercase tracking-wider mt-1">Enter administrative key to proceed</p>
          </div>
          <form onSubmit={handleSubmit} className="w-full mt-4 flex flex-col gap-4">
            <input 
              autoFocus
              type="password" 
              placeholder="••••"
              value={val}
              onChange={(e) => setVal(e.target.value)}
              className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-center text-2xl tracking-[0.5em] text-accent outline-none focus:border-accent/40 transition-all font-bold"
            />
            {err && <p className="text-red text-[0.65rem] font-bold animate-pulse uppercase tracking-tighter">Incorrect Key — Access Denied</p>}
            <div className="flex gap-3 mt-2">
              <button type="button" onClick={onClose} className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-white/40 text-[0.75rem] font-bold hover:bg-white/10 transition-all cursor-none">CANCEL</button>
              <button type="submit" className="flex-[2] py-3 bg-accent text-ink rounded-xl text-[0.75rem] font-extrabold hover:scale-[1.03] transition-all shadow-[0_10px_30px_rgba(0,245,200,0.2)] cursor-none">AUTHORIZE ↗</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const QuickAddModal = ({ onClose }) => {
  const { addTransaction, editTransaction, transactions, editingTransaction, setEditingTransaction } = useTransactions();
  const today = new Date().toISOString().split("T")[0];
  
  const [form, setForm] = useState(editingTransaction || { 
    description: "", 
    amount: "", 
    date: today, 
    category: CATEGORIES[0], 
    type: "expense" 
  });
  
  const [error, setError] = useState("");
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.description.trim()) return setError("Description is required.");
    if (!form.amount || isNaN(form.amount) || +form.amount <= 0) return setError("Enter a valid amount.");
    
    if (editingTransaction) {
      editTransaction({ ...form, amount: parseFloat(form.amount) });
      setEditingTransaction(null);
    } else {
      addTransaction({ ...form, amount: parseFloat(form.amount), id: generateId(transactions) });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-[10px] z-[200] flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-[450px] rounded-[20px] bg-card2 border border-accent/15 p-7 shadow-[0_40px_100px_rgba(0,0,0,0.65)] slide-up">
        <div className="font-syne text-[1.15rem] font-extrabold mb-6 tracking-tight">
          {editingTransaction ? '✏️ Edit Transaction' : '+ New Transaction'}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5 col-span-2">
            <label className="font-mono-dm text-[0.6rem] tracking-[0.1em] uppercase text-white/30">Description</label>
            <input className="p-3 bg-white/5 border border-white/10 rounded-xl text-paper font-cabinet text-[0.86rem] outline-none focus:border-accent/40 transition-all font-medium" placeholder="e.g. Zomato Order" value={form.description} onChange={(e) => set("description", e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-mono-dm text-[0.6rem] tracking-[0.1em] uppercase text-white/30">Amount (₹)</label>
            <input className="p-3 bg-white/5 border border-white/10 rounded-xl text-paper font-cabinet text-[0.86rem] outline-none focus:border-accent/40 transition-all font-medium" type="number" placeholder="0" value={form.amount} onChange={(e) => set("amount", e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-mono-dm text-[0.6rem] tracking-[0.1em] uppercase text-white/30">Date</label>
            <input className="p-3 bg-white/5 border border-white/10 rounded-xl text-paper font-cabinet text-[0.86rem] outline-none focus:border-accent/40 transition-all font-medium" type="date" value={form.date} onChange={(e) => set("date", e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-mono-dm text-[0.6rem] tracking-[0.1em] uppercase text-white/30">Category</label>
            <select className="p-3 bg-white/5 border border-white/10 rounded-xl text-paper font-cabinet text-[0.86rem] outline-none focus:border-accent/40 transition-all font-medium" value={form.category} onChange={(e) => set("category", e.target.value)}>
              {CATEGORIES.map((c) => <option key={c} value={c} className="bg-card2">{c}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="font-mono-dm text-[0.6rem] tracking-[0.1em] uppercase text-white/30">Type</label>
            <select className="p-3 bg-white/5 border border-white/10 rounded-xl text-paper font-cabinet text-[0.86rem] outline-none focus:border-accent/40 transition-all font-medium" value={form.type} onChange={(e) => set("type", e.target.value)}>
              <option value="expense" className="bg-card2">Expense</option>
              <option value="income" className="bg-card2">Income</option>
            </select>
          </div>
        </div>
        {error && <p className="text-red font-medium text-[0.7rem] mt-4">⚠ {error}</p>}
        <div className="flex gap-3 mt-6 justify-end">
          <button className="px-5 py-2 bg-white/5 border border-white/10 rounded-full text-white/45 font-cabinet text-[0.83rem] font-semibold cursor-none hover:bg-white/10 transition-all" onClick={onClose}>Cancel</button>
          <button className="px-6 py-2 bg-accent text-ink rounded-full font-cabinet text-[0.83rem] font-bold cursor-none hover:scale-105 hover:shadow-[0_0_18px_rgba(0,245,200,0.4)] transition-all" onClick={handleSave}>
            {editingTransaction ? 'Update Entry ↗' : 'Save Entry ↗'}
          </button>
        </div>
      </div>
    </div>
  );
};

const Topbar = () => {
  const { activePage, role, setRole, editingTransaction, setEditingTransaction } = useTransactions();
  const [showModal, setShowModal] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleRoleChange = (newRole) => {
    if (newRole === "admin" && role !== "admin") {
      setShowPass(true);
    } else {
      setRole(newRole);
    }
    setShowRoleMenu(false);
  };

  return (
    <>
      <header className="flex-shrink-0 bg-ink/92 backdrop-blur-[20px] border-b border-border-custom px-[1.8rem] py-[0.9rem] flex items-center justify-between z-40">
        <div className="flex flex-col gap-[2px]">
          <div className="font-syne text-[1.25rem] font-[800] tracking-[-0.02em] text-white leading-none">{PAGE_TITLES[activePage]}</div>
          <div className="font-mono-dm text-[0.68rem] text-white/28 tracking-[0.08em] uppercase font-medium">{PAGE_SUBTITLES[activePage]}</div>
        </div>

        <div className="flex items-center gap-[0.9rem]">
          <div className="relative">
            <button 
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className={`flex items-center gap-2.5 px-[0.9rem] py-[0.4rem] rounded-full border transition-all cursor-none ${
                showRoleMenu ? 'bg-white/10 border-white/20 shadow-lg' : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${role === 'admin' ? 'bg-accent shadow-[0_0_8px_rgba(0,245,200,0.8)]' : 'bg-white/20'} animate-pulse`} />
              <span className="font-mono-dm text-[0.6rem] font-bold uppercase tracking-[0.12em] text-white/50">
                {role === "admin" ? "Owner Access" : "Viewer Access"}
              </span>
              <span className={`text-[0.45rem] transition-transform duration-300 opacity-30 ${showRoleMenu ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 top-[calc(100%+10px)] w-[180px] bg-card2/95 backdrop-blur-xl border border-white/10 rounded-2xl p-1.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200">
                <div className="px-3 py-2 border-b border-white/5 mb-1">
                  <div className="font-mono-dm text-[0.55rem] text-white/20 uppercase tracking-widest font-bold">Switch Identity</div>
                </div>
                {[
                  { id: "admin", label: "Owner Mode", sub: "RESTRICTED", icon: "🛡️" },
                  { id: "viewer", label: "Viewer Mode", sub: "PUBLIC VIEW", icon: "👁️" }
                ].map((r) => (
                  <button
                    key={r.id}
                    onClick={() => handleRoleChange(r.id)}
                    className={`flex items-start gap-3 w-full p-2.5 rounded-xl transition-all cursor-none text-left ${
                      role === r.id ? 'bg-accent/10 border border-accent/20' : 'hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <span className="text-[0.9rem] mt-0.5">{r.icon}</span>
                    <div className="flex flex-col">
                      <span className={`text-[0.75rem] font-bold ${role === r.id ? 'text-accent' : 'text-white/70'}`}>{r.label}</span>
                      <span className="text-[0.5rem] font-mono-dm text-white/20 tracking-wider font-bold">{r.sub}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {showRoleMenu && <div className="fixed inset-0 z-40 cursor-none" onClick={() => setShowRoleMenu(false)} />}
          </div>

          <div className="font-mono-dm text-[0.62rem] px-[0.75rem] py-[0.25rem] rounded-full tracking-[0.1em] bg-accent/8 border border-accent/20 text-accent font-medium leading-none">◈ LIVE</div>
          {role === "admin" && (
            <button className="px-[1.1rem] py-[0.45rem] bg-accent text-ink rounded-full font-cabinet text-[0.8rem] font-[700] cursor-none tracking-[0.02em] hover:scale-[1.04] hover:shadow-[0_0_18px_rgba(0,245,200,0.4)] transition-all animate-in fade-in zoom-in duration-300" onClick={() => setShowModal(true)}>+ Add Entry</button>
          )}
          <div className="w-[32px] h-[32px] rounded-full bg-gradient-to-br from-extraviolet to-accent flex items-center justify-center text-[0.75rem] font-[700] text-white cursor-none transition-transform hover:scale-110 shadow-lg">AV</div>
        </div>
      </header>
      {showPass && <PasswordModal onConfirm={() => { setRole("admin"); setShowPass(false); }} onClose={() => setShowPass(false)} />}
      {(showModal || editingTransaction) && (
        <QuickAddModal onClose={() => { 
          setShowModal(false); 
          setEditingTransaction(null); 
        }} />
      )}
    </>
  );
};

export default Topbar;
