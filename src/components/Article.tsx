import { useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";
import Comments from "./Comments";
import Stack from "react-bootstrap/Stack";
import Modal from "react-bootstrap/Modal";
import { sanitizeHTML } from '../utils/htmlSanitizer';
import { useNavigate } from "react-router-dom";

interface ArticleType {
  id: string;
  title: string;
  content: string;
  date: string;
  tags?: string[];
}

interface ArticleProps {
  article: ArticleType;
  onDelete?: (id: string) => void;
}

const Article: React.FC<ArticleProps> = ({ article, onDelete }) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);

  const getPreviewText = (content: string): string => {
    if (!content) {
      return '';
    }
    
    try {
      // Create a temporary element to render the HTML content
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = content;
      // Get plain text from HTML
      const plainText = tempDiv.textContent || tempDiv.innerText || "";
      if (plainText.length <= 100) return plainText;
      return plainText.substring(0, 100) + "...";
    } catch (error) {
      console.error("Error getting preview text:", error);
      return '';
    }
  };

  const toggleExpanded = (): void => {
    setExpanded(!expanded);
  };

  const handleDelete = (): void => {
    try {
      // Close modals
      setShowDeleteConfirm(false);
      setShowModal(false);
      // Notify parent component to update the articles list
      if (onDelete) {
        onDelete(article.id);
      } else {
        // If no onDelete prop is provided, refresh the page
        window.location.reload();
      }
    } catch (error) {
      console.error("Error deleting article:", error);
      alert("Failed to delete article. Please try again.");
    }
  };

  return (
    <Card className="h-100">
      <Card.Header className="d-flex justify-content-between align-items-center text-break">
        <div>{article.title}</div>
        <small className="text-muted text-break">{article.date}</small>
      </Card.Header>
      <Card.Body>
        {expanded || (article.content ? article.content.length : 0) <= 100 ? (
          article.content ? (
            <div
              dangerouslySetInnerHTML={{ __html: sanitizeHTML(article.content) }}
              className="text-break"
            />
          ) : (
            <Card.Text className="text-break">No content available</Card.Text>
          )
        ) : (
          <Card.Text className="text-break">
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
                  maxWidth: "100%",
                  overflow: "hidden",
                  whiteSpace: "normal",
                  wordBreak: "break-word",
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
          {article.content && article.content.length > 100 && (
            <Button
              variant="outline-secondary"
              className="p-1"
              onClick={toggleExpanded}
            >
              {expanded ? "Show less" : "Read more"}
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

      {/* Full Article Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
        fullscreen={true}
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-break">{article.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-break">
          {article.content ? (
            <div
              dangerouslySetInnerHTML={{ __html: sanitizeHTML(article.content) }}
            />
          ) : (
            <div>No content available</div>
          )}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-3">
              {article.tags.map((tag, index) => (
                <Badge
                  bg="secondary"
                  key={index}
                  className="me-1"
                  style={{
                    maxWidth: "100%",
                    overflow: "hidden",
                    whiteSpace: "normal",
                    wordBreak: "break-word",
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
            <Comments 
              accordionKey={`comments-${article.id}`}
              articleId={article.id}
              isVisible = {showModal}
            />
            <Button
              variant="outline-danger"
              onClick={() => setShowDeleteConfirm(true)}
              className="me-2"
            >
              Delete Article
            </Button>
            <Button
              variant="outline-primary"
              onClick={() => {
                setShowModal(false);
                navigate(`/editor/${article.id}`);
              }}
              className="me-2"
            >
              Edit
            </Button>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Stack>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteConfirm}
        onHide={() => setShowDeleteConfirm(false)}
        centered
        size="sm"
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this article? This action cannot be
          undone.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteConfirm(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default Article;
