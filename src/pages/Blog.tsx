import Card from 'react-bootstrap/Card';
import Articles from '../components/Articles';

const Blog: React.FC = () => {
  return (
    <main className="text-dark p-5">
      <Card className="p-5 m-5">
        <h1>Blog</h1>
        <hr/>
        <p>Welcome to the ShowBrain blog!</p>
      </Card>
      <Articles fixedUsername="ShowBrain_Team" refreshOnMount={true} />
    </main>
  );
}

export default Blog;