'use client';

import {
  useState,
  useMemo,
  useCallback,
  useEffect,
  createContext,
  useContext,
} from 'react';

// Mock user type to replace Firebase User
export interface MockUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  emailVerified: boolean;
  isAdmin: boolean;
  isPro: boolean;
}

export interface SignInInput {
  email: string;
  password?: string;
  displayName?: string;
}

interface AuthContextValue {
  user: MockUser | null;
  isUserLoading: boolean;
  userError: Error | null;
  signIn: (input: SignInInput) => Promise<void>;
  signOut: () => Promise<void>;
}

const ADMIN_EMAIL = 'admin@example.com';
const STORAGE_KEY = 'ai-powerhouse.mock-user';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const buildMockUser = ({ email, displayName }: SignInInput): MockUser => {
  const normalizedEmail = email.trim().toLowerCase();
  const isAdmin = normalizedEmail === ADMIN_EMAIL;
  const fallbackName = normalizedEmail.split('@')[0] || 'User';

  return {
    uid: isAdmin ? 'admin-user' : `mock-${normalizedEmail}-${Date.now()}`,
    email: normalizedEmail,
    displayName: displayName?.trim() || (isAdmin ? 'Admin' : fallbackName),
    photoURL: null,
    emailVerified: true,
    isAdmin,
    isPro: isAdmin,
  };
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [userError, setUserError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored) as MockUser);
      }
    } catch (error) {
      setUserError(error as Error);
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsUserLoading(false);
    }
  }, []);

  const signIn = useCallback(async (input: SignInInput) => {
    const normalizedEmail = input.email.trim().toLowerCase();
    if (!normalizedEmail) {
      throw new Error('Email is required.');
    }

    const nextUser = buildMockUser({ ...input, email: normalizedEmail });
    setUser(nextUser);
    setUserError(null);

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    } catch (error) {
      setUserError(error as Error);
    }
  }, []);

  const signOut = useCallback(async () => {
    setUser(null);
    setUserError(null);
    window.localStorage.removeItem(STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isUserLoading,
      userError,
      signIn,
      signOut,
    }),
    [user, isUserLoading, userError, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useUser() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useUser must be used within an AuthProvider.');
  }

  return useMemo(
    () => ({
      user: context.user,
      isUserLoading: context.isUserLoading,
      userError: context.userError,
    }),
    [context.user, context.isUserLoading, context.userError],
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }

  return useMemo(
    () => ({
      signIn: context.signIn,
      signOut: context.signOut,
    }),
    [context.signIn, context.signOut],
  );
}
