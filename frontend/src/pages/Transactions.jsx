import { useTransactions } from "../contexts/TransactionContext";
import { formatCurrency } from "../utils/helpers";
import { CATEGORIES, CATEGORY_COLORS } from "../utils/mockData";

const Transactions = () => {
  const {
    filteredTransactions,
    searchQuery, setSearchQuery,
    filterType, setFilterType,
    filterCategory, setFilterCategory,
    role,
    deleteTransaction,
    resetFilters,
    setEditingTransaction
  } = useTransactions();

  const exportToCSV = () => {
    const headers = ["Date", "Description", "Category", "Type", "Amount"];
    const rows = filteredTransactions.map(t => [
      t.date,
      `"${t.description.replace(/"/g, '""')}"`,
      t.category,
      t.type,
      t.amount
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `ledgerx_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const activeFilter = filterType === 'all' ? (filterCategory === 'all' ? 'ALL' : filterCategory) : filterType;

  const handleFilter = (f) => {
    if (f === 'ALL') {
      setFilterType('all');
      setFilterCategory('all');
    } else if (['income', 'expense'].includes(f)) {
      setFilterType(f);
      setFilterCategory('all');
    } else {
      setFilterType('all');
      setFilterCategory(f);
    }
  };

  return (
    <div className="flex flex-col gap-6 fade-in">
      <div className="flex justify-between items-end mb-2">
        <div>
          <div className="font-mono-dm text-[0.65rem] tracking-[0.15em] uppercase text-accent mb-[0.4rem] font-medium">02 — Ledger</div>
          <div className="font-syne text-[1.5rem] font-[800] tracking-[-0.03em] leading-none">All Transactions</div>
        </div>
        <input 
          className="font-mono-dm text-[0.85rem] px-4 py-2.5 bg-white/5 border border-border-custom rounded-xl text-paper outline-none focus:border-accent/30 transition-all w-[240px] font-medium" 
          placeholder="Search…" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button 
          onClick={exportToCSV}
          className="font-mono-dm text-[0.7rem] px-5 py-2.5 bg-accent/10 border border-accent/20 rounded-xl text-accent hover:bg-accent/20 transition-all font-bold cursor-none flex items-center gap-2"
        >
          <span>📥</span> EXPORT CSV
        </button>
      </div>

      <div className="flex gap-2 flex-wrap mb-2">
        {['ALL', 'income', 'expense', ...CATEGORIES].map((f) => (
          <button
            key={f}
            className={`font-mono-dm text-[0.62rem] px-3 py-1.5 rounded-full border border-transparent transition-all cursor-none tracking-widest font-semibold ${
              activeFilter === f 
                ? 'bg-accent/10 border-accent/30 text-accent' 
                : 'bg-white/5 border-border-custom text-white/35 hover:border-accent/30 hover:text-accent'
            }`}
            onClick={() => handleFilter(f)}
            style={activeFilter === f && !['ALL', 'income', 'expense'].includes(f) ? {
              borderColor: CATEGORY_COLORS[f],
              color: CATEGORY_COLORS[f],
              background: `${CATEGORY_COLORS[f]}12`
            } : {}}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="p-5 rounded-2xl bg-card border border-border-custom shadow-sm overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border-custom">
              <th className="font-mono-dm text-[0.65rem] tracking-[0.1em] uppercase text-white/18 p-[0.65rem_0.85rem] text-left font-medium">Description</th>
              <th className="font-mono-dm text-[0.65rem] tracking-[0.1em] uppercase text-white/18 p-[0.65rem_0.85rem] text-left font-medium">Category</th>
              <th className="font-mono-dm text-[0.65rem] tracking-[0.1em] uppercase text-white/18 p-[0.65rem_0.85rem] text-left font-medium">Date</th>
              <th className="font-mono-dm text-[0.65rem] tracking-[0.1em] uppercase text-white/18 p-[0.65rem_0.85rem] text-left font-medium">Type</th>
              <th className="font-mono-dm text-[0.65rem] tracking-[0.1em] uppercase text-white/18 p-[0.65rem_0.85rem] text-right font-medium">Amount</th>
              {role === 'admin' && <th className="font-mono-dm text-[0.65rem] tracking-[0.1em] uppercase text-white/18 p-[0.65rem_0.85rem] text-center font-medium">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((t) => (
              <tr key={t.id} className="border-b border-white/[0.035] transition-colors hover:bg-white/[0.025] cursor-none group">
                <td className="p-[0.8rem_0.75rem] text-[0.83rem] font-[600] text-white/82">{t.description}</td>
                <td className="p-[0.8rem_0.75rem] text-[0.83rem]">
                  <span className="inline-flex items-center gap-[5px] text-[0.67rem] px-[9px] py-[3px] rounded-full font-mono-dm font-medium" style={{
                    background: `${CATEGORY_COLORS[t.category] || "#9d6cff"}14`,
                    color: CATEGORY_COLORS[t.category] || "#9d6cff",
                    border: `1px solid ${CATEGORY_COLORS[t.category] || "#9d6cff"}28`
                  }}>
                    <span className="w-1 h-1 rounded-full" style={{
                      background: CATEGORY_COLORS[t.category] || "#9d6cff",
                    }} />
                    {t.category}
                  </span>
                </td>
                <td className="p-[0.8rem_0.75rem] text-[0.83rem]">
                  <span className="font-mono-dm text-[0.7rem] text-white/28 font-medium">
                    {new Date(t.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
                </td>
                <td className="p-[0.8rem_0.75rem] text-[0.83rem]">
                  <span className={`font-mono-dm text-[0.58rem] px-[7px] py-[2px] rounded-full tracking-[0.06em] font-bold ${
                    t.type === 'income' 
                      ? 'bg-green/10 border border-green/20 text-green' 
                      : 'bg-red/10 border border-red/20 text-red'
                  }`}>
                    {t.type.toUpperCase()}
                  </span>
                </td>
                <td className="p-[1rem_0.85rem] text-[0.92rem] text-right">
                  <span className={`font-syne font-[700] text-[1rem] leading-none ${
                    t.type === 'income' ? 'text-green' : 'text-red'
                  }`}>
                    {t.type === 'income' ? '+' : '−'}{formatCurrency(t.amount)}
                  </span>
                </td>
                {role === 'admin' && (
                  <td className="p-[0.8rem_0.75rem] text-center">
                    <div className="flex gap-2 justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        className="p-1.5 hover:bg-white/10 rounded-lg text-white/40 hover:text-accent transition-all"
                        onClick={() => setEditingTransaction(t)}
                        title="Edit Entry"
                      >
                        ✏️
                      </button>
                      <button 
                        className="p-1.5 hover:bg-white/10 rounded-lg text-white/40 hover:text-red transition-all"
                        onClick={() => {
                          if (window.confirm("Delete this entry?")) deleteTransaction(t.id);
                        }}
                        title="Delete Entry"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredTransactions.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-center gap-4">
            <div className="text-4xl opacity-20">📂</div>
            <div>
              <div className="font-syne text-[1.1rem] font-bold text-white/40">No Transactions Found</div>
              <p className="text-[0.7rem] text-white/20 font-mono-dm uppercase tracking-wider mt-1">Try adjusting your search or filters</p>
            </div>
            <button 
              onClick={resetFilters}
              className="mt-2 px-6 py-2 bg-white/5 border border-white/10 rounded-full text-accent font-mono-dm text-[0.65rem] font-bold hover:bg-white/10 transition-all uppercase tracking-widest cursor-none"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
