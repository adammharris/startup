import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import PlainQuillEditor from './PlainQuillEditor';

export default function ArticleEditor({ article = {}, onSave, onCancel }) {
  const [title, setTitle] = useState(article.title || '');
  const [content, setContent] = useState(article.content || '');
  
  // Add these module and format configurations
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link', 'image'],
      ['clean']
    ],
  };
  
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet',
    'link', 'image'
  ];
  
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
    onSave(newArticle);
  };
  
  return (
    <Card className="editor-card">
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
            <PlainQuillEditor
              value={content}
              onChange={setContent}
              modules={modules}
              formats={formats}
              placeholder="Write your article..."
              style={{ height: '300px', marginBottom: '50px' }}
            />
          </Form.Group>
          
          <div className="d-flex justify-content-end gap-2 mt-4">
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Article
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}