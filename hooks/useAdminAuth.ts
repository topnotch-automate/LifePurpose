"use client";

import { useState, useEffect } from "react";

/**
 * Hook to check if user is authenticated as admin
 * This checks the admin session cookie via API
 */
export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch("/api/admin/auth-status");
      const data = await response.json();
      setIsAuthenticated(data.authenticated === true);
    } catch (error) {
      console.error("Failed to check auth status:", error);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  return { isAuthenticated, isLoading, refetch: checkAuthStatus };
}

