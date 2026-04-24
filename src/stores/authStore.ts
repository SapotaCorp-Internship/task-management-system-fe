import { create } from "zustand";
 
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}
 
interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  clearAuth: () => void;
}
 
export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  clearAuth: () => set({ user: null, isAuthenticated: false }),
}));
 