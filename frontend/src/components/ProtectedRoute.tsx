"use client";

import { useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Wraps any content that requires authentication.
 * While auth is loading, shows nothing (prevents flash).
 * If not authenticated, redirects to /login and stores the intended path.
 */
export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isLoading, setRedirectTo } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return; // still loading — don't redirect yet

    if (!user) {
      setRedirectTo(pathname);
      router.replace("/login");
    }
  }, [user, isLoading, pathname, router, setRedirectTo]);

  // Show nothing while loading or while redirecting unauthenticated users
  if (isLoading || !user) return null;

  return <>{children}</>;
}
