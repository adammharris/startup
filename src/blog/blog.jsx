//import React from 'react';
//import './blog.css'
import Card from 'react-bootstrap/Card'

function Blog() {
  return (
    <main className="text-dark p-5">
        <Card className="p-5 m-5">
            <h1>Blog</h1>
            <hr/>
            <p>Welcome to the ShowBrain blog!</p>
        </Card>
        
        <zero-md src="pages/first.md"></zero-md>
        <zero-md src="pages/second.md"></zero-md>
    </main>
  );
}

export default Blog