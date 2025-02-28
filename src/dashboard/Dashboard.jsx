import { useState } from 'react';
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import Article from './Article';
import Modal from 'react-bootstrap/Modal';

function Dashboard() {
    const username = localStorage.getItem('username')
    const navigate = useNavigate();

    // Sample articles data (in a real app, this would come from an API or state)
    const [articles] = useState([
        {
            id: 1,
            title: "My First Journal Entry",
            summary: "A brief reflection on my day...",
            content: "Today was quite eventful. I started by reviewing my goals for the week and then attended several meetings. The project is coming along nicely, though there are still some challenges to overcome. I'm looking forward to making more progress tomorrow.",
            date: "Feb 24, 2023"
        },
        {
            id: 2,
            title: "Thoughts on New Technology",
            summary: "Exploring the latest tech trends...",
            content: "I've been researching some emerging technologies lately. The advancements in AI and machine learning are particularly interesting. I'm considering how these might be applied to our current projects. There's so much potential for innovation in this space.",
            date: "Feb 22, 2023"
        },
        {
            id: 3,
            title: "Weekend Plans",
            summary: "Ideas for the upcoming weekend...",
            content: "I'm planning to take some time off this weekend to recharge. Thinking about a hiking trip if the weather permits. Otherwise, I'll catch up on some reading and perhaps work on that side project I've been putting off. Balance is important for creativity and productivity.",
            date: "Feb 20, 2023"
        },
        {
            id: 4,
            title: "Project Retrospective",
            summary: "Looking back on recent work...", 
            content: "We completed the milestone for the project last week. It's a good time to reflect on what went well.", // Less than 100 characters
            date: "Feb 18, 2023"
        }
    ]);

    

    function logout() {
        localStorage.removeItem('username');
        localStorage.removeItem('password');
        navigate('/');
    }

    return (
        <Container className="text-dark p-5" >
            <Modal>
                <Modal.Header>
                    <Modal.Title>New Entry</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Coming soon!</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary">
                        Close
                    </Button>
                    <Button variant="primary">
                        Save Entry
                    </Button>
                </Modal.Footer>
            </Modal>
            <Row>
                <Col>
                    <Card className="p-4">
                        <h1>Welcome, {username}!</h1>
                        <hr/>
                        <p>Here is your ShowBrain page!</p>
                        <div className="d-flex justify-content-end">
                            <Button 
                                variant="outline-primary" 
                                size="sm"
                                
                            >
                                + New Entry
                            </Button>
                        </div>
                    </Card>
                </Col>
            </Row>
            
            <Row>
                <Col md={3}>
                    <Card className="mb-4 p-3">
                        <h2>My Account</h2>
                        <p>Username: {username}</p>
                        <Button variant="primary" onClick={logout}>
                            Log out
                        </Button>
                    </Card>
                </Col>
                <Col md={9}>
                    <Row xs={1} md={2} className="g-4">
                        {articles.map(article => (
                            <Col key={article.id}>
                                <Article article={article} />
                            </Col>
                        ))}
                    </Row>
                </Col>
                <Col className="mt-3">
                    <Card className="m-3 p-3">
                        <h2>My Favorites</h2>
                        <p>Coming soon!</p>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Dashboard