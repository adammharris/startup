import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card'
import CardGroup from 'react-bootstrap/CardGroup'
import Container from 'react-bootstrap/Container'

export function Home() {
  return (
    <Container className="mt-5 p-5" fluid  >
        <Card className="p-5 m-4">
            <Card.Title>
            Welcome to ShowBrain!
            </Card.Title>
            <Card.Body>
            A simple, minimal, blog-like space for sharing your thoughts.
            </Card.Body>
        </Card>

        <CardGroup>
            <Card className="p-5 p-md-5 m-md-4">
            <Card.Img variant="top" src="./upload_journal.svg" fluid />
                <Card.Body>
                <Card.Title>
                Upload your journal
                </Card.Title>
                <Card.Text>
                It all starts by uploading your journal. Don't worry; we can't see it, and it is private by default.
                </Card.Text>
                </Card.Body>
            </Card>
            <Card className="p-5 p-md-5 m-md-4">
            <Card.Img variant="top" src="./access-levels.svg" fluid />
                <Card.Body>
                <Card.Title>
                Assign access levels
                </Card.Title>
                <Card.Text>
                Odds are, you don't want everyone seeing everything, but you want some people to see some things. Tell us who should see what.
                </Card.Text>
                </Card.Body>
            </Card>
            <Card className="p-5 p-md-5 m-md-4">
            <Card.Img variant="top" src="./share_with_friends.svg" fluid />
                <Card.Body>
                <Card.Title>Share with friends</Card.Title>
                <Card.Text>
                When your friends register, you can assign them access levels too, so only people marked as "Friend" will see entries you dedicate to friends. 
                </Card.Text>
                </Card.Body>
            </Card>
        </CardGroup>
    </Container>
  );
}

export default Home