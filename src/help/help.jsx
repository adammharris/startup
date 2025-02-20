//import React from 'react';
//import './help.css'
import { Accordion, AccordionBody, AccordionHeader, AccordionItem } from 'react-bootstrap';
import Card from 'react-bootstrap/Card'

function Help() {
  return (
    <main className="body bg-secondary text-dark p-5 m-5">
      <Card className="p-4">
        <h1>Help</h1>
        <hr/>
        <p>Here are some common issues.</p>
        <Accordion>
            <Accordion.Item eventKey="0">
                <Accordion.Header>
                Why doesn't this website work yet?
                </Accordion.Header>
                <AccordionBody>
                Unfortunately, I have only made the HTML and CSS. Stay tuned for JavaScript, React, and Websocket.
                </AccordionBody>
            </Accordion.Item>
            <AccordionItem eventKey="1">
                <AccordionHeader>
                Why was ShowBrain made?
                </AccordionHeader>
                <AccordionBody>
                See the <a href="about.html">about page</a>.
                </AccordionBody>
            </AccordionItem>
        </Accordion>
        </Card>
    </main>
  );
}

export default Help