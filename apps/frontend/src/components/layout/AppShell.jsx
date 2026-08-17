import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";

export default function AppShell() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex min-h-screen flex-1 flex-col">
        <MobileNav />
        <main className="flex-1 overflow-x-hidden px-4 py-5 sm:px-6 lg:px-10 lg:py-8 pb-[calc(4.5rem+env(safe-area-inset-bottom))] lg:pb-8">
          <div className="mx-auto w-full max-w-3xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
