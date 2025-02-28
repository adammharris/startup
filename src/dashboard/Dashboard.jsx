import { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import Article from './Article';

function Dashboard() {
    const username = localStorage.getItem('username') || "Guest";
    const navigate = useNavigate();

    const [articles, setArticles] = useState(() => {
        try {
            // Get articles (later, get from backend)
            const savedArticles = localStorage.getItem('articles');
            return savedArticles ? JSON.parse(savedArticles) : [];
        } catch (error) {
            console.error("Error parsing articles from localStorage:", error);
            return [];
        }
    });

    // Update localStorage whenever articles state changes
    // Later, use Websockets or something
    useEffect(() => {
        try {
            localStorage.setItem('articles', JSON.stringify(articles));
        } catch (error) {
            console.error("Error saving articles to localStorage:", error);
        }
    }, [articles]);

    function logout() {
        localStorage.removeItem('username');
        localStorage.removeItem('password');
        navigate('/');
    }

    return (
        <Container className="text-dark p-5">
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
                                onClick={() => navigate('/editor')}
                            >
                                + New Entry
                            </Button>
                        </div>
                    </Card>
                </Col>
            </Row>
            
            <Row className="mt-4">
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
                    {articles && articles.length > 0 ? (
                        <Row xs={1} md={2} className="g-4">
                            {articles.map(article => (
                                <Col key={article.id}>
                                    <Article article={article} />
                                </Col>
                            ))}
                        </Row>
                    ) : ( // If there are no articles
                        <Card className="mb-4 p-3 text-center">
                            <p>No articles yet. Click "New Entry" to create your first article!</p>
                        </Card>
                    )}
                </Col>
            </Row>
            
            <Row>
                <Col>
                    <Card className="m-3 p-3">
                        <h2>My Favorites</h2>
                        <p>Coming soon!</p>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Dashboard;