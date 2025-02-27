import React, { useState, useRef, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Comment from './Comment';

export default function Comments() {
    const [comments, setComments] = useState([
        { username: "testuser3", id: 3, text: "Third comment" },
        { username: "testuser2", id: 2, text: "Second comment" },
        { username: "testuser1", id: 1, text: "First comment" }
    ]);

    const [newComment, setNewComment] = useState('');
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
            username: localStorage.getItem('username'),
            id: Date.now(),
            text: newComment
        };
        
        setComments([newCommentObj, ...comments]);
        
        // Clear the input
        setNewComment('');
    };

    return (
        <div className="mt-0">
            {/* Comment section header */}
            <div className="bg-light border-top border-bottom py-2 px-3">
                <small className="text-muted">Comments</small>
            </div>
            
            {/* Scrollable comments area */}
            <div 
                ref={commentsContainerRef}
                style={{ 
                    maxHeight: '120px', 
                    overflowY: 'auto',
                }}
            >
                {comments.map(comment => (
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
                        onChange={e => setNewComment(e.target.value)}
                        required
                        className="me-2"
                    />
                    <Button 
                        variant="outline-primary" 
                        type="submit"
                        size="sm"
                    >
                        Post
                    </Button>
                </Form>
            </div>
        </div>
    );
}