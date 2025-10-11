import { Home, Upload, LayoutDashboard, Users, Truck, Map, FileText, Moon, Sun } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const navItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Upload", url: "/upload", icon: Upload },
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Drivers", url: "/drivers", icon: Users },
  { title: "Vehicles", url: "/vehicles", icon: Truck },
  { title: "Map View", url: "/map", icon: Map },
  { title: "Reports", url: "/reports", icon: FileText },
];

export const Sidebar = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(!isDark);
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 glass border-r z-50 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg gradient-primary">
            <Truck className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg">DeliveryPro</h2>
            <p className="text-xs text-muted-foreground">Smart Logistics</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.url}
            to={item.url}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "gradient-primary text-white shadow-lg glow"
                  : "hover:bg-muted/50 text-foreground"
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span className="font-medium">{item.title}</span>
          </NavLink>
        ))}
      </nav>

      {/* Theme Toggle */}
      <div className="p-4 border-t border-white/10">
        <Button
          onClick={toggleTheme}
          variant="outline"
          className="w-full justify-start gap-3"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
        </Button>
      </div>
    </aside>
  );
};
