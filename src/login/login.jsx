import React from 'react';

export function Login() {
  return (
    <main id="loginform" className="body bg-secondary text-dark">
        <h1>Login</h1>
        <form method="get" action="dashboard.html">
            <div>
                <span>Email:</span>
                <input type="text" placeholder="your@email.com" />
            </div>
            <div>
                <span>Password: </span>
                <input type="password" placeholder="password" />
            </div>
            <button type="submit">Login</button>
            <button type="submit">Register</button>
        </form>
    </main>
  );
}