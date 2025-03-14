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
  authLoading: boolean;
  checkAuthStatus: () => Promise<void>;
  username: string | null;
  
  // Articles-related state
  articles: Article[];
  fetchArticles: () => Promise<void>;
  articlesLoading: boolean;
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
      
      setLoggedIn(response.ok);
      setUsername(response.ok ? (await response.json()).username : null);
    } catch (error) {
      console.error('Error checking authentication status:', error);
      setLoggedIn(false);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  // Articles methods
  const fetchArticles = useCallback(async () => {
    setArticlesLoading(true);
    try {
      const response = await fetch("/api/articles", {
        method: "GET",
      });
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
  }, []);

  // Check auth status when location changes
  useEffect(() => {
    checkAuthStatus();
  }, [location, checkAuthStatus]);

  // Initial fetch of articles on component mount
  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  return (
    <UserContext.Provider 
      value={{ 
        // Auth
        loggedIn, 
        authLoading, 
        checkAuthStatus,
        // Articles
        articles, 
        fetchArticles, 
        articlesLoading: articlesLoading,
        username
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
  const { loggedIn, authLoading, checkAuthStatus, username} = useUser();
  return { loggedIn, loading: authLoading, checkAuthStatus, username};
};

export const useArticles = () => {
  const { articles, fetchArticles, articlesLoading } = useUser();
  return { articles, fetchArticles, isLoading: articlesLoading };
};