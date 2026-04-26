import { Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { useEffect, useState } from "react";
import { apiGetAllUsers, apiToggleUserStatus, apiDeleteUser } from "../config/api";
import { toast } from "sonner";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await apiGetAllUsers();
      if (res.success) setUsers(res.users);
    } catch { toast.error("Failed to fetch users"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleToggle = async (id: string) => {
    try {
      const res = await apiToggleUserStatus(id);
      if (res.success) { toast.success(res.message); fetchUsers(); }
      else toast.error(res.message);
    } catch { toast.error("Failed to update user"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this user permanently?")) return;
    try {
      const res = await apiDeleteUser(id);
      if (res.success) { toast.success("User deleted"); fetchUsers(); }
      else toast.error(res.message);
    } catch { toast.error("Failed to delete user"); }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">User Management</h1>
        <p className="text-muted-foreground">Manage all registered users on the platform</p>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading users...</p>
      ) : users.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">No users found.</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <Card key={user._id}>
              <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">{user.name}</p>
                    <Badge variant={user.role === "admin" ? "destructive" : user.role === "chef" ? "default" : "secondary"} className="capitalize">
                      {user.role}
                    </Badge>
                    <Badge variant={user.isActive ? "default" : "outline"}>
                      {user.isActive ? "Active" : "Suspended"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <p className="text-xs text-muted-foreground mt-1">Joined {new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleToggle(user._id)}>
                    {user.isActive
                      ? <><ToggleRight className="h-4 w-4 mr-1" /> Suspend</>
                      : <><ToggleLeft className="h-4 w-4 mr-1" /> Activate</>}
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(user._id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}