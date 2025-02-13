import React from 'react';
import './help.css'

export function Help() {
  return (
    <main className="body bg-secondary text-dark">
        <h1>Help</h1>
        <p>Here are some common issues.</p>
        <h2></h2>
        <details>
            <summary>
                Why doesn't this website work yet?
            </summary>
            <p>
                Unfortunately, I have only made the HTML and CSS. Stay tuned for JavaScript, React, and Websocket.
            </p>
        </details>
        <details>
            <summary>
                Why was ShowBrain made?
            </summary>
            <p>
                See the <a href="about.html">about page</a>.
            </p>
        </details>
    </main>
  );
}