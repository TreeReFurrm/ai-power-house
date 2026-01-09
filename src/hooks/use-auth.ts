import { useState, useMemo, useCallback } from 'react';

// Mock user type to replace Firebase User
export interface MockUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

// Default mock user for development
const defaultMockUser: MockUser = {
  uid: 'demo-user-123',
  email: 'demo@example.com',
  displayName: 'Demo User',
  photoURL: null,
  emailVerified: true,
};

export function useUser() {
  const [user, setUser] = useState<MockUser | null>(defaultMockUser);
  const [isUserLoading, setIsUserLoading] = useState(false);
  const [userError, setUserError] = useState<Error | null>(null);

  return useMemo(() => ({
    user,
    isUserLoading,
    userError,
    setUser,
  }), [user, isUserLoading, userError]);
}

export function useAuth() {
  const { setUser } = useUser();
  
  const signOut = useCallback(() => {
    setUser(null);
    return Promise.resolve();
  }, [setUser]);

  return useMemo(() => ({
    signOut,
  }), [signOut]);
}
