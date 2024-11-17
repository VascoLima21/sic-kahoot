import React, { useState } from 'react';

const RegistrationForm = ({ users, setUsers }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const validateUsername = (name) => /^[a-zA-Z]{2,100}$/.test(name); //username entre 2 e 100 digitos

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Preencha os campos acima.');
      return;
    }
    if (!validateUsername(username)) {
      setError('Username deverá conter pelo menos 2 caracteres.');
      return;
    }
    setUsers([...users, { username, password }]);
    setError('');
    alert('Conta criada com sucesso!');
  };

  return (
    <form onSubmit={handleSubmit}>
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
      <button type="submit">Criar Conta</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
};

export default RegistrationForm;