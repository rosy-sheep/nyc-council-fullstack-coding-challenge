// App.js
import React, { useState } from 'react';
import './App.css';
import LoginPage from './LoginPage';
import DashboardPage from './DashboardPage';

const App = () => {
  const [token, setToken] = useState('');

  return (
    <div>
      <header className="site-header">
        <h1>NYC Council Complaints</h1>
      </header>
      <main id="main">
        <div className="site-content">
          {token ? (
            <DashboardPage token={token} />
          ) : (
            <LoginPage setToken={setToken} />
          )}
        </div>
      </main>
      
    </div>
  );
};

export default App;
