import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AnalysisHistory({ onSelect }) {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/analyses').then(res => {
      setAnalyses(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="history-panel">
      <h3 style={{marginBottom: 10}}>🕑 Analysis History</h3>
      {loading ? (
        <div>Loading...</div>
      ) : analyses.length === 0 ? (
        <div>No analyses yet.</div>
      ) : (
        <ul className="history-list">
          {analyses.map(a => (
            <li key={a.id}>
              <button className="history-btn" onClick={() => onSelect(a.id)}>
                <span role="img" aria-label="file">📄</span> {a.filename}
                <span className="history-date">{new Date(a.created_at).toLocaleString()}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
