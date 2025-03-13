import { useEffect, useState } from "react";
import { Stack } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import { useNavigate } from "react-router-dom";
import { useArticles } from "../contexts/ArticlesContext";
import Articles from "./Articles";

const Dashboard: React.FC = () => {
  const [username, setUsername] = useState<string>("[loading]");
  const { articles, isLoading } = useArticles();

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
      {isLoading ? (
        <p>Loading articles...</p>
      ) : (
        <Articles articles={articles} />
      )}
    </Container>
  );
};

export default Dashboard;
