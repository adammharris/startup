import { Container } from "react-bootstrap";

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark text-white-50 fixed-bottom">
      <Container>
        <span className="text-reset">Made by Adam Harris! </span>
        <a className="text-reset" href="https://github.com/adammharris/startup">Github</a>
      </Container>
    </footer>
  );
}

export default Footer;