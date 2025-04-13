import { useState, FormEvent, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import { Stack, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/UserContext";

export const Login: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();
  const { setLoggedIn } = useAuth();
  
  // Get redirectUrl from state or use dashboard as default
  const from = location.state?.from?.pathname || "/dashboard";

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
    const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
    
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

  async function submitContent(e: FormEvent, isLogin: boolean): Promise<void> {
    e.preventDefault();
    
    // Set registration mode for UI state
    setIsRegistering(!isLogin);
    
    // If registering, validate password first
    if (!isLogin && !validatePassword(password)) {
      return;
    }
    
    try {
      const response = await fetch("/api/auth", {
        method: isLogin ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username, password: password }),
      });
      
      if (response.ok) {
        // Update the login state in context
        setLoggedIn(true);
        
        // Navigate to the dashboard or the original destination
        console.log("Login successful, redirecting to:", from);
        navigate(from, { replace: true });
      } else {
        const data = await response.json();
        alert(data.msg);
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred. Please try again.");
    }
  }

  return (
    <Container className="d-flex flex-column align-items-center justify-content-center">
      <Card className="m-5">
        <Form className="p-4">
          <h1>{isRegistering ? "Register" : "Login"}</h1>
          <hr />
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Username</Form.Label>
            <Form.Control
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Choose a good password!"
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
                Password meets requirements
              </Form.Text>
            )}
          </Form.Group>

          {isRegistering && (
            <Alert variant="info">
              <small>
                Password must be at least 8 characters and include uppercase, lowercase, 
                and numbers.
              </small>
            </Alert>
          )}

          <Stack direction="horizontal" gap={2} className="mb-3">
            <Button 
              variant="primary" 
              onClick={(e) => submitContent(e, true)}
              disabled={isRegistering}
            >
              Login
            </Button>
            <Button 
              variant="primary" 
              onClick={(e) => submitContent(e, false)}
              disabled={isRegistering && (!!passwordError || !password)}
            >
              Register
            </Button>
          </Stack>
        </Form>
      </Card>
    </Container>
  );
}

export default Login;
