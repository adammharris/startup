import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

export default function App() {
  return (
    <div className="body bg-dark text-light">
        <header className="container-fluid">
            <nav className="navbar fixed-top navbar-dark">
                <div className="navbar-brand">
                    ShowBrain
                </div>
                <menu className="navbar-nav">
                    <li className="nav-item">
                        Home
                    </li>
                    <li className="nav-item">
                        Login
                    </li>
                    <li className="nav-item">
                        Blog
                    </li>
                    <li className="nav-item">
                        About
                    </li>
                    <li className="nav-item">
                        Help
                    </li>
                </menu>
            </nav>
        </header>
        <main>
            App components go here
        </main>

        <footer className="bg-dark text-white-50">
            <div className="container-fluid">
                <span className="text-reset">Made by Adam Harris! </span>
                <a className="text-reset" href="https://github.com/adammharris/startup">Github</a>
            </div>
        </footer>
    </div>
  );
}