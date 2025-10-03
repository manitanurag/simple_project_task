import React, { useEffect, useState } from 'react';
import API from '../api';
import { useNavigate, useParams } from 'react-router-dom';

export default function TaskForm(){
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState({ title:'', description:'', dueDate:'', priority:'medium', assignedTo: '' });
  const [err, setErr] = useState('');
  const [users, setUsers] = useState([]);
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(()=> {
    if (!id) return;
    API.get(`/tasks/${id}`).then(res => {
      const t = res.data;
      setTask({
        title: t.title,
        description: t.description || '',
        dueDate: t.dueDate ? new Date(t.dueDate).toISOString().slice(0,10) : '',
        priority: t.priority || 'medium',
        assignedTo: t.assignedTo ? t.assignedTo._id : ''
      });
    }).catch(err => {
      console.error(err);
    });
  }, [id]);

  useEffect(()=>{
    if (user && user.role === 'admin'){
      API.get('/users').then(res => setUsers(res.data)).catch(err => console.error(err));
    }
  },[user]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...task };
      if (!payload.assignedTo) delete payload.assignedTo;
      if (id) {
        await API.put(`/tasks/${id}`, payload);
      } else {
        await API.post('/tasks', payload);
      }
      navigate('/tasks');
    } catch (err) {
      setErr(err.response?.data?.message || 'Failed');
    }
  };

  return (
    <div style={{maxWidth:640}}>
      <h3 style={{marginTop:0}}>{id ? 'Edit Task' : 'New Task'}</h3>
      {err && <div style={{color:'red', marginBottom:8}}>{err}</div>}
      <form onSubmit={submit}>
        <div style={{marginBottom:8}}>
          <label style={{display:'block'}}>Title</label>
          <input style={{width:'100%', padding:8}} required value={task.title} onChange={e=>setTask({...task, title:e.target.value})}/>
        </div>
        <div style={{marginBottom:8}}>
          <label style={{display:'block'}}>Description</label>
          <textarea style={{width:'100%', padding:8}} value={task.description} onChange={e=>setTask({...task, description:e.target.value})}/>
        </div>
        <div style={{marginBottom:8}}>
          <label style={{display:'block'}}>Due Date</label>
          <input style={{padding:8}} type="date" value={task.dueDate} onChange={e=>setTask({...task, dueDate:e.target.value})}/>
        </div>
        <div style={{marginBottom:8}}>
          <label style={{display:'block'}}>Priority</label>
          <select value={task.priority} onChange={e=>setTask({...task, priority:e.target.value})}>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        {user && user.role === 'admin' && (
          <div style={{marginBottom:8}}>
            <label style={{display:'block'}}>Assign to user</label>
            <select value={task.assignedTo} onChange={e=>setTask({...task, assignedTo:e.target.value})}>
              <option value="">(select user)</option>
              {users.map(u => (
                <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
              ))}
            </select>
          </div>
        )}
        <div>
          <button type="submit" style={{padding:'8px 12px'}}>{id ? 'Save' : 'Create'}</button>
          <button type="button" style={{marginLeft:8}} onClick={()=>navigate('/tasks')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}