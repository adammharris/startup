import { useEffect, useRef, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Comment from "./Comment";

export default function Comments({ accordionKey = "0" }) {
  const [comments, setComments] = useState([
    { username: "testuser1", id: 1, text: "Here is a test comment!" },
  ]);

  const [newComment, setNewComment] = useState("");
  const commentsContainerRef = useRef(null);

  // This useEffect will run whenever the comments array changes
  useEffect(() => {
    if (commentsContainerRef.current) {
      // Scroll to top when comments change
      commentsContainerRef.current.scrollTop = 0;
    }
  }, [comments]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newComment.trim()) return;

    // Add new comment to the list with a unique ID
    const newCommentObj = {
      username: localStorage.getItem("username") || "Anonymous",
      id: Date.now(),
      text: newComment,
    };

    setComments([newCommentObj, ...comments]);

    // Clear the input
    setNewComment("");
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
}
