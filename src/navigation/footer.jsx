import { Container } from "react-bootstrap";

function Footer() {
  return (
    <footer className="bg-dark text-white-50">
      <Container fluid>
        <span className="text-reset">Made by Adam Harris! </span>
        <a className="text-reset" href="https://github.com/adammharris/startup">Github</a>
      </Container>
    </footer>
  );
}

export default Footer;