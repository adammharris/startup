import { useState, useRef } from "react";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import { useArticles } from "../contexts/UserContext.tsx";
import PlainQuillEditor from "../components/PlainQuillEditor";
import { markdownToHtml, htmlToMarkdown } from "../utils/markdownConverter";
import { sanitizeHTML } from "../utils/htmlSanitizer";

export default function Editor({ article = {}, onSave, onCancel }) {
  const [title, setTitle] = useState(article.title || "");
  const [content, setContent] = useState(article.content || "");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState(article.tags || []);
  const [tagError, setTagError] = useState("");
  const [isSaving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { fetchArticles } = useArticles();
  const fileInputRef = useRef(null);

  // Constants
  const MAX_TAG_LENGTH = 30;

  const saveArticle = async (articleData) => {
    setSaving(true);
    try {
      // Determine if this is a new article or an update
      const isUpdate = !!article.id;
      
      const url = isUpdate 
        ? `/api/articles/${encodeURIComponent(article.title)}` // Update existing
        : "/api/articles"; // Create new
        
      const method = isUpdate ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method: method,
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

      await fetchArticles();
      
      // Use the onSave callback if provided, otherwise navigate
      onSave(data);
      
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
    const sanitizedContent = sanitizeHTML(content);

    // If updating an existing article, compute only the fields that changed.
    let updateData = {};
    if (article.id) {
      if (article.title !== title) updateData.title = title;
      if (article.content !== content) updateData.content = content;
      if (JSON.stringify(article.tags) !== JSON.stringify(tags)) {
        updateData.tags = tags;
      }
      // Always update the date if any changes have been made.
      if (Object.keys(updateData).length > 0) {
        updateData.date = new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      }
    } else {
      // Creating new articles requires sending all necessary fields.
      updateData = {
        title,
        sanitizedContent,
        tags,
        date: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
      };
    }

    try {
      // If no changes were detected, you can either alert the user or skip calling the backend.
      if (article.id && Object.keys(updateData).length === 0) {
        alert("No changes to update");
        return;
      }

      setSaving(true);
      // Choose PATCH for updates (if your backend supports it) or still use PUT.
      const isUpdate = !!article.id;
      const url = isUpdate 
        ? `/api/articles/${encodeURIComponent(article.id)}` 
        : "/api/articles"; // Create a new article

      const method = isUpdate ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to save article: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("Article saved:", data);
      await fetchArticles(); // Refresh local articles
      onSave(data);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving article:", error);
      alert("Failed to save article. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    onCancel();
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

  // File upload functionality
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check if the file is a Markdown file
    if (file.type !== "text/markdown" && !file.name.endsWith('.md')) {
      alert("Please upload a Markdown file (.md)");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const fileContent = event.target.result;
      
      // Extract the filename without extension as the potential title
      let fileName = file.name.replace(/\.[^/.]+$/, "");
      
      // If there's no existing title, use the file name
      if (!title) {
        setTitle(fileName);
      }
      
      // Convert Markdown to HTML and set as content
      const htmlContent = markdownToHtml(fileContent);
      setContent(htmlContent);
    };
    
    reader.readAsText(file);
    
    // Reset the file input so the same file can be selected again
    e.target.value = null;
  };

  // File download functionality
  const downloadAsMarkdown = () => {
    const markdownContent = htmlToMarkdown(content);
    const fileName = `${title || 'article'}.md`;
    
    // Create a blob with the content
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary anchor element to trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Container className="p-5">
      <Card>
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h2>{article.id ? "Edit Article" : "Create New Article"}</h2>
            <div className="d-flex gap-2">
              <Button 
                variant="outline-primary" 
                onClick={() => fileInputRef.current.click()}
              >
                Import Markdown
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".md,text/markdown"
                style={{ display: 'none' }}
              />
              
              <Button 
                variant="outline-primary" 
                onClick={downloadAsMarkdown}
              >
                Export Markdown
              </Button>
            </div>
          </div>
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
