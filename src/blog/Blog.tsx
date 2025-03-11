import Card from 'react-bootstrap/Card'
import Articles from '../dashboard/Articles';
import { useState } from 'react';

interface Article {
  id: string;
  title: string;
  content: string;
  date: string;
  // Add other properties as needed
}

const Blog: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>(() => {
        try {
            // Get articles (later, get from backend)
            const savedArticles = localStorage.getItem('articles');
            return savedArticles ? JSON.parse(savedArticles) : [];
        } catch (error) {
            console.error("Error parsing articles from localStorage:", error);
            return [];
        }
    });
  return (
    <main className="text-dark p-5">
        <Card className="p-5 m-5">
            <h1>Blog</h1>
            <hr/>
            <p>Welcome to the ShowBrain blog!</p>
            <p>(This page will eventually look more like Dashboard, but it really needs a proper backend)</p>
        </Card>
        
        <Articles articles={articles}/>
    </main>
  );
}

export default Blog;