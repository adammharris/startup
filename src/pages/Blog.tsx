import Card from 'react-bootstrap/Card'
import Articles from '../components/Articles';


// Sample blog articles for testing. Database needed
const sampleBlogArticles = [
  {
    id: "blog-1",
    title: "Getting Started with ShowBrain",
    content: "ShowBrain is a powerful tool for organizing your thoughts and ideas. In this article, we'll explore the basics of getting started with ShowBrain...",
    date: "2024-03-01T12:00:00Z",
    author: "ShowBrain Team"
  },
  {
    id: "blog-2",
    title: "Advanced ShowBrain Techniques",
    content: "Once you've mastered the basics of ShowBrain, it's time to explore some advanced techniques. In this article, we'll dive deeper into...",
    date: "2024-03-05T14:30:00Z",
    author: "ShowBrain Team"
  },
  {
    id: "blog-3",
    title: "ShowBrain for Teams",
    content: "ShowBrain isn't just for individuals. Teams can benefit greatly from using ShowBrain for collaborative work. Let's explore how teams can use ShowBrain to...",
    date: "2024-03-10T09:15:00Z",
    author: "ShowBrain Team"
  }
];

const Blog: React.FC = () => {
  return (
    <main className="text-dark p-5">
        <Card className="p-5 m-5">
            <h1>Blog</h1>
            <hr/>
            <p>Welcome to the ShowBrain blog!</p>
        </Card>
        
        <Articles articles={sampleBlogArticles}/>
    </main>
  );
}

export default Blog;