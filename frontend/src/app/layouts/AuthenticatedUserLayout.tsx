import { Outlet, Link, useLocation, useNavigate, Navigate } from "react-router";
import { ChefHat, Home, Search, User, LogOut, Menu, X, Bookmark } from "lucide-react";
import { Button } from "../components/ui/button";
import { useState, useEffect } from "react";
import { logout, getCurrentUser } from "../config/demoCredentials";
import { toast } from "sonner";

export function AuthenticatedUserLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const currentUser = getCurrentUser();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  // Auth check with effect
  useEffect(() => {
    if (!currentUser) {
      toast.error("Please login to access this page");
    } else if (currentUser.role !== 'user') {
      toast.error("This page is only accessible to users");
    }
  }, [currentUser]);

  // Not logged in - redirect to login
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Wrong role - redirect to appropriate dashboard
  if (currentUser.role !== 'user') {
    switch (currentUser.role) {
      case 'admin':
        return <Navigate to="/admin" replace />;
      case 'chef':
        return <Navigate to="/chef" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                <ChefHat className="h-6 w-6" />
              </div>
              <span className="text-xl font-semibold text-foreground">RecipeNest</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                to="/dashboard"
                className={`text-sm ${
                  location.pathname === "/dashboard" ? "text-primary" : "text-foreground hover:text-primary"
                } transition-colors`}
              >
                Dashboard
              </Link>
              <Link
                to="/recipes"
                className={`text-sm ${
                  location.pathname === "/recipes" ? "text-primary" : "text-foreground hover:text-primary"
                } transition-colors`}
              >
                Recipes
              </Link>
              <Link
                to="/saved-recipes"
                className={`text-sm ${
                  location.pathname === "/saved-recipes" ? "text-primary" : "text-foreground hover:text-primary"
                } transition-colors`}
              >
                Saved
              </Link>
              <Link
                to="/profile"
                className={`text-sm ${
                  location.pathname === "/profile" ? "text-primary" : "text-foreground hover:text-primary"
                } transition-colors`}
              >
                Profile
              </Link>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              <span className="text-sm text-muted-foreground">{currentUser?.name || 'User'}</span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-border">
              <div className="flex flex-col gap-4">
                <Link
                  to="/dashboard"
                  className="text-sm text-foreground hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/recipes"
                  className="text-sm text-foreground hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Recipes
                </Link>
                <Link
                  to="/saved-recipes"
                  className="text-sm text-foreground hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Saved Recipes
                </Link>
                <Link
                  to="/profile"
                  className="text-sm text-foreground hover:text-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <div className="flex flex-col gap-2 pt-4 border-t border-border">
                  <span className="text-sm text-muted-foreground px-3">{currentUser?.name || 'User'}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-border mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-primary text-primary-foreground p-2 rounded-lg">
                  <ChefHat className="h-5 w-5" />
                </div>
                <span className="text-lg font-semibold">RecipeNest</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Discover and share amazing recipes from around the world.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <div className="flex flex-col gap-2">
                <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-primary">
                  Dashboard
                </Link>
                <Link to="/saved-recipes" className="text-sm text-muted-foreground hover:text-primary">
                  Saved
                </Link>
                <Link to="/profile" className="text-sm text-muted-foreground hover:text-primary">
                  Profile
                </Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <p className="text-sm text-muted-foreground">
                Email: hello@recipenest.com<br />
                Support: support@recipenest.com
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
            © 2026 RecipeNest. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
