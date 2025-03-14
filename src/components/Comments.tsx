import { useEffect, useRef, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Comment from "./Comment";

interface CommentType {
  username: string;
  id: number;
  text: string;
}

interface CommentsProps {
  accordionKey?: string;
  articleTitle: string;
  isVisible?: boolean;
}

const Comments: React.FC<CommentsProps> = ({ accordionKey = "0", articleTitle, isVisible = false }) => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const commentsContainerRef = useRef<HTMLDivElement | null>(null);

  const fetchComments = async () => {
    if (!articleTitle) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const encodedTitle = encodeURIComponent(articleTitle);
      const response = await fetch(`/api/comments/${encodedTitle}`);
      
      if (!response.ok) {
        throw new Error(`Error fetching comments: ${response.status}`);
      }
      
      const data = await response.json();
      setComments(data);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
      setError("Failed to load comments");
    } finally {
      setIsLoading(false);
    }

  };

  // Fetch comments when component mounts or article title changes
  useEffect(() => {
    fetchComments();
  }, [articleTitle]);

  // Fetch comments when the component is visible
  useEffect(() => {
    if (isVisible) {
      fetchComments();
    }
  }
  , [isVisible]);

  // This useEffect will run whenever the comments array changes
  useEffect(() => {
    if (commentsContainerRef.current) {
      // Scroll to top when comments change
      commentsContainerRef.current.scrollTop = 0;
    }
  }, [comments]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const username = "unknown"

    // Add new comment to the list with a unique ID
    const newCommentObj: CommentType = {
      username,
      id: Date.now(),
      text: newComment,
    };

    setComments([newCommentObj, ...comments]);

    // Clear the input
    setNewComment("");

    try {
      const encodedTitle = encodeURIComponent(articleTitle);
      const response = await fetch(`/api/comments/${encodedTitle}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCommentObj),
      });
      if (!response.ok) {
        throw new Error(`Error posting comment: ${response.status}`);
      }
      const data = await response.json();
      console.log("Comment posted successfully:", data);
    } catch (err) {
      console.error("Failed to post comment:", err);
      setComments(comments.filter(c => c.id !== newCommentObj.id));
      setError("Failed to post comment");
    }
  };

  return (
    <Accordion defaultActiveKey="" className="w-100">
      <Accordion.Item eventKey={accordionKey}>
        <Accordion.Header>
          <small>
            {comments.length > 0 ? `Comments (${comments.length})` : "Comments"}
          </small>
        </Accordion.Header>
        <Accordion.Body className="p-0">
          <div className="mt-0">
            {/* Scrollable comments area */}
            <div
              ref={commentsContainerRef}
              style={{
                maxHeight: "120px",
                overflowY: "auto",
              }}
            >
              {comments.map((comment) => (
                <Comment
                  username={comment.username}
                  id={comment.id}
                  key={comment.id}
                  text={comment.text}
                />
              ))}
            </div>

            {/* Comment input form */}
            <div className="border-top p-2">
              <Form onSubmit={handleSubmit} className="d-flex">
                <Form.Control
                  size="sm"
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  required
                  className="me-2"
                />
                <Button variant="outline-primary" type="submit" size="sm">
                  Post
                </Button>
              </Form>
            </div>
          </div>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

export default Comments;
