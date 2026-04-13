import { useAuth } from "./contexts/AuthContext";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Insights from "./pages/Insights";
import Login from "./pages/Login";
import CustomCursor from "./components/common/CustomCursor";
import { useTransactions } from "./contexts/TransactionContext";

function App() {
  const { isAuthenticated, isLoading } = useAuth();
  const { activePage } = useTransactions();

  // Full-screen spinner while JWT token is being validated on mount
  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-ink">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
          <p className="font-mono-dm text-[0.65rem] text-white/30 tracking-widest uppercase">Loading</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <CustomCursor />
        <Login />
      </>
    );
  }

  return (
    <>
      <CustomCursor />
      <Layout>
        {activePage === "dashboard"    && <Dashboard />}
        {activePage === "transactions" && <Transactions />}
        {activePage === "insights"     && <Insights />}
      </Layout>
    </>
  );
}

export default App;
