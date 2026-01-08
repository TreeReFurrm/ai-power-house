import { useMemo } from 'react';

// This is a dummy user object.
// In a real application, this would come from an authentication provider.
const dummyUser = {
  uid: '12345',
  email: 'testuser@example.com',
  displayName: 'Test User',
  photoURL: null,
};

export function useUser() {
  const state = useMemo(() => ({
    user: dummyUser,
    isUserLoading: false,
    userError: null
  }), []);
  return state;
}

export function useAuth() {
    const state = useMemo(() => ({
        signOut: () => {
          console.log('Dummy sign out');
          return Promise.resolve();
        },
    }), []);
    return state;
}