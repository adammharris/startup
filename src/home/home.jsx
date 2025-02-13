import React from 'react';
import Card from 'react-bootstrap/Card'
import "./home.css"

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

        <div className="card-deck">
            <h1>How does it work?</h1>
            <section>
            <div className="card">
                <img src="icons/upload_journal.svg" className="card-img-top"/>
                <div className="card-body">
                    <h3 className="card-title">Upload your journal</h3>
                    <p className="card-text">It all starts by uploading your journal. Don't worry; we can't see it, and it is private by default.</p>
                </div>
            </div>

            <div className="card">
                <img src="icons/access-levels.svg" className="card-img-top"></img>
                <div className="card-body">
                    <h3 className="card-title">Assign access levels</h3>
                    <p className="card-text">Odds are, you don't want everyone seeing everything, but you want some people to see some things. Tell us who should see what.</p>
                </div>
            </div>

            <div className="card">
                <img src="icons/share_with_friends.svg" className="card-img-top"></img>

                <h3 className="card-title">Share with friends</h3>
                <p>When your friends register, you can assign them access levels too, so only people marked as "Friend" will see entries you dedicate to friends.</p>
            </div>
        </section>
        </div>

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