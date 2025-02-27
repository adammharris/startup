import { useState } from 'react';
import Card from 'react-bootstrap/Card'
import { Button } from 'react-bootstrap';
import Comments from './Comments';
import Stack from 'react-bootstrap/Stack';

export default function Article({article}) {
    const getPreviewText = (content) => {
        if (content.length <= 100) return content;
        return content.substring(0, 100) + '...';
    };

    const [expanded, setExpanded] = useState(false);

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
                    <br/> <br/>
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
                        {expanded && (
                            <Button 
                                variant="outline-secondary"
                                className="p-1 ms-auto" 
                            >
                                Read full article
                            </Button>
                        )}
                    </Stack>
                </Card.Text>

                
            </Card.Body>
            <Comments accordionKey={`comments-${article.id}`}/>
            <Card.Footer className="text-muted">{article.date}</Card.Footer>
        </Card>
    )
}