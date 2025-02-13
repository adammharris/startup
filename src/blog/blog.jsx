import React from 'react';
import './blog.css'

export function Blog() {
  return (
    <main className="body bg-secondary text-dark">
        <div>
            <h1>Blog</h1>
            <p>Welcome to the ShowBrain blog!</p>
        </div>
        
        <zero-md src="pages/first.md"></zero-md>
        <zero-md src="pages/second.md"></zero-md>
    </main>
  );
}