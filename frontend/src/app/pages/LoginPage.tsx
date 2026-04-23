import { Link, useNavigate, useLocation } from "react-router";
import { Mail, Lock, Eye, AlertCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { authenticateUser, setCurrentUser } from "../config/demoCredentials";
import { useState } from "react";
import { toast } from "sonner";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Get the page user was trying to access
  const from = (location.state as { from?: string })?.from || null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const user = authenticateUser(email, password);

    if (user) {
      setCurrentUser(user);
      toast.success(`Welcome back, ${user.name}!`);

      // If user was trying to access a specific page, redirect there if role matches
      if (from) {
        navigate(from);
      } else {
        // Otherwise, route to appropriate dashboard based on role
        switch (user.role) {
          case 'admin':
            navigate("/admin");
            break;
          case 'chef':
            navigate("/chef");
            break;
          case 'user':
          default:
            navigate("/dashboard");
            break;
        }
      }
    } else {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>
            {from ? `Please login to access ${from}` : "Sign in to your RecipeNest account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Alert className="bg-blue-50 border-blue-200 text-blue-900">
              <AlertDescription className="text-xs space-y-2">
                <div><strong>Demo Credentials (Click to auto-fill):</strong></div>
                <button
                  type="button"
                  className="block w-full text-left hover:bg-blue-100 p-1 rounded transition-colors"
                  onClick={() => {
                    setEmail("user@recipenest.com");
                    setPassword("user123");
                  }}
                >
                  👤 User: user@recipenest.com / user123
                </button>
                <button
                  type="button"
                  className="block w-full text-left hover:bg-blue-100 p-1 rounded transition-colors"
                  onClick={() => {
                    setEmail("chef@recipenest.com");
                    setPassword("chef123");
                  }}
                >
                  👨‍🍳 Chef: chef@recipenest.com / chef123
                </button>
                <button
                  type="button"
                  className="block w-full text-left hover:bg-blue-100 p-1 rounded transition-colors"
                  onClick={() => {
                    setEmail("admin@recipenest.com");
                    setPassword("admin123");
                  }}
                >
                  ⚙️ Admin: admin@recipenest.com / admin123
                </button>
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <Eye className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                  Remember me
                </Label>
              </div>
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full">
              Sign In
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}