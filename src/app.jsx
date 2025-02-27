import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Navigation from './navigation/Navigation';
import Home from './home/Home';
import Login from './login/Login';
import Blog from './blog/Blog';
import About from './about/About';
import Help from './help/Help';
import Footer from './navigation/Footer';
import Dashboard from './dashboard/Dashboard';

function NotFound() {
  return (
    <main className="container-fluid text-center m-5 p-5">
      404: Return to sender. Address unknown.
    </main>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="App d-flex flex-column min-vh-100 pt-4 pb-5 bg-primary">
        <Navigation />
        <div className="body flex-grow-1 pt-5">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/about" element={<About />} />
            <Route path="/help" element={<Help />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;