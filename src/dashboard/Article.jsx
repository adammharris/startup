import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Comments from './Comments';
import Stack from 'react-bootstrap/Stack';
import Modal from 'react-bootstrap/Modal';
import DOMPurify from 'dompurify';

export default function Article({article}) {
    const getPreviewText = (content) => {
        // Create a temporary element to render the HTML content
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = content;
        
        // Get plain text from HTML
        const plainText = tempDiv.textContent || tempDiv.innerText || "";
        
        if (plainText.length <= 100) return plainText;
        return plainText.substring(0, 100) + '...';
    };

    const sanitizeHTML = (html) => {
        return DOMPurify.sanitize(html, {
            ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'a'],
            ALLOWED_ATTR: ['href', 'target']
        });
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
                {expanded || article.content.length <= 100 ? (
                    <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(article.content) }} />
                ) : (
                    <Card.Text>
                        {getPreviewText(article.content)}
                    </Card.Text>
                )}
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
                    show={showModal}
                    onHide={() => setShowModal(false)}
                    size="lg"
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title>
                            {article.title}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(article.content) }} />
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