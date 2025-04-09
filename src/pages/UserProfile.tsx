import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/UserContext';
import Article from '../components/Article';

interface Post {
  id: string;
  title: string;
  content: string;
  // ...other fields
}

const UserProfile: React.FC = () => {
  const { username_uri } = useParams<{ username_uri: string }>();
  const { loggedIn, username } = useAuth();
  const isOwnProfile = loggedIn && username === username_uri;
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch(`/api/articles/${username_uri}`);
        if (response.ok) {
          const data = await response.json();
          setPosts(data);
        } else {
          console.error("Error fetching posts for user:", username_uri);
        }
      } catch (error) {
        console.error("Failed to fetch posts", error);
      }
    }
    fetchPosts();
  }, [username_uri]);

  return (
    <div className="container mt-3">
      <h1>{username_uri}'s Profile</h1>
      <p>(viewing as {username})</p>
      {isOwnProfile && (
        <div>
          <button type="button">New Post</button>
          <button type="button">Logout</button>
        </div>
      )}
      <div>
        {posts.length > 0 ? (
          posts.map(post => (
            <Article key={post.id} article={post} />
          ))
        ) : (
          <p>No posts found.</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;