import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Home } from './home/home';
import { Login } from './login/login';
import { Blog } from './blog/blog';
import { About } from './about/about';
import { Help } from './help/help';

export default function App() {
  return (
    <BrowserRouter>
    <div className="body bg-secondary text-dark">
        <header className="container-fluid bg-primary">
            <nav className="navbar fixed-top navbar-dark">
                <div className="navbar-brand">
                    ShowBrain
                </div>
                <menu className="navbar-nav">
                    <li className="nav-item">
                    <NavLink className='nav-link' to=''>Home</NavLink>
                    </li>
                    <li className="nav-item">
                    <NavLink className='nav-link' to='login'>Login</NavLink>
                    </li>
                    <li className="nav-item">
                    <NavLink className='nav-link' to='blog'>Blog</NavLink>
                    </li>
                    <li className="nav-item">
                    <NavLink className='nav-link' to='about'>About</NavLink>
                    </li>
                    <li className="nav-item">
                    <NavLink className='nav-link' to='help'>Help</NavLink>
                    </li>
                </menu>
            </nav>
        </header>
        <Routes>
            <Route path='/' element={<Home />} exact />
            <Route path='/login' element={<Login />} />
            <Route path='/blog' element={<Blog />} />
            <Route path='/about' element={<About />} />
            <Route path='/help' element={<Help />} />
            <Route path='*' element={<NotFound />} />
        </Routes>

        <footer className="bg-dark text-white-50">
            <div className="container-fluid">
                <span className="text-reset">Made by Adam Harris! </span>
                <a className="text-reset" href="https://github.com/adammharris/startup">Github</a>
            </div>
        </footer>
    </div>
    </BrowserRouter>
  );
}

function NotFound() {
    return <main className="container-fluid bg-secondary text-center">404: Return to sender. Address unknown.</main>;
  }