import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

interface Article {
  id: string;
  title: string;
  content: string;
  date: string;
  // Add other properties as needed
}

interface ArticlesContextType {
  articles: Article[];
  fetchArticles: () => Promise<void>;
  isLoading: boolean;
}

const ArticlesContext = createContext<ArticlesContextType | undefined>(undefined);

export const ArticlesProvider = ({ children }: { children: ReactNode }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchArticles = useCallback(async () => {
    setIsLoading(true);
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
      setIsLoading(false);
    }
  }, []);

  // Initial fetch on component mount
  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  return (
    <ArticlesContext.Provider value={{ articles, fetchArticles, isLoading }}>
      {children}
    </ArticlesContext.Provider>
  );
};

export const useArticles = () => {
  const context = useContext(ArticlesContext);
  if (context === undefined) {
    throw new Error('useArticles must be used within an ArticlesProvider');
  }
  return context;
};