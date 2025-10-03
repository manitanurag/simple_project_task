import React from 'react';
import API from '../api';

const colors = {
  urgent: '#ffb3b3',
  high: '#ffd2a8',
  medium: '#fff2cc',
  low: '#e9f7e9'
};

export default function PriorityBoard({ tasks = [], onMove = () => {} }){
  const groups = { urgent: [], high: [], medium: [], low: [] };
  tasks.forEach(t => {
    groups[t.priority || 'medium'].push(t);
  });

  const changePriority = async (taskId, priority) => {
    try {
      await API.put(`/tasks/${taskId}`, { priority });
      onMove();
    } catch (err) {
      console.error(err);
      alert('Could not change priority');
    }
  };

  return (
    <div style={{display:'flex', gap:8, marginTop:8}}>
      {['urgent','high','medium','low'].map(key => (
        <div key={key} style={{flex:1, padding:8, border:'1px solid #e6e6e6', background:colors[key]}}>
          <div style={{fontSize:13, fontWeight:600, marginBottom:6}}>{key.toUpperCase()} ({groups[key].length})</div>
          <div>
            {groups[key].map(t => (
              <div key={t._id} style={{padding:6, marginBottom:6, background:'#fff', border:'1px solid #eee'}}>
                <div style={{fontSize:14, fontWeight:500}}>{t.title}</div>
                <div style={{fontSize:12, color:'#444'}}>{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'No due date'}</div>
                <div style={{marginTop:6}}>
                  <select value={t.priority || 'medium'} onChange={e => changePriority(t._id, e.target.value)}>
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>
            ))}
            {groups[key].length === 0 && <div style={{fontSize:13, color:'#666'}}>No tasks</div>}
          </div>
        </div>
      ))}
    </div>
  );
}