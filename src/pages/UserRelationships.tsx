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

  // Optimistic update version of handleAddTag:
  const handleAddTag = async () => {
    if (!selectedUsername.trim() || !newTag.trim()) return;
  
    // Capture the current values
    const targetUsername = selectedUsername.trim();
    const tagValue = newTag.trim();
  
    // Check for an existing relationship in state (case-insensitive)
    const existingIndex = relationships.findIndex(
      (rel) => rel.username.toLowerCase() === targetUsername.toLowerCase()
    );
  
    // Prepare the optimistic update using the captured values
    let optimisticallyUpdated: Relationship;
    if (existingIndex !== -1) {
      optimisticallyUpdated = {
        ...relationships[existingIndex],
        tags: [...relationships[existingIndex].tags, tagValue],
      };
    } else {
      optimisticallyUpdated = {
        id: Date.now().toString(), // temporary id; backend should return a real id
        username: targetUsername,
        tags: [tagValue],
      };
    }
  
    // Immediately update the UI
    setRelationships((prev) => {
      if (existingIndex !== -1) {
        const newRels = [...prev];
        newRels[existingIndex] = optimisticallyUpdated;
        return newRels;
      } else {
        return [...prev, optimisticallyUpdated];
      }
    });
  
    // Clear the inputs AFTER capturing the values
    setNewTag("");
    setSelectedUsername("");
  
    // Now call the API, using the captured values
    try {
      const response = await fetch("/api/user/relationships", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: targetUsername, tag: tagValue }),
      });
  
      if (response.ok) {
        const updatedRelationship: Relationship = await response.json();
        console.log("Updated Relationship:", updatedRelationship);
        if (!updatedRelationship || !updatedRelationship.username) {
          console.error("Invalid response from API:", updatedRelationship);
          return;
        }
        setRelationships((prev) =>
          prev.map((rel) =>
            rel.username.toLowerCase() === updatedRelationship.username.toLowerCase()
              ? updatedRelationship
              : rel
          )
        );
      } else {
        console.error("Error updating relationships:", response.status);
        // Optionally revert the optimistic update if needed
      }
    } catch (error) {
      console.error("Error updating relationships:", error);
    }
  };

  // delete a tag by calling DELETE on /api/user/relationships/{tag}
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
          {Array.isArray(relationships) &&
            relationships.map((rel) => rel && (
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