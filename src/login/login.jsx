import React from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import './login.css'
export function Login() {
  return (
    <div className="container-fluid">
        <Form>
            <h1>Login</h1>
            <Form.Group className="mb-3" controlID="formBasicEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="your@email.com" />
            </Form.Group>
            <Form.Group className="mb-3" controlID="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="password" />
            </Form.Group>
            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>
    </div>
    
  );
}