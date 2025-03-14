import Card from 'react-bootstrap/Card'
import Articles from '../components/Articles';


const Blog: React.FC = () => {
  return (
    <main className="text-dark p-5">
        <Card className="p-5 m-5">
            <h1>Blog</h1>
            <hr/>
            <p>Welcome to the ShowBrain blog!</p>
            <p>(This page will eventually look more like Dashboard, but it really needs a proper backend)</p>
        </Card>
        
        <Articles />
    </main>
  );
}

export default Blog;