import { useState, useCallback } from 'react';
import { useAuthContext } from '../context/AuthContext.jsx';
import * as authApi from '../services/auth.api.js';

export function useAuth() {
  const authContext = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * login
   *
   * Calls auth.api.login with the provided credentials, then hands the
   * returned token to AuthContext so it is persisted and decoded.
   *
   * @param {{ email: string, password: string }} credentials
   */
  const login = useCallback(async (credentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await authApi.login(credentials);
      authContext.login(data.token);
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [authContext]);

  /**
   * register
   *
   * Calls auth.api.register with the provided data, then hands the
   * returned token to AuthContext so it is persisted and decoded.
   *
   * @param {{ name: string, email: string, password: string }} data
   */
  const register = useCallback(async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await authApi.register(data);
      authContext.register(result.token);
    } catch (err) {
      setError(err.message || 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [authContext]);

  /**
   * logout
   *
   * Delegates to AuthContext.logout() which clears localStorage and state.
   */
  const logout = useCallback(() => {
    authContext.logout();
  }, [authContext]);

  return {
    user: authContext.user,
    token: authContext.token,
    isAuthenticated: Boolean(authContext.user),
    login,
    register,
    logout,
    isLoading,
    error,
  };
}

export default useAuth;

