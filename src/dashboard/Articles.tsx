import { useState } from "react";
import Article from "./Article";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

interface ArticleType {
  id: string;
  title: string;
  content: string;
  date: string;
  // Add other properties as needed
}

interface ArticlesProps {
  articles: ArticleType[];
}

const Articles: React.FC<ArticlesProps> = ({ articles: initialArticles }) => {
  const [articles, setArticles] = useState<ArticleType[]>(initialArticles);
  const navigate = useNavigate();
  
  const handleDeleteArticle = (articleId: string): void => {
    setArticles(articles.filter((article) => article.id !== articleId));
  };
  
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
        <Col key={article.id}>
          <Article article={article} onDelete={handleDeleteArticle} />
        </Col>
      ))}
    </Row>
  );
};

export default Articles;
