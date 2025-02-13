import React from 'react';

export function Home() {
  return (
    <main className="body bg-secondary text-dark">
        <div id="title">
            <h1>Welcome to ShowBrain!</h1>
            <p>A simple, minimal, blog-like space for sharing your thoughts.</p>
        </div>

        <div class="list">
            <h1>How does it work?</h1>
            <section>
            <div>
                <img src="icons/upload_journal.svg" width="50px"/>
                <h3>Upload your journal</h3>
                <p>It all starts by uploading your journal. Don't worry; we can't see it, and it is private by default.</p>
            </div>

            <div>
                <img src="icons/access-levels.svg" width="50px"></img>
                <h3>Assign access levels</h3>
                <p>Odds are, you don't want everyone seeing everything, but you want some people to see some things. Tell us who should see what.</p>
            </div>

            <div>
                <img src="icons/share_with_friends.svg" width="50px"></img>
                <h3>Share with friends</h3>
                <p>When your friends register, you can assign them access levels too, so only people marked as "Friend" will see entries you dedicate to friends.</p>
            </div>
        </section>
        </div>

        <div id="info">
            <section>
                <img src="media_relationships.jpg"></img>
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