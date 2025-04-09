import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/UserContext';

interface Post {
  id: string;
  title: string;
  content: string;
  // ...other fields
}

const UserProfile: React.FC = () => {
  const { username_uri } = useParams<{ username: string }>();
  const { loggedIn, username } = useAuth();
  const isOwnProfile = loggedIn && username === username_uri;
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch(`/api/posts/${username}`);
        if (response.ok) {
          const data = await response.json();
          setPosts(data);
        } else {
          console.error("Error fetching posts for user:", username);
        }
      } catch (error) {
        console.error("Failed to fetch posts", error);
      }
    }
    fetchPosts();
  }, [username]);

  return (
    <div className="container mt-3">
      <h1>{username}'s Profile</h1>
      {isOwnProfile && (
        <div>
          <button type="button">New Post</button>
          <button type="button">Logout</button>
        </div>
      )}
      <div>
        {posts.length > 0 ? (
          posts.map(post => (
            <div key={post.id}>
              <h3>{post.title}</h3>
              <p>{post.content}</p>
            </div>
          ))
        ) : (
          <p>No posts found.</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;