import { Users, Search, MoreVertical, Ban, UserCheck } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { toast } from "sonner";
import { useState } from "react";

const initialUsers = [
  { id: 1, name: "John Smith", email: "john@email.com", role: "User", status: "active", joinedDate: "2025-01-15", recipesCount: 0 },
  { id: 2, name: "Maria Rodriguez", email: "maria@email.com", role: "Chef", status: "active", joinedDate: "2025-01-20", recipesCount: 12 },
  { id: 3, name: "Emma Wilson", email: "emma@email.com", role: "User", status: "active", joinedDate: "2025-02-01", recipesCount: 0 },
  { id: 4, name: "Giovanni Russo", email: "giovanni@email.com", role: "Chef", status: "active", joinedDate: "2025-02-05", recipesCount: 8 },
  { id: 5, name: "Sarah Green", email: "sarah@email.com", role: "Chef", status: "active", joinedDate: "2025-02-10", recipesCount: 15 },
  { id: 6, name: "David Chen", email: "david@email.com", role: "User", status: "suspended", joinedDate: "2024-12-20", recipesCount: 0 },
  { id: 7, name: "Yuki Tanaka", email: "yuki@email.com", role: "Chef", status: "active", joinedDate: "2025-02-15", recipesCount: 6 },
  { id: 8, name: "Ahmed Hassan", email: "ahmed@email.com", role: "Chef", status: "active", joinedDate: "2025-02-18", recipesCount: 4 },
];

export function UserManagementPage() {
  const [users, setUsers] = useState(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const handleSuspendUser = (userId: number, userName: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: "suspended" } : user
    ));
    toast.error(`${userName} has been suspended`, {
      description: "User will be notified via email.",
    });
  };

  const handleActivateUser = (userId: number, userName: string) => {
    setUsers(users.map(user =>
      user.id === userId ? { ...user, status: "active" } : user
    ));
    toast.success(`${userName} has been activated`, {
      description: "User can now access the platform.",
    });
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role.toLowerCase() === roleFilter.toLowerCase();
    return matchesSearch && matchesRole;
  });

  const activeUsers = users.filter(u => u.status === "active").length;
  const totalChefs = users.filter(u => u.role === "Chef").length;
  const suspendedUsers = users.filter(u => u.status === "suspended").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">User Management</h1>
        <p className="text-muted-foreground">Manage all platform users and their access</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">{activeUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <UserCheck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Chefs</p>
                <p className="text-2xl font-bold">{totalChefs}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-destructive/10 rounded-lg">
                <Ban className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Suspended</p>
                <p className="text-2xl font-bold">{suspendedUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={roleFilter === "all" ? "default" : "outline"}
                onClick={() => setRoleFilter("all")}
              >
                All
              </Button>
              <Button
                variant={roleFilter === "user" ? "default" : "outline"}
                onClick={() => setRoleFilter("user")}
              >
                Users
              </Button>
              <Button
                variant={roleFilter === "chef" ? "default" : "outline"}
                onClick={() => setRoleFilter("chef")}
              >
                Chefs
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Recipes</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === "Chef" ? "default" : "secondary"}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === "active" ? "secondary" : "destructive"}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.recipesCount}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{user.joinedDate}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {user.status === "active" ? (
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleSuspendUser(user.id, user.name)}
                            >
                              <Ban className="h-4 w-4 mr-2" />
                              Suspend User
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => handleActivateUser(user.id, user.name)}
                            >
                              <UserCheck className="h-4 w-4 mr-2" />
                              Activate User
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
