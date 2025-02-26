import {useState} from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import bcrypt from 'bcryptjs';


export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function submitContent(e) {
        e.preventDefault();
        localStorage.setItem('email', email);
        console.log('Email: ', email);

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        localStorage.setItem('password', hash);
        console.log('Password: ', hash);
    }

    return (
        <Container className="d-flex flex-column align-items-center justify-content-center">
            <Card className="m-5">
            <Form className='p-4'>
                <h1>Login</h1>
                <hr/>
                <Form.Group className="mb-3" controlID="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control 
                        type="email"
                        placeholder="your@email.com" 
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlID="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                        type="password"
                        placeholder="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>
                <Button variant="primary" onClick={submitContent}>
                    Submit
                </Button>
            </Form>
            </Card>
        </Container>
  );
}
export default Login