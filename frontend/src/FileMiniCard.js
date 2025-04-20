import React from 'react';
import './FileMiniCard.css';

export default function FileMiniCard({ file, onRemove }) {
  if (!file) return null;
  return (
    <div className="file-mini-card">
      <div className="file-icon">📄</div>
      <div className="file-info">
        <div className="file-name" title={file.name}>{file.name}</div>
        <div className="file-size">{(file.size/1024).toFixed(1)} KB</div>
      </div>
      {onRemove && (
        <button className="file-remove" onClick={onRemove} title="Remove file">✖</button>
      )}
    </div>
  );
}
