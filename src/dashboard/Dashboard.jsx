//import React from 'react';
//import { Accordion, AccordionBody, AccordionHeader, AccordionItem } from 'react-bootstrap';
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import Comments from './Comments';

function Dashboard() {
    const username = localStorage.getItem('username')
    const navigate = useNavigate();
    function logout() {
        localStorage.removeItem('username');
        localStorage.removeItem('password');
        //window.location.reload();
        navigate('/');
    }

    return (
        <Container className="text-dark p-5" >
            <Row>
            <Card className="p-4">
                <h1>Welcome, {username}!</h1>
                <hr/>
                <p>Here is your ShowBrain page!</p>
            </Card>
            </Row>
            
            <Row>
                <Col>
                    <Card className="m-3 p-3">
                        <h2>My Account</h2>
                        <p>Username: {username}</p>
                        <Button variant="primary" onClick={logout}>
                            Log out
                        </Button>
                    </Card>
                </Col>
                <Col>
                    <Card className="m-3 p-3">
                        <h2>Example post</h2>
                        <p>In ShowBrain, you can make your own posts, and they show up on this screen!</p>
                        <Comments />
                    </Card>
                </Col>
                <Col>
                    <Card className="m-3 p-3">
                        <h2>My Favorites</h2>
                        <p>Coming soon!</p>
                        <Comments />
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Dashboard