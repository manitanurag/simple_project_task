import React, { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

export default function Login(){
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [err,setErr]=useState('');
  const navigate = useNavigate();

  const submit = async e => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login',{ email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/tasks');
    } catch (err) {
      setErr(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{maxWidth:420}}>
      <h3>Login</h3>
      {err && <div style={{color:'red', marginBottom:8}}>{err}</div>}
      <form onSubmit={submit}>
        <div style={{marginBottom:8}}>
          <label style={{display:'block', fontSize:13}}>Email</label>
          <input style={{width:'100%', padding:8}} value={email} onChange={e=>setEmail(e.target.value)} required/>
        </div>
        <div style={{marginBottom:8}}>
          <label style={{display:'block', fontSize:13}}>Password</label>
          <input style={{width:'100%', padding:8}} type="password" value={password} onChange={e=>setPassword(e.target.value)} required/>
        </div>
        <button type="submit" style={{padding:'8px 12px'}}>Login</button>
      </form>
    </div>
  );
}
