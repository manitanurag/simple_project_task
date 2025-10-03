import React, { useEffect, useState } from 'react';
import API from '../api';
import { useNavigate, useParams } from 'react-router-dom';

export default function TaskForm(){
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState({ title:'', description:'', dueDate:'', priority:'medium' });
  const [err, setErr] = useState('');

  useEffect(()=> {
    if (!id) return;
    API.get(`/tasks/${id}`).then(res => {
      const t = res.data;
      setTask({
        title: t.title,
        description: t.description || '',
        dueDate: t.dueDate ? new Date(t.dueDate).toISOString().slice(0,10) : '',
        priority: t.priority || 'medium'
      });
    }).catch(err => {
      console.error(err);
    });
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await API.put(`/tasks/${id}`, task);
      } else {
        await API.post('/tasks', task);
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
        <div>
          <button type="submit" style={{padding:'8px 12px'}}>{id ? 'Save' : 'Create'}</button>
          <button type="button" style={{marginLeft:8}} onClick={()=>navigate('/tasks')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
