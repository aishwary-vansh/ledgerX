import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Insights from "./pages/Insights";
import CustomCursor from "./components/common/CustomCursor";
import { useTransactions } from "./contexts/TransactionContext";

function App() {
  const { activePage } = useTransactions();

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
