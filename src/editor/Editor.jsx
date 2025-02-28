import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import PlainQuillEditor from './PlainQuillEditor';

export default function Editor({ article = {}, onSave, onCancel }) {
  const [title, setTitle] = useState(article.title || '');
  const [content, setContent] = useState(article.content || '');
  const navigate = useNavigate();

  const handleSave = (savedArticle) => {
    // For real app: Save to API
    // For now, save to localStorage
    try {
      const savedArticles = JSON.parse(localStorage.getItem('articles') || '[]');
      
      let updatedArticles;
      if (savedArticle.id) {
        // Update existing article
        updatedArticles = savedArticles.map(a => 
          a.id === savedArticle.id ? savedArticle : a
        );
      } else {
        // Create new article
        updatedArticles = [
          { ...savedArticle, id: Date.now() },
          ...savedArticles
        ];
      }
      
      localStorage.setItem('articles', JSON.stringify(updatedArticles));
      navigate('/dashboard');
    } catch (error) {
      console.error("Error saving article:", error);
      alert("Failed to save article. Please try again.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newArticle = {
      ...article,
      title,
      content,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short', 
        day: 'numeric'
      })
    };
    handleSave(newArticle);
  };
  
  return (
    <Container className="p-5">
      <Card>
        <Card.Header>
          <h2>{article.id ? 'Edit Article' : 'Create New Article'}</h2>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Article Title</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title"
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <div className="editor-container" style={{ marginBottom: '70px' }}>
                <PlainQuillEditor
                  value={content}
                  onChange={setContent}
                />
              </div>
            </Form.Group>
            
            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button 
                variant="secondary" 
                onClick={() => navigate('/dashboard')}
                type="button"
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save Article
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}