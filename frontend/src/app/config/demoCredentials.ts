export interface DemoUser {
  email: string;
  password: string;
  role: 'user' | 'chef' | 'admin';
  name: string;
}

export const DEMO_CREDENTIALS: DemoUser[] = [
  {
    email: "user@recipenest.com",
    password: "user123",
    role: "user",
    name: "John Doe"
  },
  {
    email: "chef@recipenest.com",
    password: "chef123",
    role: "chef",
    name: "Chef Maria Garcia"
  },
  {
    email: "admin@recipenest.com",
    password: "admin123",
    role: "admin",
    name: "Admin Sarah Johnson"
  }
];

export function authenticateUser(email: string, password: string): DemoUser | null {
  const user = DEMO_CREDENTIALS.find(
    (u) => u.email === email && u.password === password
  );
  return user || null;
}

export function getCurrentUser(): DemoUser | null {
  const userStr = localStorage.getItem('currentUser');
  if (!userStr) return null;
  return JSON.parse(userStr);
}

export function setCurrentUser(user: DemoUser): void {
  localStorage.setItem('currentUser', JSON.stringify(user));
}

export function logout(): void {
  localStorage.removeItem('currentUser');
}
