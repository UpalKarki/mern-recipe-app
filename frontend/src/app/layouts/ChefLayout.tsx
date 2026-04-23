import { Outlet, Link, useLocation, useNavigate, Navigate } from "react-router";
import { ChefHat, LayoutDashboard, BookOpen, Plus, User, LogOut, Menu, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { useState, useEffect } from "react";
import { logout, getCurrentUser } from "../config/demoCredentials";
import { toast } from "sonner";

export function ChefLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const currentUser = getCurrentUser();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const navItems = [
    { path: "/chef", label: "Dashboard", icon: LayoutDashboard },
    { path: "/chef/recipes", label: "My Recipes", icon: BookOpen },
    { path: "/chef/add-recipe", label: "Add Recipe", icon: Plus },
    { path: "/chef/profile", label: "Profile", icon: User },
  ];

  // Auth check with effect
  useEffect(() => {
    if (!currentUser) {
      toast.error("Please login to access this page");
    } else if (currentUser.role !== 'chef') {
      toast.error("This page is only accessible to chefs");
    }
  }, [currentUser]);

  // Not logged in - redirect to login
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Wrong role - redirect to appropriate dashboard
  if (currentUser.role !== 'chef') {
    switch (currentUser.role) {
      case 'admin':
        return <Navigate to="/admin" replace />;
      case 'user':
        return <Navigate to="/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 bg-sidebar text-sidebar-foreground flex-col">
        <div className="p-6 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground p-2 rounded-lg">
              <ChefHat className="h-6 w-6" />
            </div>
            <div>
              <span className="text-lg font-semibold block">RecipeNest</span>
              <span className="text-xs text-sidebar-foreground/70">Chef Portal</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="lg:hidden fixed left-0 top-0 bottom-0 w-64 bg-sidebar text-sidebar-foreground flex flex-col z-50">
            <div className="p-6 border-b border-sidebar-border flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2">
                <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                  <ChefHat className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-lg font-semibold block">RecipeNest</span>
                  <span className="text-xs text-sidebar-foreground/70">Chef Portal</span>
                </div>
              </Link>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="flex-1 p-4">
              <div className="flex flex-col gap-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-sm">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </nav>

            <div className="p-4 border-t border-sidebar-border">
              <Button
                variant="ghost"
                className="w-full justify-start text-sidebar-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5 mr-3" />
                Logout
              </Button>
            </div>
          </aside>
        </>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-border px-4 lg:px-8 h-16 flex items-center justify-between">
          <button
            className="lg:hidden p-2"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="hidden lg:block">
            <h1 className="text-xl font-semibold">Chef Portal</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {currentUser?.name || 'Chef'}!
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
