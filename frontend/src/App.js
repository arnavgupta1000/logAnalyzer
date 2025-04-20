import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import './SimpleModernUI.css';
import DropzoneBox from './DropzoneBox';
import FileMiniCard from './FileMiniCard';
import './FileMiniCard.css';
import AnalysisHistory from './AnalysisHistory';
import './AnalysisHistory.css';
import BetterChart from './BetterChart';
import './BetterChart.css';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, Legend);

function App() {
  // ...
  const [summary, setSummary] = useState('');
  const [parts, setParts] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [historyKey, setHistoryKey] = useState(0); // for refresh


  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      const res = await axios.post('/api/upload', formData);
      setHistoryKey(k => k + 1); // refresh history
      setSummary(res.data.summary);
      setParts(res.data.parts);

      // Prepare chart data (e.g., count error types in tooltips)
      const errorCounts = {};
      res.data.parts.forEach(part => {
        if (part.type_of_error) {
          errorCounts[part.type_of_error] = (errorCounts[part.type_of_error] || 0) + 1;
        } else {
          const key = part.tooltip.split(':')[0];
          errorCounts[key] = (errorCounts[key] || 0) + 1;
        }
      });
      setChartData({
        labels: Object.keys(errorCounts),
        datasets: [
          {
            label: 'Error Frequency',
            data: Object.values(errorCounts),
            backgroundColor: [
              '#3a7bd5', '#00d2ff', '#f7971e', '#f44336', '#8e54e9', '#43cea2', '#fc354c', '#292E49', '#11998e', '#38ef7d'
            ],
          },
        ],
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileAccepted = (file) => {
    setSelectedFile(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setSummary("");
    setParts([]);
    setChartData(null);
  };

  return (
    <div style={{display: 'flex', gap: 36}}>
      <div style={{minWidth: 340}}>
        <AnalysisHistory key={historyKey} onSelect={async (id) => {
          const res = await axios.get(`/api/analyses/${id}`);
          setSummary(res.data.summary);
          setParts(res.data.parts);
          setSelectedFile(null);
          setChartData(() => {
            // Prepare chart data (e.g., count error types in tooltips)
            const errorCounts = {};
            (res.data.parts || []).forEach(part => {
              if (part.type_of_error) {
                errorCounts[part.type_of_error] = (errorCounts[part.type_of_error] || 0) + 1;
              } else {
                const key = part.tooltip.split(':')[0];
                errorCounts[key] = (errorCounts[key] || 0) + 1;
              }
            });
            return {
              labels: Object.keys(errorCounts),
              datasets: [
                {
                  label: 'Error Frequency',
                  data: Object.values(errorCounts),
                  backgroundColor: [
                    '#3a7bd5', '#00d2ff', '#f7971e', '#f44336', '#8e54e9', '#43cea2', '#fc354c', '#292E49', '#11998e', '#38ef7d'
                  ],
                },
              ],
            };
          });
        }} />
      </div>
      <div className="app-container" style={{marginTop: 20, marginBottom: 20}}>
        <h1 style={{marginBottom: 28, fontSize: '2.4rem', letterSpacing: '0.5px'}}>📘 Log Analyzer</h1>
        <div className="upload-section" style={{flexDirection: 'column', alignItems: 'flex-start', marginBottom: 30}}>
          <DropzoneBox onFileAccepted={handleFileAccepted} isUploading={isUploading} />
          {selectedFile && (
            <FileMiniCard file={selectedFile} onRemove={handleRemoveFile} />
          )}
          <button
            type="button"
            className="analyze-btn"
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
            style={{marginLeft: 0, marginTop: 8, opacity: !selectedFile || isUploading ? 0.6 : 1, minWidth: 120}}
          >
            {isUploading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
        <div className="summary-section" style={{marginBottom: 26}}>
          <h2>🧠 Summary</h2>
          <p style={{fontSize:'1.13rem', background:'#f3f7fa', borderRadius:10, padding:'16px 18px'}}>{summary}</p>
        </div>
        <div className="parts-section" style={{marginBottom: 26}}>
          <h2>📌 Parts</h2>
          <ul className="parts-list">
            {parts.map((part, idx) => (
              <li key={idx}>
                <span style={{textDecoration: 'underline dotted', cursor: 'pointer'}}>
                  {part.summary_start_index !== undefined && part.summary_end_index !== undefined
                    ? summary.slice(part.summary_start_index, part.summary_end_index)
                    : `Part ${idx+1}`}
                  <span className="tooltip">{part.tooltip}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <BetterChart data={chartData} />
      </div>
    </div>
  );
}

export default App;
