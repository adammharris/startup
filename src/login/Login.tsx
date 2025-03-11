import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";

export const Login: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  async function submitContent(e: FormEvent, isLogin: boolean): Promise<void> {
    console.log("submitContent! isLogin: ", isLogin);
    e.preventDefault();
    const response = await fetch("/api/auth", {
      method: isLogin ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password: password }),
    });
    
    if (response.ok) {
      navigate("/dashboard");
    } else {
      const data = await response.json();
      alert(data.msg);
    }
  }

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center">
      <Card className="m-5">
        <Form className="p-4">
          <h1>Login</h1>
          <hr />
          <Form.Group className="mb-3" controlID="formBasicEmail">
            <Form.Label>Username</Form.Label>
            <Form.Control
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlID="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" onClick={(e) => submitContent(e, true)}>
            Login
          </Button>
          <Button variant="primary" onClick={(e) => submitContent(e, false)}>
            Register
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default Login;
