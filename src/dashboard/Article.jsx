import { useState } from 'react';
import Card from 'react-bootstrap/Card'
import { Button } from 'react-bootstrap';
import Comments from './Comments';
import Stack from 'react-bootstrap/Stack';
import Modal from 'react-bootstrap/Modal';

export default function Article({article}) {
    const getPreviewText = (content) => {
        if (content.length <= 100) return content;
        return content.substring(0, 100) + '...';
    };

    const [expanded, setExpanded] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const toggleExpanded = () => {
        setExpanded(!expanded);
    }

    return (
        <Card className="h-100">
            <Card.Header>{article.title}</Card.Header>
            <Card.Body>
                <Card.Text>
                    {(expanded || article.content.length <= 100)
                        ? article.content 
                        : getPreviewText(article.content
                    )}
                </Card.Text>

                
            </Card.Body>
            <Card.Footer className="text-muted">
                <Stack direction="horizontal">
                    {article.content.length > 100 && (
                        <Button 
                            variant="outline-secondary"
                            className="p-1" 
                            onClick={toggleExpanded}
                        >
                            {expanded ? 'Show less' : 'Read more'}
                        </Button>
                    )}
                    <Button 
                        variant="outline-secondary"
                        className="p-1 ms-auto" 
                        onClick={() => setShowModal(true)}
                    >
                        Read full article
                    </Button>
                </Stack>
            </Card.Footer>

            {showModal && (
                <Modal
                    show={() => setShowModal(true)}
                    onHide={() => setShowModal(false)}
                    size="lg"
                    centered
                >
                    <Modal.Header>
                        <Modal.Title>
                            {article.title}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>{article.content}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Stack direction="horizontal" className="w-100" gap={3}>
                            <Comments accordionKey={`comments-${article.id}`}/>
                            <Button onClick={() => setShowModal(false)} className="ms-auto">
                                Close
                            </Button>
                        </Stack>

                    </Modal.Footer>
                </Modal>
            )}
        </Card>
    )
}