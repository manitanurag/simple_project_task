import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import TaskList from './pages/TaskList';
import TaskForm from './pages/TaskForm';
import TaskDetail from './pages/TaskDetail';
import Users from './pages/Users';

function App(){
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  return (
    <div style={{fontFamily:'Arial, sans-serif', padding:16, maxWidth:960, margin:'0 auto'}}>
      <header style={{display:'flex', justifyContent:'space-between', alignItems:'center', paddingBottom:12, borderBottom:'1px solid #ddd'}}>
        <h2 style={{margin:0}}><Link to="/" style={{textDecoration:'none', color:'#222'}}>Task Manager</Link></h2>
        <nav>
          {user ? (
            <>
              <span style={{marginRight:12}}>Hi, {user.name}</span>
              <Link to="/tasks" style={{marginRight:12}}>Tasks</Link>
              <Link to="/tasks/new" style={{marginRight:12}}>New</Link>
              {user.role === 'admin' && <Link to="/users" style={{marginRight:12}}>Users</Link>}
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{marginRight:12}}>Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </header>

      <main style={{paddingTop:16}}>
        <Routes>
          <Route path="/" element={<TaskList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/tasks" element={<TaskList />} />
          <Route path="/tasks/new" element={<TaskForm />} />
          <Route path="/tasks/:id" element={<TaskDetail />} />
          <Route path="/tasks/:id/edit" element={<TaskForm />} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
