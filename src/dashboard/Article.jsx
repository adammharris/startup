import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
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
            <Card.Header className="d-flex justify-content-between align-items-center text-break">
                <div>{article.title}</div>
                <small className="text-muted text-break">{article.date}</small>
            </Card.Header>
            <Card.Body>
                {expanded || article.content.length <= 100 ? (
                    <div 
                        dangerouslySetInnerHTML={{ __html: sanitizeHTML(article.content) }} 
                        className='text-break'
                    />
                ) : (
                    <Card.Text className='text-break'>
                        {getPreviewText(article.content)}
                    </Card.Text>
                )}
                
                {article.tags && article.tags.length > 0 && (
                    <div className="mt-3">
                        {article.tags.map((tag, index) => (
                            <Badge 
                                bg="secondary" 
                                key={index} 
                                className="me-1 text-break"
                                style={{ 
                                    maxWidth: '100%',
                                    overflow: 'hidden',
                                    whiteSpace: 'normal',
                                    wordBreak: 'break-word'
                                }}
                            >
                                {tag}
                            </Badge>
                        ))}
                    </div>
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
                        <Modal.Title className='text-break'>
                            {article.title}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className='text-break'>
                        <div dangerouslySetInnerHTML={{ __html: sanitizeHTML(article.content) }} />
                        
                        {article.tags && article.tags.length > 0 && (
                            <div className="mt-3">
                                {article.tags.map((tag, index) => (
                                    <Badge 
                                        bg="secondary" 
                                        key={index} 
                                        className="me-1"
                                        style={{ 
                                            maxWidth: '100%',
                                            overflow: 'hidden',
                                            whiteSpace: 'normal',
                                            wordBreak: 'break-word'
                                        }}
                                    >
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        )}
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