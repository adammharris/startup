import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
} from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import { NavLink } from "react-router-dom";

const Help: React.FC = () => {
  return (
    <Container className="text-dark p-5" style={{ maxWidth: "800px" }}>
      <Card className="p-4">
        <h1>Help</h1>
        <hr />
        <p>Here are some common issues.</p>
        <Accordion>
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              Why doesn't this website work yet?
            </Accordion.Header>
            <AccordionBody>
              Unfortunately, I have only made the HTML, CSS, and React. Stay
              tuned for a proper backend with Websocket.
            </AccordionBody>
          </Accordion.Item>
          <AccordionItem eventKey="1">
            <AccordionHeader>Why was ShowBrain made?</AccordionHeader>
            <AccordionBody>
              See the <NavLink to="/about">about page</NavLink>.
            </AccordionBody>
          </AccordionItem>
        </Accordion>
      </Card>
    </Container>
  );
};

export default Help;
