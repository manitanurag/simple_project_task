import React, { useEffect, useState } from 'react';
import API from '../api';
import { useParams, useNavigate } from 'react-router-dom';

export default function TaskDetail(){
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const navigate = useNavigate();

  useEffect(()=> {
    API.get(`/tasks/${id}`).then(res => setTask(res.data)).catch(err => {
      console.error(err);
      if (err.response?.status === 401) navigate('/login');
    });
  }, [id]);

  if (!task) return <div>Loading...</div>;

  return (
    <div style={{maxWidth:720}}>
      <h3 style={{marginTop:0}}>{task.title}</h3>
      <div style={{marginBottom:8}}><strong>Description:</strong></div>
      <div style={{whiteSpace:'pre-wrap', marginBottom:8}}>{task.description || '-'}</div>
      <div style={{marginBottom:4}}><strong>Due:</strong> {task.dueDate ? new Date(task.dueDate).toLocaleString() : 'N/A'}</div>
      <div style={{marginBottom:4}}><strong>Status:</strong> {task.status}</div>
      <div style={{marginBottom:4}}><strong>Priority:</strong> {task.priority}</div>
      <div style={{marginBottom:8}}><strong>Assigned to:</strong> {task.assignedTo ? task.assignedTo.name : 'Unassigned'}</div>
      <div>
        <button onClick={()=>navigate(`/tasks/${id}/edit`)} style={{marginRight:8}}>Edit</button>
        <button onClick={()=>navigator.clipboard.writeText(window.location.href)}>Copy Link</button>
      </div>
    </div>
  );
}