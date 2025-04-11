import { useEffect, useRef, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Comment from "./Comment";
import { useAuth } from "../contexts/UserContext";

interface CommentType {
  username: string;
  id: number;
  text: string;
  date: string;
  articleId: string;
}

interface CommentsProps {
  accordionKey?: string;
  articleId: string;
  isVisible?: boolean;
}

const Comments: React.FC<CommentsProps> = ({ accordionKey = "0", articleId, isVisible = false }) => {
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const commentsContainerRef = useRef<HTMLDivElement | null>(null);
  const { username } = useAuth(); // Add this line to get the current username
  
  // Store the ws instance in a ref
  const wsRef = useRef<WebSocket | null>(null);

  // Create the WebSocket connection
  useEffect(() => {
    // Determine protocol based on the window's location protocol
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    // Connect to the current host, using the relative path '/ws' which Vite will proxy
    const wsUrl = `${wsProtocol}//${window.location.host}/ws`;

    console.log(`WebSocket client: Attempting to connect to ${wsUrl}`);

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;
  
    ws.onopen = () => {
      console.log("WebSocket client: Connected in Comments component");
    };
  
    ws.onmessage = (event) => {
      try {
        const incoming = JSON.parse(event.data);
        // Check if the message is for the current article
        if (incoming.articleId === articleId) {
          console.log("WebSocket client: Received new comment:", incoming);
          // Add the new comment to the current list
          setComments(prevComments => [incoming, ...prevComments]);
        }
      } catch (error) {
        console.error("WebSocket client: Failed to parse message", error);
      }
    };
  
    ws.onerror = (error) => {
      console.error("WebSocket client: Error occurred", error);
    };
  
    ws.onclose = (event) => {
      console.log(`WebSocket client: Disconnected in Comments component. Code: ${event.code}, Reason: ${event.reason}`);
    };
  
    // Clean up the connection on unmount
    return () => {
      console.log("WebSocket client: Closing connection due to component unmount or articleId change.");
      ws.close();
    };
  }, [articleId]);

  const fetchComments = async () => {
    if (!articleId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const encodedTitle = encodeURIComponent(articleId);
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
  }, [articleId]);

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

    // Use the actual username from context, or a placeholder if not available
    const currentUsername = username || "[Loading…]";

    const newCommentObj: CommentType = {
      username: currentUsername,
      date: new Date().toISOString(),
      id: Date.now(),
      text: newComment,
      articleId: articleId,
    };

    // Cache the comment text in case we need to restore it after an error
    const commentText = newComment;
    
    // Clear the input immediately for better UX
    setNewComment("");

    // Add the new comment to the list optimistically
    setComments(prevComments => [newCommentObj, ...prevComments]);

    // Send the new comment over WebSocket
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(newCommentObj));
      console.log("Comment sent over websocket:", newCommentObj);
    } else {
      console.error("WebSocket is not open. Comment not sent.");
      // Optionally: you can fall back to the fetch POST request here if needed.
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
                  date={comment.date}
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
