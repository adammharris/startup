import Card from "react-bootstrap/Card";
import { Container } from "react-bootstrap";

const NotFound: React.FC = () => {
  return (
    <Container className="text-dark p-5" style={{ maxWidth: "800px" }}>
      <Card className="p-4">
        <h1>404 Not Found</h1>
        <hr />
        <p>Sorry, the page you are looking for does not exist.</p>
      </Card>
    </Container>
  );
};
export default NotFound;