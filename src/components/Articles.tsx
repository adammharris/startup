import { useEffect, useState, useRef } from "react";
import Article from "./Article.tsx";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { useNavigate } from "react-router-dom";
import { useArticles, useAuth } from "../contexts/UserContext.tsx";

interface ArticleType {
  id: string;
  title: string;
  content: string;
  date: string;
  // Add other properties as needed
}

interface ArticlesProps {
  /** Pre‑loaded articles (legacy / testing) */
  articles?: ArticleType[];
  /** Force a server hit when the component mounts */
  refreshOnMount?: boolean;
  /** Always show articles for this user, ignoring the logged‑in account */
  fixedUsername?: string;
}

const Articles: React.FC<ArticlesProps> = ({ 
  articles: propArticles, 
  refreshOnMount = true,
  fixedUsername,
}) => {
  const navigate = useNavigate();
  const { username: contextUsername } = useAuth();
  // When we’re pinned to a particular username (e.g. ShowBrain_Team),
  // keep that data in local state instead of the context cache.
  const [fixedArticles, setFixedArticles] = useState<ArticleType[]>([]);
  const { articles: contextArticles, fetchArticles, isLoading } = useArticles();
  const [localLoading, setLocalLoading] = useState<boolean>(false);
  const lastUserRef = useRef<string | undefined>(undefined);
  
  const articles =
    propArticles ??
    (fixedUsername ? fixedArticles : contextArticles) ??
    [];
  
  useEffect(() => {
    if (!refreshOnMount) return;
    if (propArticles) return; // caller supplied its own data

    const userToFetch = fixedUsername ?? contextUsername ?? undefined;
    if (lastUserRef.current === userToFetch) return;
    lastUserRef.current = userToFetch;

    // --------- Fixed‑username mode (e.g. Blog) ----------
    if (fixedUsername) {
      if (fixedArticles.length) return; // already cached locally
      const loadFixed = async () => {
        setLocalLoading(true);
        try {
          const resp = await fetch(
            `/api/articles/${encodeURIComponent(fixedUsername)}`,
            { method: "GET" },
          );
          if (!resp.ok) throw new Error(`Status ${resp.status}`);
          const data: ArticleType[] = await resp.json();
          setFixedArticles(data);
        } catch (err) {
          console.error("Error fetching fixed‑user articles:", err);
        } finally {
          setLocalLoading(false);
        }
      };
      loadFixed();
      return;
    }

    // --------- Normal mode (logged‑in or anonymous) ----------
    if (contextArticles.length) return; // already cached in context

    const loadContext = async () => {
      setLocalLoading(true);
      try {
        await fetchArticles();
      } finally {
        setLocalLoading(false);
      }
    };
    loadContext();
  }, [refreshOnMount, propArticles, fixedUsername, contextUsername]); // track contextUsername to adapt when it changes
  
  const handleDeleteArticle = async (id: string): Promise<void> => {
    try {
      const response = await fetch(
        `/api/articles/${encodeURIComponent(id)}`,
        { method: "DELETE" },
      );
      if (!response.ok) {
        throw new Error(`Failed to delete article: ${response.status}`);
      }

      if (fixedUsername) {
        // Reload just this user’s feed
        const resp = await fetch(
          `/api/articles/${encodeURIComponent(fixedUsername)}`,
        );
        const data: ArticleType[] = await resp.json();
        setFixedArticles(data);
      } else {
        await fetchArticles(); // refresh context cache
      }
    } catch (error) {
      console.error("Error deleting article:", error);
    }
  };
  
  // Show loading indicator
  if (isLoading || localLoading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading articles...</p>
      </div>
    );
  }
  
  // Check if there are no articles to display
  if (!articles || articles.length === 0) {
    return (
      <Card className="mt-4 p-4 text-center">
        <Card.Body>
          <h3>Welcome to ShowBrain!</h3>
          <p className="mt-3">
            You don't have any articles yet. Ready to write your first one?
          </p>
          <Button variant="primary" onClick={() => navigate("/editor")}>
            Create Your First Article
          </Button>
        </Card.Body>
      </Card>
    );
  }
  
  // If there are articles, display them in a grid
  return (
    <Row xs={1} md={2} className="g-4 mt-2">
      {articles.map((article) => (
        <Col key={article.id || article.title}>
          <Article article={article} onDelete={() => handleDeleteArticle(article.id)} />
        </Col>
      ))}
    </Row>
  );
};

export default Articles;
