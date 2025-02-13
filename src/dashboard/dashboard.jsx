import React from 'react';

export function Dashboard() {
  return (
    <main id="dashboard" className="body bg-secondary text-dark">
        <div class="caption">
            <h1>Welcome to your ShowBrain!</h1>
            <p>(This is a demo page, by the way. The functionality is not yet fully implemented.)</p>
        </div>

        <div class="caption">
            <img src="media/blank-avatar.jpg" width="200px"/>
            <h3>About Me</h3>
            <p>This is the little info box that will be off to the right that will be visible to anyone who visit your page.</p>
        </div>

        <div>
            <div class="caption">
                <img src="media/stock-river.jpg" width="200px"/>
                <h3>Article from database</h3>
                <p>Lorem ipsum dolor or something like that</p>
                <iframe src="comments.html"></iframe>
                <br>
            </div>

            <div class="caption">
                <img src="media/stock-river.jpg" width="200px"/>
                    <h3>Another article from the database here</h3>
                <p>Summary of the article or something like that</p>
                
                <iframe src="comments.html"></iframe>
                <br>
            </div>
        </div>

        <div>
            <div class="caption">
                <h1>Categories</h1>
            <ul>
                <li>Family</li>
                <li>Friends</li>
                <li>Public</li>
            </ul>
            </div>
        </div>
    </main>
  );
}