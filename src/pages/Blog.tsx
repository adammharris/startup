import Card from 'react-bootstrap/Card';
import Articles from '../components/Articles';
import { useEffect, useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';

// Define blog article type
interface ArticleType { id: string; title: string; content: string; date: string; author: string; }

const Blog: React.FC = () => {
  const [articles, setArticles] = useState<ArticleType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const loadArticles = async () => {
      try {
        const resp = await fetch('/api/articles/ShowBrain_Team');
        if (!resp.ok) throw new Error(`Status ${resp.status}`);
        const data: ArticleType[] = await resp.json();
        setArticles(data);
      } catch (e) {
        console.error('Error fetching blog articles:', e);
      } finally {
        setLoading(false);
      }
    };
    loadArticles();
  }, []);
  
  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading articles...</p>
      </div>
    );
  }

  return (
    <main className="text-dark p-5">
      <Card className="p-5 m-5">
        <h1>Blog</h1>
        <hr/>
        <p>Welcome to the ShowBrain blog!</p>
      </Card>
      <Articles articles={articles} refreshOnMount={false} />
    </main>
  );
}

export default Blog;