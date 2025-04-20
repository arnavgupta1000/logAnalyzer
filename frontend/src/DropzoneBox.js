import React from 'react';
import { useDropzone } from 'react-dropzone';
import './DropzoneBox.css';

export default function DropzoneBox({ onFileAccepted, isUploading }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    accept: {
      'text/plain': ['.log', '.txt'],
    },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onFileAccepted(acceptedFiles[0]);
      }
    },
  });

  return (
    <div {...getRootProps()} className={`dropzone-box${isDragActive ? ' active' : ''}${isUploading ? ' uploading' : ''}`}>
      <input {...getInputProps()} />
      {isUploading ? (
        <div className="dz-uploading">Uploading...</div>
      ) : isDragActive ? (
        <div className="dz-drag">Drop the log file here...</div>
      ) : (
        <div className="dz-prompt">
          <span role="img" aria-label="upload">📂</span> Drag & drop a log file here, or click to select
        </div>
      )}
    </div>
  );
}
