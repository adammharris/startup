import Card from "react-bootstrap/Card";
import CardGroup from "react-bootstrap/CardGroup";
import Container from "react-bootstrap/Container";
import access from "./access_levels.svg";
import share from "./share_with_friends.svg";
import upload from "./upload_journal.svg";

export const Home: React.FC = () => {
  return (
    <Container fluid style={{ maxWidth: "800px" }}>
      <Card className="p-5 m-4">
        <Card.Title>
          <h1>Welcome to ShowBrain!</h1>
        </Card.Title>
        <hr></hr>
        <Card.Body>
          <p>A simple, minimal, blog-like space for sharing your thoughts.</p>
        </Card.Body>
      </Card>
      <CardGroup className="d-flex flex-column flex-sm-row justify-content-center">
        <Card className="card-responsive">
          <Card.Img variant="top" src={upload} fluid />
          <Card.Body>
            <Card.Title>Upload your journal</Card.Title>
            <Card.Text>
              It all starts by uploading your journal. Don't worry; we can't see
              it, and it is private by default.
            </Card.Text>
          </Card.Body>
        </Card>
        <Card className="card-responsive">
          <Card.Img variant="top" src={access} fluid />
          <Card.Body>
            <Card.Title>Assign access levels</Card.Title>
            <Card.Text>
              Odds are, you don't want everyone seeing everything, but you want
              some people to see some things. Tell us who should see what.
            </Card.Text>
          </Card.Body>
        </Card>
        <Card className="card-responsive">
          <Card.Img variant="top" src={share} fluid />
          <Card.Body>
            <Card.Title>Share with friends</Card.Title>
            <Card.Text>
              When your friends register, you can assign them access levels too,
              so only people marked as "Friend" will see entries you dedicate to
              friends.
            </Card.Text>
          </Card.Body>
        </Card>
      </CardGroup>
    </Container>
  );
};

export default Home;
