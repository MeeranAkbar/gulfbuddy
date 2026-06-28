import { useSession } from "next-auth/react";

export type UserPlan = 'FREE' | 'PRO' | 'PREMIUM' | 'ELITE';

export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  plan: string;
}

export function useAuth() {
  const { data: session, status } = useSession();

  return { 
    user: session?.user as User | undefined, 
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated"
  };
}
