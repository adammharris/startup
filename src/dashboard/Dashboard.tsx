import { useEffect, useState } from "react";
import { Stack } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import { useNavigate } from "react-router-dom";
import Articles from "./Articles";

interface Article {
  id: string;
  title: string;
  content: string;
  date: string;
  // Add other properties as needed
}

const Dashboard: React.FC = () => {
  const [username, setUsername] = useState<string>("[loading]");

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await fetch("/api/user", {
          method: "GET",
        });
        const data = await response.json();
        setUsername(data.username);
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    };

    fetchUsername();
  }, []);
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  
  // Call to service when articles are updated
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch("/api/articles", {
          method: "GET",
        });
        const data = await response.json();
        setArticles(data);
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    }
    fetchArticles();
  }, []);
  
  const logout = async (): Promise<void> => {
    try {
      const response = await fetch("/api/auth", {
        method: "DELETE",
      });
      if (response.ok) {
        navigate("/");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  
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
};

export default Dashboard;
