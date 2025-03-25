import { useEffect, useState } from "react";
import Article from "./Article.tsx";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { useNavigate, useLocation } from "react-router-dom";
import { useArticles } from "../contexts/UserContext.tsx";

interface ArticleType {
  id: string;
  title: string;
  content: string;
  date: string;
  // Add other properties as needed
}

interface ArticlesProps {
  articles?: ArticleType[]; // Make optional to allow using context
  refreshOnMount?: boolean; // Add option to force refresh when component mounts
}

const Articles: React.FC<ArticlesProps> = ({ 
  articles: propArticles, 
  refreshOnMount = true 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { articles: contextArticles, fetchArticles, isLoading } = useArticles();
  const [localLoading, setLocalLoading] = useState<boolean>(false);
  
  // Use either props or context articles
  const articles = propArticles || contextArticles || [];
  
  // Fetch articles when component mounts or when location changes
  useEffect(() => {
    const loadArticles = async () => {
      setLocalLoading(true);
      try {
        await fetchArticles();
      } finally {
        setLocalLoading(false);
      }
    };
    
    if (refreshOnMount) {
      loadArticles();
    }
  }, [location, fetchArticles, refreshOnMount]);
  
  const handleDeleteArticle = async (id: string): Promise<void> => {
    try {
      const response = await fetch(`/api/articles/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete article: ${response.status}`);
      }
      
      // Refresh articles from the server
      await fetchArticles();
      
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
