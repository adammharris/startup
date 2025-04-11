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
  const { loading, username, checkAuthStatus, logout } = useAuth();
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
      
      <Stack className="flex-column flex-md-row my-3" gap={3}>
        <Card className="p-3">
          <h2>My Account</h2>
          <p>Username: {username}</p>
          <Button variant="primary" onClick={logout}>
        Log out
          </Button>
        </Card>
        <WeatherWidget />
      </Stack>
      <Card className="p-3">
        <h2>My Relationships</h2>
        <p>Manage your relationships</p>
        <Button variant="primary" onClick={() => navigate("/relationships")}>
          Manage Relationships
        </Button>
      </Card>
      
      <Articles />
    </Container>
  );
};

export default Dashboard;
