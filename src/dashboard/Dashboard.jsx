import { useEffect, useState } from "react";
import { Stack } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import { useNavigate } from "react-router-dom";
import Articles from "./Articles";

function Dashboard() {
  const username = localStorage.getItem("username") || "Guest";
  const navigate = useNavigate();

  const [articles, setArticles] = useState(() => {
    try {
      // Get articles (later, get from backend)
      const savedArticles = localStorage.getItem("articles");
      return savedArticles ? JSON.parse(savedArticles) : [];
    } catch (error) {
      console.error("Error parsing articles from localStorage:", error);
      return [];
    }
  });

  // Update localStorage whenever articles state changes
  // Later, use Websockets or something
  useEffect(() => {
    try {
      localStorage.setItem("articles", JSON.stringify(articles));
    } catch (error) {
      console.error("Error saving articles to localStorage:", error);
    }
  }, [articles]);

  function logout() {
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    navigate("/");
  }

  return (
    <Container className="text-dark p-5">
      <Card className="p-4">
        <h1>Welcome, {username}!</h1>
        <hr />
        <p>Here is your ShowBrain page!</p>
        <div className="d-flex justify-content-end">
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => navigate("/editor")}
          >
            + New Entry
          </Button>
        </div>
      </Card>

      <Stack direction="horizontal" gap={3}>
        <Card className="p-3">
          <h2>My Account</h2>
          <p>Username: {username}</p>
          <Button variant="primary" onClick={logout}>
            Log out
          </Button>
        </Card>
        <Card className="m-3 p-3">
          <h2>My Favorites</h2>
          <p>Coming soon!</p>
        </Card>
      </Stack>

      <Articles articles={articles} />
    </Container>
  );
}

export default Dashboard;
