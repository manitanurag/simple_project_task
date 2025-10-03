import React, { useEffect, useState } from 'react';
import API from '../api';
import { Link, useNavigate } from 'react-router-dom';
import PriorityBoard from '../components/PriorityBoard';

export default function TaskList(){
  const [tasksData,setTasksData]=useState({tasks:[], total:0, page:1, pages:1});
  const [page,setPage]=useState(1);
  const [limit,setLimit] = useState(8);
  const [loading,setLoading]=useState(false);
  const navigate = useNavigate();

  const fetchTasks = async (p=1, l=limit) => {
    setLoading(true);
    try {
      const res = await API.get('/tasks/mine', { params: { page: p, limit: l } });
      setTasksData(res.data);
      setPage(res.data.page || p);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) navigate('/login');
    }
    setLoading(false);
  };

  useEffect(()=> { fetchTasks(page, limit); }, [page, limit]);

  const deleteTask = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await API.delete(`/tasks/${id}`);
      // refetch, adjust page if last item deleted
      const newTotal = tasksData.total - 1;
      const newPages = Math.max(1, Math.ceil(newTotal / limit));
      const newPage = Math.min(page, newPages);
      fetchTasks(newPage, limit);
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  };

  const toggleComplete = async (task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      await API.patch(`/tasks/${task._id}/status`, { status: newStatus });
      fetchTasks(page, limit);
    } catch (err) {
      console.error(err);
      alert('Update failed');
    }
  };

  const changeLimit = (e) => {
    const l = parseInt(e.target.value, 10);
    setLimit(l);
    setPage(1);
  };

  const renderPageNumbers = () => {
    const pages = tasksData.pages || 1;
    const current = tasksData.page || page;
    const visible = 5;
    let start = Math.max(1, current - Math.floor(visible/2));
    let end = Math.min(pages, start + visible - 1);
    if (end - start + 1 < visible) start = Math.max(1, end - visible + 1);
    const items = [];
    for (let i = start; i <= end; i++){
      items.push(
        <button key={i} onClick={()=>setPage(i)} disabled={i===current} style={{marginRight:6, padding:'6px 8px', background:i===current ? '#ddd' : '#fff'}}>{i}</button>
      );
    }
    return items;
  };

  return (
    <div>
      <h3>My Tasks</h3>
      <PriorityBoard tasks={tasksData.tasks} onMove={() => fetchTasks(page, limit)} />
      <div style={{marginTop:16}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <h4 style={{margin:0}}>Tasks</h4>
          <div style={{display:'flex', gap:8, alignItems:'center'}}>
            <label style={{fontSize:13}}>Per page:</label>
            <select value={limit} onChange={changeLimit}>
              <option value={5}>5</option>
              <option value={8}>8</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>

        {loading ? <div>Loading...</div> : (
          <>
            <table style={{width:'100%', borderCollapse:'collapse', marginTop:8}}>
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
                {tasksData.tasks.length === 0 && (
                  <tr><td colSpan={5} style={{padding:12}}>No tasks found.</td></tr>
                )}
              </tbody>
            </table>

            <div style={{marginTop:12, display:'flex', alignItems:'center', gap:8}}>
              <button onClick={()=>setPage(1)} disabled={page===1}>First</button>
              <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}>Prev</button>
              <div>{renderPageNumbers()}</div>
              <button onClick={()=>setPage(p=>Math.min(tasksData.pages || 1, p+1))} disabled={page===tasksData.pages}>Next</button>
              <button onClick={()=>setPage(tasksData.pages || 1)} disabled={page===tasksData.pages}>Last</button>
              <div style={{marginLeft:12}}>Total: {tasksData.total}</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}