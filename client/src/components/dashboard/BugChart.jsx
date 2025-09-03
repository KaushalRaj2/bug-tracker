import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import Card from '../ui/Card';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const BugChart = ({ 
  type = 'bar', 
  data = {}, 
  title,
  className = '',
  height = 300 
}) => {
  const getSafeNumber = (value) => {
    const num = Number(value);
    return isNaN(num) || num < 0 ? 0 : num;
  };

  const overview = data.overview || {};

  const chartData = useMemo(() => {
    if (type === 'status') {
      return {
        labels: ['Open', 'In Progress', 'Testing', 'Closed'],
        datasets: [
          {
            label: 'Bug Count',
            data: [
              getSafeNumber(overview.open),
              getSafeNumber(overview.inProgress),
              getSafeNumber(overview.testing),
              getSafeNumber(overview.closed)
            ],
            backgroundColor: [
              'rgba(59, 130, 246, 0.8)',
              'rgba(245, 158, 11, 0.8)',
              'rgba(139, 92, 246, 0.8)',
              'rgba(34, 197, 94, 0.8)'
            ],
            borderColor: [
              'rgb(59, 130, 246)',
              'rgb(245, 158, 11)',
              'rgb(139, 92, 246)',
              'rgb(34, 197, 94)'
            ],
            borderWidth: 2
          }
        ]
      };
    }

    if (type === 'priority') {
      return {
        labels: ['Critical', 'High', 'Medium', 'Low'],
        datasets: [
          {
            data: [
              getSafeNumber(overview.critical),
              getSafeNumber(overview.high),
              getSafeNumber(overview.medium),
              getSafeNumber(overview.low)
            ],
            backgroundColor: [
              'rgba(239, 68, 68, 0.8)',
              'rgba(245, 158, 11, 0.8)',
              'rgba(59, 130, 246, 0.8)',
              'rgba(107, 114, 128, 0.8)'
            ],
            borderColor: [
              'rgb(239, 68, 68)',
              'rgb(245, 158, 11)',
              'rgb(59, 130, 246)',
              'rgb(107, 114, 128)'
            ],
            borderWidth: 2
          }
        ]
      };
    }

    if (type === 'trend') {
      // Mock trend data - in real app, this would come from API
      const trendData = data.trendData || {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        created: [12, 19, 15, 25, 22, 18],
        resolved: [8, 15, 12, 20, 18, 16]
      };

      return {
        labels: trendData.labels,
        datasets: [
          {
            label: 'Bugs Created',
            data: trendData.created,
            borderColor: 'rgb(239, 68, 68)',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            tension: 0.1
          },
          {
            label: 'Bugs Resolved',
            data: trendData.resolved,
            borderColor: 'rgb(34, 197, 94)',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            tension: 0.1
          }
        ]
      };
    }

    return { labels: [], datasets: [] };
  }, [type, overview, data]);

  const options = useMemo(() => {
    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: type === 'priority' ? 'bottom' : 'top',
          labels: {
            usePointStyle: type === 'priority',
            padding: 20
          }
        }
      }
    };

    if (type === 'status' || type === 'trend') {
      return {
        ...baseOptions,
        scales: {
          x: {
            grid: {
              display: false
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              callback: function(value) {
                if (Number.isInteger(value)) {
                  return value;
                }
              }
            }
          }
        }
      };
    }

    return baseOptions;
  }, [type]);

  const hasData = useMemo(() => {
    return chartData.datasets.some(dataset => 
      dataset.data && dataset.data.some(value => value > 0)
    );
  }, [chartData]);

  const renderChart = () => {
    if (type === 'status') {
      return <Bar data={chartData} options={options} />;
    }
    if (type === 'priority') {
      return <Doughnut data={chartData} options={options} />;
    }
    if (type === 'trend') {
      return <Line data={chartData} options={options} />;
    }
    return null;
  };

  const getDefaultTitle = () => {
    if (type === 'status') return 'Bug Status Distribution';
    if (type === 'priority') return 'Bugs by Priority';
    if (type === 'trend') return 'Bug Trends';
    return 'Bug Chart';
  };

  return (
    <Card className={className}>
      <Card.Header>
        <Card.Title>{title || getDefaultTitle()}</Card.Title>
      </Card.Header>
      <Card.Content>
        <div style={{ height: `${height}px`, position: 'relative' }}>
          {hasData ? (
            renderChart()
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
              <div className="text-center">
                <div className="text-4xl mb-2">
                  {type === 'priority' ? '🍩' : '📊'}
                </div>
                <p className="font-medium">No data available</p>
                <p className="text-sm mt-1">
                  {type === 'priority' 
                    ? 'Add bugs with priorities to see the chart'
                    : 'Add some bugs to see the chart'
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </Card.Content>
    </Card>
  );
};

export default BugChart;
