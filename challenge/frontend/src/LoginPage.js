// LoginPage.js
import React, { useState } from 'react';
import axios from 'axios';

const LoginPage = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/login/', { username, password });

      if (response.data.token) {
        setToken(response.data.token);
      } else {
        setError('Invalid credentials. Please check your information. Make sure Caps Lock is not turned on.');
      }
    } catch (err) {
      setError('Error occured. Please try again.');
    }
  };

  return (
    <div>
      <h2>LOGIN</h2>
      <form onSubmit={handleLogin}>
        <table>
          <tbody>
            <tr>
              <td align="right" style={{width: "150px"}}>
                <label htmlFor="username">User name: </label>
              </td>
              <td>
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </td>
            </tr>
            <tr>
              <td align="right" style={{width: "150px"}}>
                <label htmlFor="password">Password: </label>
              </td>
              <td>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </td>
            </tr>
            <tr style={{height: "15px"}}></tr>
            <tr>
              <td style={{width: "150px"}}></td>
              <td><button type="submit" style={{width: "150px"}}>Login</button></td>
            </tr>
            <tr>
              <td style={{width: "150px"}}></td>
              <td>{error && <p style={{ color: 'red' }}>{error}</p>}</td>
            </tr>
          </tbody>
        </table>
      </form>
      
    </div>
  );
};

export default LoginPage;
