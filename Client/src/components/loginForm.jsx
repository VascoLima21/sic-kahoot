import React, { useState } from 'react';

const LoginForm = ({ users, adminUsername }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const user = users.find((user) => user.username === username);
    if (!user) {
      setError(`Utilizador ${user} não existe.`);
      return;
    }
    if (username === adminUsername) {
      alert('Bem-vindo, Admin!');
    } else {
      alert('Login executado com sucesso!');
    }
    setError('');
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default LoginForm;