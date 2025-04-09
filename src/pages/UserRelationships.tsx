import { useState, useEffect } from "react";
import { Container, Form, Button, Table, Badge } from "react-bootstrap";
import { useAuth } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

interface Relationship {
  id: string;
  username: string;
  tags: string[];
}

const UserRelationships: React.FC = () => {
  const { username, loggedIn } = useAuth();
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [selectedUsername, setSelectedUsername] = useState<string>("");
  const [newTag, setNewTag] = useState<string>("");
  const navigate = useNavigate();

  // Fetch relationships via GET to /api/user/relationships
  useEffect(() => {
    async function fetchRelationships() {
      try {
        const response = await fetch("/api/user/relationships", {
          method: "GET",
        });
        if (response.ok) {
          const data = await response.json();
          setRelationships(data);
        } else {
          console.error("Error fetching relationships:", response.status);
        }
      } catch (error) {
        console.error("Error fetching relationships:", error);
      }
    }
    if (loggedIn) {
      fetchRelationships();
    }
  }, [loggedIn]);

  const handleAddTag = async () => {
    if (!selectedUsername.trim() || !newTag.trim()) return; // ensure inputs
    try {
      const response = await fetch("/api/user/relationships", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        // Pass both targetUsername and tag; adjust to match your backend expectations
        body: JSON.stringify({ username: selectedUsername, tag: newTag}), 
      });

      if (response.ok) {
        // Expecting the API to return the updated relationship for targetUsername
        const updatedRelationship: Relationship = await response.json();
        setRelationships((prev) => {
          // Check if relationship already exists then update, or add new relationship
          const index = prev.findIndex(
            (rel) =>
              rel.username.toLowerCase() === selectedUsername.toLowerCase()
          );
          if (index !== -1) {
            const newRels = [...prev];
            newRels[index] = updatedRelationship;
            return newRels;
          } else {
            return [...prev, updatedRelationship];
          }
        });
        // Clear inputs
        setNewTag("");
        setSelectedUsername("");
      } else {
        console.error("Error updating relationships:", response.status);
      }
    } catch (error) {
      console.error("Error updating relationships:", error);
    }
  };

  // New: delete a tag by calling DELETE on /api/user/relationships/{tag}
  const handleDeleteTag = async (tag: string) => {
    try {
      const response = await fetch(
        `/api/user/relationships/${encodeURIComponent(tag)}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        // Remove the tag from all relationships in state.
        setRelationships((prevRelationships) =>
          prevRelationships.map((rel) => ({
            ...rel,
            tags: rel.tags.filter((t) => t !== tag),
          }))
        );
      } else {
        console.error("Error deleting tag:", response.status);
      }
    } catch (error) {
      console.error("Error deleting tag:", error);
    }
  };

  return (
    <Container className="mt-3">
      <h1>Relationships</h1>
      <p>Type a username and add tags that describe your relationship with that user.</p>
      
      <Form.Group controlId="userInput">
        <Form.Label>User</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter a username"
          value={selectedUsername}
          onChange={(e) => setSelectedUsername(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="newTag" className="mt-2">
        <Form.Label>Add Tag</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter tag"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
        />
      </Form.Group>

      <Button variant="primary" onClick={handleAddTag} className="mt-2">
        Add Tag
      </Button>

      <Button variant="danger" onClick={() => navigate("/dashboard")} className="mt-2 ms-2">
        Back to Dashboard
      </Button>
      <hr />

      <h2>Your Relationships</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>User</th>
            <th>Your Tags (click a tag to delete it)</th>
          </tr>
        </thead>
        <tbody>
          {relationships.map((rel) => (
            <tr key={rel.id}>
                <td
                    onClick={() => navigate(`/${rel.username}`)}
                    style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
                >
                {rel.username}
                </td>
              <td>
                {rel.tags && rel.tags.length > 0
                  ? rel.tags.map((tag) => (
                      <Badge
                        key={tag}
                        bg="secondary"
                        className="me-1"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleDeleteTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))
                  : "None"}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default UserRelationships;