import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

interface Article {
  id: string;
  title: string;
  content: string;
  date: string;
  // Add other properties as needed
}

interface UserContextType {
  // Auth-related state
  loggedIn: boolean;
  setLoggedIn: (value: boolean) => void; // Add this line
  authLoading: boolean;
  checkAuthStatus: () => Promise<void>;
  username: string | null;
  
  // Articles-related state
  articles: Article[];
  fetchArticles: () => Promise<void>;
  articlesLoading: boolean;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Add a module‑scoped flag to avoid duplicate runs (e.g., from React Strict Mode)
let hasCheckedAuth = false;

export const UserProvider = ({ children }: { children: ReactNode }) => {
  // Auth state
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const location = useLocation();
  const [username, setUsername] = useState<string | null>(null);
  
  // Articles state
  const [articles, setArticles] = useState<Article[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(false);

  // --- Articles methods ---
  // Modified fetchArticles to accept username argument
  const fetchArticles = useCallback(async (currentUsername: string | null) => {
    setArticlesLoading(true);
    // Use the username passed as an argument, default to ShowBrain_Team if null/falsy
    const fetchUsername = currentUsername || "ShowBrain_Team"; 
    try {
      const response = await fetch(`/api/articles/${encodeURIComponent(fetchUsername)}`, {
        method: "GET",
      });
      // No need to check for 401 here, as checkAuthStatus handles login state
      if (!response.ok) {
        throw new Error(`Failed to fetch articles for ${fetchUsername}: ${response.status}`);
      }
      const data = await response.json();
      setArticles(data);
    } catch (error) {
      console.error("Error fetching articles:", error);
      setArticles([]); // Clear articles on error
    } finally {
      setArticlesLoading(false);
    }
  }, []); // No dependencies needed as username is passed directly

  // --- Auth methods ---
  const checkAuthStatus = useCallback(async () => {
    setAuthLoading(true);
    let fetchedUsername: string | null = null;
    let fetchedLoggedIn = false;
    try {
      const response = await fetch('/api/auth/status', {
        method: "GET",
        credentials: "include",
      });
      
      if (!response.ok) {
        // Don't throw, just assume logged out on failure (e.g., 401)
        console.warn(`Auth status check failed: ${response.status}`);
      } else {
        const data = await response.json();
        fetchedLoggedIn = data.loggedIn;
        fetchedUsername = data.loggedIn ? data.username : null;
      }
      
      setLoggedIn(fetchedLoggedIn);
      setUsername(fetchedUsername);

    } catch (error) {
      console.error('Error checking authentication status:', error);
      setLoggedIn(false); // Reset on network/other errors
      setUsername(null);
    } finally {
      setAuthLoading(false);
      // Fetch articles *after* auth status is determined, using the resolved username
      fetchArticles(fetchedUsername);
    }
  // Depend on fetchArticles callback
  }, [fetchArticles]);

  const logout = useCallback(async () => {
    // ... logout logic remains the same ...
    try {
      await fetch("/api/auth", { method: "DELETE", credentials: "include" });
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setLoggedIn(false);
      setUsername(null);
      setArticles([]); // Clear articles on logout
    }
  }, []);

  // --- Effects ---
  // Effect: Check auth status only once at startup (strict mode tolerant)
  useEffect(() => {
    if (hasCheckedAuth) return;
    hasCheckedAuth = true;
    checkAuthStatus();
  }, []);

  // Removed previous effect that depended on location

  return (
    <UserContext.Provider 
      value={{ 
        loggedIn, 
        setLoggedIn,
        authLoading, 
        checkAuthStatus,
        articles, 
        fetchArticles: () => fetchArticles(username), // Provide a version without args for external use if needed
        articlesLoading,
        username,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// For backward compatibility or more focused use
export const useAuth = () => {
  const { loggedIn, setLoggedIn, authLoading, checkAuthStatus, username, logout } = useUser();
  return { loggedIn, setLoggedIn, loading: authLoading, checkAuthStatus, username, logout };
};

export const useArticles = () => {
  const { articles, fetchArticles, articlesLoading } = useUser();
  // Note: fetchArticles from useUser now requires no args if called externally
  return { articles, fetchArticles, isLoading: articlesLoading };
};