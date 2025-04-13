import { useState, FormEvent, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import { Stack, Alert, Row, Col } from "react-bootstrap";
import { useAuth } from "../contexts/UserContext";

export const Login: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();
  const { setLoggedIn, loggedIn} = useAuth();
  
  // Get redirectUrl from state or use dashboard as default
  const from = location.state?.from?.pathname || "/dashboard";

  if (loggedIn) {
    // If already logged in, redirect to the dashboard
    navigate(from, { replace: true });
  }

  // Validate password whenever it changes and we're in register mode
  useEffect(() => {
    if (isRegistering) {
      validatePassword(password);
    } else {
      setPasswordError("");
    }
  }, [password, isRegistering]);

  const validatePassword = (password: string): boolean => {
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return false;
    }
    
    // Check for complexity requirements
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    
    if (!(hasUppercase && hasLowercase && hasNumber)) {
      setPasswordError("Password must contain uppercase, lowercase, and numbers");
      return false;
    }
    
    // Check if password contains username
    if (username && password.toLowerCase().includes(username.toLowerCase())) {
      setPasswordError("Password should not contain your username");
      return false;
    }
    
    setPasswordError("");
    return true;
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    // Clear form when toggling between modes
    setUsername("");
    setPassword("");
    setPasswordError("");
  };

  async function handleSubmit(e: FormEvent): Promise<void> {
    e.preventDefault();
    
    // If registering, validate password first
    if (isRegistering && !validatePassword(password)) {
      return;
    }
    
    try {
      const response = await fetch("/api/auth", {
        method: isRegistering ? "POST" : "PUT", // POST for register, PUT for login
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username, password: password }),
      });
      
      if (response.ok) {
        // Update the login state in context
        setLoggedIn(true);
        
        // Navigate to the dashboard or the original destination
        console.log("Authentication successful, redirecting to:", from);
        navigate(from, { replace: true });
      } else {
        const data = await response.json();
        alert(data.msg);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      alert("An error occurred. Please try again.");
    }
  }

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center">
      <Card className="m-5 shadow" style={{ maxWidth: "500px", width: "100%" }}>
        <Card.Header className="text-center bg-primary text-white">
          <h2>{isRegistering ? "Create Account" : "Welcome Back"}</h2>
        </Card.Header>
        <Card.Body className="p-4">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Username</Form.Label>
              <Form.Control
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder={isRegistering ? "Create password" : "Enter password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                isInvalid={!!passwordError}
              />
              {passwordError && (
                <Form.Control.Feedback type="invalid">
                  {passwordError}
                </Form.Control.Feedback>
              )}
              {isRegistering && !passwordError && password.length > 0 && (
                <Form.Text className="text-success">
                  Password meets requirements ✓
                </Form.Text>
              )}
            </Form.Group>

            {isRegistering && (
              <Alert variant="info" className="mb-3">
                <small>
                  <strong>Password Requirements:</strong>
                  <ul className="mb-0 ps-3">
                    <li>At least 8 characters</li>
                    <li>At least one uppercase letter</li>
                    <li>At least one lowercase letter</li>
                    <li>At least one number</li>
                  </ul>
                </small>
              </Alert>
            )}

            <div className="d-grid gap-2 mb-3">
              <Button 
                variant="primary" 
                type="submit"
                disabled={isRegistering && (!!passwordError || !password)}
              >
                {isRegistering ? "Create Account" : "Log In"}
              </Button>
            </div>
            
            <Row className="text-center">
              <Col>
                <p className="mb-0">
                  {isRegistering ? "Already have an account?" : "Need an account?"}
                  {" "}
                  <Button 
                    variant="link" 
                    className="p-0" 
                    onClick={toggleMode}
                  >
                    {isRegistering ? "Log In" : "Sign Up"}
                  </Button>
                </p>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Login;
