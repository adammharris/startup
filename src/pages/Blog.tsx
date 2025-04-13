import { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import Articles from '../components/Articles';

const Blog: React.FC = () => {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogArticles = async () => {
      try {
        setLoading(true);
        // Fetch articles by the ShowBrain_Team user
        const response = await fetch('/api/articles/ShowBrain_Team');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch blog articles: ${response.statusText}`);
        }
        
        const data = await response.json();
        setArticles(data);
      } catch (err) {
        console.error('Error fetching blog articles:', err);
        setError('Unable to load blog articles. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogArticles();
  }, []);

  return (
    <main className="text-dark p-5">
      <Card className="p-5 m-5">
        <h1>Blog</h1>
        <hr/>
        <p>Welcome to the ShowBrain blog!</p>
      </Card>
      
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-2">Loading blog articles...</p>
        </div>
      ) : error ? (
        <Alert variant="danger" className="my-4">
          {error}
        </Alert>
      ) : articles.length > 0 ? (
        <Articles articles={articles} />
      ) : (
        <Alert variant="info" className="my-4">
          No blog articles available at the moment. Check back soon!
        </Alert>
      )}
    </main>
  );
}

export default Blog;