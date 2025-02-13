import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card'
//import "./home.css"

export function Home() {
  return (
    <main className="container-fluid">
        <Card>
            <Card.Title>
            Welcome to ShowBrain!
            </Card.Title>
            <Card.Body>
            A simple, minimal, blog-like space for sharing your thoughts.
            </Card.Body>
        </Card>

        <CardGroup>
            <Card>
                <Card.Img variant="top" src="icons/upload_journal.svg" fluid />
                <Card.Body>
                <Card.Title>
                Upload your journal
                </Card.Title>
                <Card.Text>
                It all starts by uploading your journal. Don't worry; we can't see it, and it is private by default.
                </Card.Text>
                </Card.Body>
            </Card>
            <Card>
                <Card.Img variant="top" src="icons/upload_journal.svg" fluid />
                <Card.Body>
                <Card.Title>
                Assign access levels
                </Card.Title>
                <Card.Text>
                Odds are, you don't want everyone seeing everything, but you want some people to see some things. Tell us who should see what.
                </Card.Text>
                </Card.Body>
            </Card>
            <Card>
                <CardImg variant="top" src="icons/upload_journal.svg" fluid />
                <Card.Body>
                <Card.Title>Share with friends</Card.Title>
                <Card.Text>
                When your friends register, you can assign them access levels too, so only people marked as "Friend" will see entries you dedicate to friends. 
                </Card.Text>
                </Card.Body>
            </Card>
        </CardGroup>


        <div id="info">
            <section className="card">
                <img src="media_relationships.jpg" className="card-img-left"></img>
                <div>
                <h1>Fine-tuned control</h1>
                <p>Unlike other platforms, we understand that not everybody you interact with is necessarily a "friend." You can also mark people as "family," "coworker," "partner," or whatever else you want to call them. Each group of people will only see the entries that you say they can see. And people can belong to more than one category too, so your family can see the entries meant for them as well as the ones meant for your friends. Control can be fine-tuned down to the individual, so you can make entries for just one person to read if you like.</p>
                </div>
            </section>
            <button onclick="location.replace('login.html')">Get Started</button>
        </div>
    </main>
  );
}