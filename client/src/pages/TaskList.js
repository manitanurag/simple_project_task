import React, { useEffect, useState } from 'react';
import API from '../api';
import { Link, useNavigate } from 'react-router-dom';
import PriorityBoard from '../components/PriorityBoard';

export default function TaskList(){
  const [tasksData,setTasksData]=useState({tasks:[], total:0, page:1, pages:1});
  const [page,setPage]=useState(1);
  const [limit] = useState(8);
  const [loading,setLoading]=useState(false);
  const navigate = useNavigate();

  const fetchTasks = async (p=1) => {
    setLoading(true);
    try {
      const res = await API.get('/tasks', { params: { page: p, limit } });
      setTasksData(res.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) navigate('/login');
    }
    setLoading(false);
  };

  useEffect(()=> { fetchTasks(page); }, [page]);

  const deleteTask = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await API.delete(`/tasks/${id}`);
      fetchTasks(page);
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  };

  const toggleComplete = async (task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      await API.patch(`/tasks/${task._id}/status`, { status: newStatus });
      fetchTasks(page);
    } catch (err) {
      console.error(err);
      alert('Update failed');
    }
  };

  return (
    <div>
      <h3>My Tasks</h3>
      <PriorityBoard tasks={tasksData.tasks} onMove={() => fetchTasks(page)} />
      <div style={{marginTop:16}}>
        <h4>Tasks (page {tasksData.page} of {tasksData.pages})</h4>
        {loading ? <div>Loading...</div> : (
          <>
            <table style={{width:'100%', borderCollapse:'collapse'}}>
              <thead>
                <tr style={{textAlign:'left', borderBottom:'1px solid #ddd'}}>
                  <th style={{padding:6}}>Title</th>
                  <th style={{padding:6}}>Due</th>
                  <th style={{padding:6}}>Status</th>
                  <th style={{padding:6}}>Priority</th>
                  <th style={{padding:6}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasksData.tasks.map(t => (
                  <tr key={t._id} style={{borderBottom:'1px solid #f0f0f0'}}>
                    <td style={{padding:6}}><Link to={`/tasks/${t._id}`}>{t.title}</Link></td>
                    <td style={{padding:6}}>{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '-'}</td>
                    <td style={{padding:6}}>{t.status}</td>
                    <td style={{padding:6}}>{t.priority}</td>
                    <td style={{padding:6}}>
                      <button onClick={()=>toggleComplete(t)} style={{marginRight:6}}>{t.status==='completed' ? 'Undo' : 'Complete'}</button>
                      <button onClick={()=>navigate(`/tasks/${t._id}/edit`)} style={{marginRight:6}}>Edit</button>
                      <button onClick={()=>deleteTask(t._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{marginTop:12, display:'flex', alignItems:'center', gap:8}}>
              <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}>Prev</button>
              <div>Page {tasksData.page} / {tasksData.pages}</div>
              <button onClick={()=>setPage(p=>Math.min(tasksData.pages,p+1))} disabled={page===tasksData.pages}>Next</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
