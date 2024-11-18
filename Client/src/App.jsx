import { useState } from 'react'
import './App.css'
import RegistrationForm from './components/registerForm'
import LoginForm from './components/loginForm'
import SubscriptionForm from './components/subscription'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

function App() {
  const [users, setUsers] = useState([]);
  const adminUsername = "Admin";

  return (
    <>
      <h1 id='textcolor'>MQuizTT</h1>
      <Router>
      <div>
        <Link id='textcolor' to="/register">Criar Conta</Link>
        <Link id='textcolor' to="/login">Login</Link>
        <Link id='textcolor' to="/subscription">Subscrever</Link>
      </div>
      <Routes>
        <Route
          path="/register"
          element={<RegistrationForm users={users} setUsers={setUsers} />}
        />
        <Route
          path="/login"
          element={<LoginForm users={users} adminUsername={adminUsername} />}
        />
        <Route
          path="/subscription"
          element={<SubscriptionForm/>}
        />
      </Routes>
    </Router>
    </>
    
    
      
  )
}

export default App
