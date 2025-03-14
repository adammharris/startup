import { Stack } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import { useNavigate } from "react-router-dom";
import Articles from "../components/Articles";
import WeatherWidget from "../components/WeatherWidget";
import { useAuth } from "../contexts/UserContext";
import Spinner from "react-bootstrap/Spinner";
import { useEffect } from "react";

const Dashboard: React.FC = () => {
  const { loading, username, checkAuthStatus } = useAuth();
  const navigate = useNavigate();
  
  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p>Loading your dashboard...</p>
      </Container>
    );
  }

  useEffect(() => {
    console.log("Dashboard component loaded with username:", username);
  }, [loading, username, checkAuthStatus]);

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
      
      <Stack direction="horizontal" gap={3} className="my-3">
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
        <WeatherWidget />
      </Stack>
      
      <Articles />
    </Container>
  );
};

export default Dashboard;
