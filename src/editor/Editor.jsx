import { useState } from "react";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import { useArticles } from "../contexts/ArticlesContext";
import PlainQuillEditor from "./PlainQuillEditor";

export default function Editor({ article = {}, onSave, onCancel }) {
  const [title, setTitle] = useState(article.title || "");
  const [content, setContent] = useState(article.content || "");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState(article.tags || []);
  const [tagError, setTagError] = useState("");
  const [isSaving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { fetchArticles } = useArticles();

  // Constants
  const MAX_TAG_LENGTH = 30;

  const saveArticle = async (articleData) => {
    setSaving(true);
    try {
      const response = await fetch("/api/articles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(articleData),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to save article: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Article saved:", data);

      //await fetchArticles();
      
      // Use the onSave callback if provided, otherwise navigate
      if (onSave) {
        onSave(data);
      } else {
        navigate("/dashboard");
      }
      
      return data;
    } catch (error) {
      console.error("Error saving article:", error);
      alert("Failed to save article. Please try again.");
      throw error;
    } finally {
      setSaving(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newArticle = {
      ...article,
      title,
      content,
      tags,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    };
    
    try {
      await saveArticle(newArticle);
    } catch (error) {
      // Error already handled in saveArticle
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate("/dashboard");
    }
  };

  const handleTagInputChange = (e) => {
    const input = e.target.value;
    setTagInput(input);

    // Clear error when input changes
    if (tagError) setTagError("");

    // Show error if over character limit
    if (input.length > MAX_TAG_LENGTH) {
      setTagError(`Tag must be ${MAX_TAG_LENGTH} characters or less`);
    }
  };

  const handleAddTag = (e) => {
    e.preventDefault();

    if (!tagInput.trim()) return;

    if (tagInput.length > MAX_TAG_LENGTH) {
      setTagError(`Tag must be ${MAX_TAG_LENGTH} characters or less`);
      return;
    }

    if (tags.includes(tagInput.trim())) {
      setTagError("This tag already exists");
      return;
    }

    // Add tag
    setTags([...tags, tagInput.trim()]);
    setTagInput("");
    setTagError("");
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // Handle Enter key in tag input
  const handleTagKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag(e);
    }
  };

  return (
    <Container className="p-5">
      <Card>
        <Card.Header>
          <h2>{article.id ? "Edit Article" : "Create New Article"}</h2>
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
              <div
                className="editor-container"
                style={{ marginBottom: "70px" }}
              >
                <PlainQuillEditor value={content} onChange={setContent} />
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tags</Form.Label>
              <div className="d-flex">
                <Form.Control
                  type="text"
                  value={tagInput}
                  onChange={handleTagInputChange}
                  onKeyUp={handleTagKeyPress}
                  placeholder="Add tags..."
                  className="me-2"
                  isInvalid={!!tagError}
                />
                <Button
                  variant="outline-primary"
                  onClick={handleAddTag}
                  type="button"
                  disabled={!!tagError || !tagInput.trim()}
                >
                  Add Tag
                </Button>
              </div>

              {tagError && (
                <Form.Text className="text-danger">{tagError}</Form.Text>
              )}

              <div className="mt-2">
                {tags.map((tag, index) => (
                  <Badge
                    bg="primary"
                    key={index}
                    className="me-1 mb-1 p-2"
                    style={{
                      cursor: "pointer",
                      maxWidth: "100%",
                      overflow: "hidden",
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                    }}
                    onClick={() => handleRemoveTag(tag)}
                  >
                    {tag} &times;
                  </Badge>
                ))}
                {tags.length === 0 && (
                  <small className="text-muted">No tags added yet</small>
                )}
              </div>
              <small className="text-muted">Click on a tag to remove it</small>
            </Form.Group>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button
                variant="secondary"
                onClick={handleCancel}
                type="button"
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={isSaving}>
                Save Article
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
