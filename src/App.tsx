import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Landing from "./pages/Landing";
import GameDashboard from "./pages/GameDashboard";
import Index from "./pages/Index";
import Drivers from "./pages/Drivers";
import Vehicles from "./pages/Vehicles";
import MapView from "./pages/MapView";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";
import { Sidebar } from "./components/Sidebar";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const showSidebar = location.pathname !== "/";

  return (
    <div className="flex min-h-screen w-full">
      {showSidebar && <Sidebar />}
      <main className={showSidebar ? "flex-1 ml-64" : "flex-1"}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<GameDashboard />} />
          <Route path="/upload" element={<Index />} />
          <Route path="/drivers" element={<Drivers />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/reports" element={<Reports />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
