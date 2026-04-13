import { useTransactions } from "../../contexts/TransactionContext";

const navItems = [
  { id: "dashboard",    label: "Dashboard",    icon: "⚡" },
  { id: "transactions", label: "Transactions", icon: "💳" },
  { id: "insights",     label: "Insights",     icon: "📊" },
];

const Sidebar = () => {
  const { activePage, setActivePage } = useTransactions();

  return (
    <aside className="w-[260px] h-screen bg-card2 border-r border-border-custom flex flex-col p-[2rem_1.4rem] shrink-0 relative overflow-hidden">
      <div className="sidebar-orb w-[200px] h-[200px] bottom-10 -left-[70px] bg-[radial-gradient(circle,rgba(91,79,255,0.3),transparent_70%)]" />
      <div className="sidebar-orb w-[130px] h-[130px] top-[100px] -left-5 bg-[radial-gradient(circle,rgba(0,245,200,0.12),transparent_70%)]" />
      
      <div className="sidebar-logo font-syne text-[1.75rem] font-[800] tracking-[-0.04em] mb-1 text-paper relative z-10 leading-none">
        Ledger<span className="text-accent">X</span>
      </div>
      <div className="sidebar-sub font-mono-dm text-[0.65rem] tracking-[0.12em] text-white/20 uppercase mb-[2.5rem] relative z-10 font-medium">
        ◈ Finance Dashboard
      </div>
      
      <div className="nav-label font-mono-dm text-[0.6rem] tracking-[0.12em] uppercase text-white/18 px-2 mb-3 relative z-10 font-medium">
        Navigation
      </div>
      
      <nav className="space-y-[3px] relative z-10">
        {navItems.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button 
              key={item.id} 
              onClick={() => setActivePage(item.id)}
              className={`flex items-center gap-[0.8rem] w-full p-[0.75rem_1rem] rounded-xl text-[0.95rem] font-[600] transition-all duration-200 cursor-none select-none ${
                isActive 
                  ? 'bg-accent/7 border border-accent/18 text-accent' 
                  : 'text-white/38 border border-transparent hover:text-white/70 hover:bg-white/4'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
              {isActive && <span className="w-[5px] h-[5px] rounded-full bg-accent ml-auto" />}
            </button>
          );
        })}
      </nav>
      
      <div className="mt-auto font-mono-dm text-[0.58rem] text-white/14 pt-[1.1rem] tracking-[0.05em] border-t border-border-custom relative z-10 uppercase">
        © 2026 LedgerX · Developed by Aishwary Vansh<br />v2.2 · Tailwind Refactor Complete
      </div>
    </aside>
  );
};

export default Sidebar;