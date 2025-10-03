import React, { useEffect, useState } from 'react';
import API from '../api';

export default function Users(){
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'user' });
  const [err, setErr] = useState('');

  const fetch = async () => {
    try {
      const res = await API.get('/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      setErr('Could not load users');
    }
  };

  useEffect(()=>{ fetch(); }, []);

  const create = async (e) => {
    e.preventDefault();
    try {
      await API.post('/users', form);
      setForm({ name:'', email:'', password:'', role:'user' });
      fetch();
    } catch (err) {
      console.error(err);
      setErr(err.response?.data?.message || 'Create failed');
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await API.delete(`/users/${id}`);
      fetch();
    } catch (err) {
      console.error(err);
      setErr('Delete failed');
    }
  };

  return (
    <div style={{maxWidth:720}}>
      <h3>Users</h3>
      {err && <div style={{color:'red'}}>{err}</div>}
      <form onSubmit={create} style={{marginBottom:12}}>
        <input placeholder="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required style={{marginRight:8}} />
        <input placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required style={{marginRight:8}} />
        <input placeholder="Password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} required style={{marginRight:8}} />
        <select value={form.role} onChange={e=>setForm({...form, role:e.target.value})} style={{marginRight:8}}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Create</button>
      </form>

      <table style={{width:'100%', borderCollapse:'collapse'}}>
        <thead>
          <tr style={{textAlign:'left', borderBottom:'1px solid #ddd'}}>
            <th style={{padding:6}}>Name</th>
            <th style={{padding:6}}>Email</th>
            <th style={{padding:6}}>Role</th>
            <th style={{padding:6}}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id} style={{borderBottom:'1px solid #f0f0f0'}}>
              <td style={{padding:6}}>{u.name}</td>
              <td style={{padding:6}}>{u.email}</td>
              <td style={{padding:6}}>{u.role}</td>
              <td style={{padding:6}}>
                <button onClick={()=>remove(u._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}