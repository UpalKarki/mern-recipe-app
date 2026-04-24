// This file bridges the old demo-based pages to the real backend auth.
// Pages still import from here — but now they read the real logged-in user.

export interface DemoUser {
  email: string;
  password: string;
  role: 'user' | 'chef' | 'admin';
  name: string;
  _id?: string;
  bio?: string;
  profileImage?: string;
}

// No longer used for auth — kept so old imports don't break
export const DEMO_CREDENTIALS: DemoUser[] = [];

export function authenticateUser(_email: string, _password: string): DemoUser | null {
  return null;
}

// Reads the real user saved by LoginPage
export function getCurrentUser(): DemoUser | null {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

export function setCurrentUser(user: DemoUser): void {
  localStorage.setItem('user', JSON.stringify(user));
}

export function logout(): void {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
}