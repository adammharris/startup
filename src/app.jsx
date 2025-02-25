import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css'

import Navigation from './navigation/navigation'
import Home from './home/home';
import Login from './login/login';
import Blog from './blog/blog';
import About from './about/about';
import Help from './help/help';
import Footer from './navigation/footer';

function NotFound() {
  return (
    <main className="container-fluid bg-secondary text-center m-5 p-5">
      404: Return to sender. Address unknown.
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
    <h1>Hello</h1>
      <div className="App">
        <Navigation />
        <div className="body bg-secondary">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/about" element={<About />} />
            <Route path="/help" element={<Help />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;