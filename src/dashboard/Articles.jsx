import { Row, Col } from 'react-bootstrap';
import Article from './Article';

export default function Articles({articles}) {
    return (
        <Row className="">
            {!articles || articles.length > 0 ? (
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
        </Row>
    )
}