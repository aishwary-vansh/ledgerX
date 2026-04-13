import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const Layout = ({ children }) => {
  return (
    <div className="flex w-full h-full overflow-hidden bg-ink">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        <Topbar />
        <div className="scroll-area flex-1 overflow-y-auto overflow-x-hidden p-6 relative">
          <div className="fixed inset-0 z-0 pointer-events-none bg-[linear-gradient(rgba(91,79,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(91,79,255,0.035)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_65%_35%,black_0%,transparent_65%)]" />
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
