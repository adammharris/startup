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
  setLoggedIn: (value: boolean) => void;
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

export const UserProvider = ({ children }: { children: ReactNode }) => {
  // Auth state
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const location = useLocation();
  const [username, setUsername] = useState<string | null>(null);
  
  // Articles state
  const [articles, setArticles] = useState<Article[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(false);

  // Auth methods
  const checkAuthStatus = useCallback(async () => {
    try {
      setAuthLoading(true);
      const response = await fetch('/api/user', {
        method: 'GET',
        credentials: 'include',
      });
      
      if (response.ok) {
        const userData = await response.json();
        setLoggedIn(true);
        setUsername(userData.username);
      } else {
        // Handle 401 or other errors gracefully
        setLoggedIn(false);
        setUsername(null);
      }
    } catch (error) {
      console.error('Error checking authentication status:', error);
      setLoggedIn(false);
      setUsername(null);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      // Tell the server to clear the auth token
      await fetch("/api/auth", {
        method: "DELETE",
        credentials: "include",
      });
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      // Reset state
      setLoggedIn(false);
      setUsername(null);
      setArticles([]);
    }
  }, []);

  // Articles methods
  const fetchArticles = useCallback(async () => {
    if (articlesLoading) return; // Prevent multiple simultaneous fetches
    
    setArticlesLoading(true);
    
    // Only fetch user's articles if they're logged in
    if (!username) {
      setArticlesLoading(false);
      return;
    }
    
    try {
      const response = await fetch(`/api/articles/${encodeURIComponent(username)}`, {
        method: "GET",
        credentials: "include", // Include credentials for auth
      });
      
      if (response.status === 401) {
        // If unauthorized, clear auth state
        setLoggedIn(false);
        setUsername(null);
        setArticles([]);
        return;
      }
      
      if (!response.ok) {
        throw new Error(`Failed to fetch articles: ${response.status}`);
      }
      
      const data = await response.json();
      setArticles(data);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setArticlesLoading(false);
    }
  }, [username, articlesLoading]);

  // Check auth status when location changes
  useEffect(() => {
    checkAuthStatus();
  }, [location, checkAuthStatus]);

  // Fetch articles when auth state changes
  useEffect(() => {
    if (loggedIn && username) {
      fetchArticles();
    }
  }, [loggedIn, username, fetchArticles]);

  return (
    <UserContext.Provider 
      value={{ 
        // Auth
        loggedIn, 
        setLoggedIn,
        authLoading, 
        checkAuthStatus,
        // Articles
        articles, 
        fetchArticles, 
        articlesLoading: articlesLoading,
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
  return { articles, fetchArticles, isLoading: articlesLoading };
};