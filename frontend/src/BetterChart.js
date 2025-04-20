import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function BetterChart({ data }) {
  if (!data || !data.labels || data.labels.length === 0) {
    return <div style={{color:'#888',padding:'20px'}}>No chart data to display.</div>;
  }

  return (
    <div className="better-chart-container revamped-chart">
      <Bar
        data={data}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top',
              labels: {
                font: { size: 18, family: 'Segoe UI, Arial', weight: 'bold' },
                color: '#2d4a7a',
                padding: 16,
              },
            },
            title: {
              display: true,
              text: 'Error/Info Frequency',
              font: { size: 28, family: 'Segoe UI, Arial', weight: 'bold' },
              color: '#2d4a7a',
              padding: {top: 20, bottom: 30},
            },
            tooltip: {
              enabled: true,
              backgroundColor: '#2d4a7a',
              titleColor: '#fff',
              bodyColor: '#fff',
              borderColor: '#00d2ff',
              borderWidth: 2,
              caretSize: 10,
              padding: 16,
              displayColors: true,
              callbacks: {
                title: function(context) {
                  return context[0].label || '';
                },
                label: function(context) {
                  let label = context.dataset.label || '';
                  if (label) label += ': ';
                  label += context.parsed.y !== undefined ? context.parsed.y : context.parsed;
                  return label;
                }
              },
              bodyFont: { size: 18, family: 'Segoe UI, Arial' },
              titleFont: { size: 20, family: 'Segoe UI, Arial', weight: 'bold' },
              boxPadding: 10,
              cornerRadius: 12,
              caretPadding: 10,
              rtl: false,
              textDirection: 'ltr',
              multiKeyBackground: '#00d2ff',
            },
            datalabels: {
              display: true,
              color: '#222',
              anchor: 'end',
              align: 'top',
              font: {
                size: 16,
                weight: 'bold',
                family: 'Segoe UI, Arial'
              },
              formatter: function(value) {
                return value;
              }
            }
          },
          scales: {
            x: {
              ticks: { color: '#2d4a7a', font: {size: 16, weight: 'bold'} },
              grid: { color: '#e0eafc' },
              title: {
                display: true,
                text: 'Category',
                color: '#2d4a7a',
                font: { size: 18, weight: 'bold' },
                padding: {top: 10}
              }
            },
            y: {
              beginAtZero: true,
              ticks: { color: '#2d4a7a', font: {size: 16, weight: 'bold'} },
              grid: { color: '#e0eafc' },
              title: {
                display: true,
                text: 'Count',
                color: '#2d4a7a',
                font: { size: 18, weight: 'bold' },
                padding: {right: 10}
              }
            },
          },
        }}
        height={420}
      />
    </div>
  );
}
