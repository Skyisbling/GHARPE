"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:5000";

export interface AuthUser {
  id: number;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  preferred_language?: string;
  latitude?: number;
  longitude?: number;
  phone_verified: boolean;
  role:
    | "customer"
    | "worker"
    | "cooperative"
    | "admin";
  status: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;

  redirectTo: string | null;

  setRedirectTo: (
    path: string | null
  ) => void;

  login: (payload: {
    identifier: string;
    password: string;
  }) => Promise<{
    ok: boolean;
    error?: string;
    phone?: string;
  }>;

  register: (
    payload: Record<string, unknown>
  ) => Promise<{
    ok: boolean;
    error?: string;
    phone?: string;
  }>;

  verifyOtp: (
    phone: string,
    otp: string
  ) => Promise<{
    ok: boolean;
    error?: string;
  }>;

  resendOtp: (
    phone: string
  ) => Promise<{
    ok: boolean;
    error?: string;
  }>;

  logout: () => void;
}

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] =
    useState<AuthUser | null>(null);

  const [token, setToken] =
    useState<string | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [redirectTo, setRedirectTo] =
    useState<string | null>(null);

  const saveAuth = useCallback(
    (
      newToken: string,
      newUser: AuthUser
    ) => {
      setToken(newToken);
      setUser(newUser);

      localStorage.setItem(
        "gharpe-token",
        newToken
      );

      localStorage.setItem(
        "gharpe-user",
        JSON.stringify(newUser)
      );
    },
    []
  );

  // ========================================================
  // RESTORE SESSION
  // ========================================================

  useEffect(() => {
    const storedToken =
      localStorage.getItem(
        "gharpe-token"
      );

    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    fetch(
      `${API_URL}/api/auth/me`,
      {
        headers: {
          Authorization:
            `Bearer ${storedToken}`,
        },
      }
    )
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(
            "Invalid authentication token"
          );
        }

        const data = await res.json();

        setToken(storedToken);
        setUser(data.user);

        localStorage.setItem(
          "gharpe-user",
          JSON.stringify(data.user)
        );
      })
      .catch(() => {
        localStorage.removeItem(
          "gharpe-token"
        );

        localStorage.removeItem(
          "gharpe-user"
        );

        setToken(null);
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // ========================================================
  // LOGIN
  // Email OR phone + password
  // ========================================================

  const login = useCallback(
    async ({
      identifier,
      password,
    }: {
      identifier: string;
      password: string;
    }) => {
      try {
        const res = await fetch(
          `${API_URL}/api/auth/login`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              identifier,
              password,
            }),
          }
        );

        const data = await res.json();

        if (!res.ok) {
          return {
            ok: false,
            error:
              data.error ||
              "Unable to login",
          };
        }

        return {
          ok: true,
          phone: data.phone,
        };
      } catch {
        return {
          ok: false,
          error:
            "Backend is unavailable. Start Flask on port 5000.",
        };
      }
    },
    []
  );

  // ========================================================
  // REGISTER
  // ========================================================

  const register = useCallback(
    async (
      payload: Record<string, unknown>
    ) => {
      try {
        const res = await fetch(
          `${API_URL}/api/auth/register`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(
              payload
            ),
          }
        );

        const data =
          await res.json();

        if (!res.ok) {
          return {
            ok: false,
            error:
              data.error ||
              "Registration failed",
          };
        }

        return {
          ok: true,
          phone: data.phone,
        };
      } catch {
        return {
          ok: false,
          error:
            "Backend is unavailable. Start Flask on port 5000.",
        };
      }
    },
    []
  );

  // ========================================================
  // VERIFY OTP
  // ========================================================

  const verifyOtp = useCallback(
    async (
      phone: string,
      otp: string
    ) => {
      try {
        const res = await fetch(
          `${API_URL}/api/auth/verify-otp`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              phone,
              otp,
            }),
          }
        );

        const data =
          await res.json();

        if (!res.ok) {
          return {
            ok: false,
            error:
              data.error ||
              "Invalid OTP",
          };
        }

        if (
          data.token &&
          data.user
        ) {
          saveAuth(
            data.token,
            data.user
          );
        }

        return {
          ok: true,
        };
      } catch {
        return {
          ok: false,
          error:
            "Backend is unavailable.",
        };
      }
    },
    [saveAuth]
  );

  // ========================================================
  // RESEND OTP
  // ========================================================

  const resendOtp = useCallback(
    async (phone: string) => {
      try {
        const res = await fetch(
          `${API_URL}/api/auth/resend-otp`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              phone,
            }),
          }
        );

        const data =
          await res.json();

        if (!res.ok) {
          return {
            ok: false,
            error:
              data.error ||
              "Unable to resend OTP",
          };
        }

        return {
          ok: true,
        };
      } catch {
        return {
          ok: false,
          error:
            "Backend is unavailable.",
        };
      }
    },
    []
  );

  // ========================================================
  // LOGOUT
  // ========================================================

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setRedirectTo(null);

    localStorage.removeItem(
      "gharpe-token"
    );

    localStorage.removeItem(
      "gharpe-user"
    );
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        redirectTo,
        setRedirectTo,
        login,
        register,
        verifyOtp,
        resendOtp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx =
    useContext(AuthContext);

  if (!ctx) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return ctx;
}