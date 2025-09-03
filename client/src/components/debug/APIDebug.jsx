import { useState } from 'react';
import Button from '../ui/Button';

const APIDebug = () => {
  const [results, setResults] = useState({});

  const testEndpoints = async () => {
    setResults({ testing: true });
    
    try {
      // Test bugs endpoint
      console.log('Testing /api/bugs...');
      const bugsResponse = await fetch('http://localhost:5000/api/bugs', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      const bugsData = await bugsResponse.json();
      
      // Test stats endpoint
      console.log('Testing /api/bugs/stats...');
      const statsResponse = await fetch('http://localhost:5000/api/bugs/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      const statsData = await statsResponse.json();
      
      setResults({
        bugs: {
          status: bugsResponse.status,
          count: Array.isArray(bugsData) ? bugsData.length : (bugsData.bugs?.length || 0),
          data: bugsData
        },
        stats: {
          status: statsResponse.status,
          data: statsData
        }
      });
      
    } catch (error) {
      setResults({
        error: error.message
      });
    }
  };

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
      <h3 className="font-semibold mb-2">🔧 API Debug Tool</h3>
      <Button onClick={testEndpoints} size="sm" className="mb-3">
        Test API Endpoints
      </Button>
      
      {results.testing && <p>Testing...</p>}
      
      {results.bugs && (
        <div className="mt-2 p-2 bg-white rounded text-sm">
          <strong>Bugs API:</strong>
          <br />Status: {results.bugs.status}
          <br />Count: {results.bugs.count}
          <br />Data: <pre className="text-xs overflow-auto max-h-32">{JSON.stringify(results.bugs.data, null, 2)}</pre>
        </div>
      )}
      
      {results.stats && (
        <div className="mt-2 p-2 bg-white rounded text-sm">
          <strong>Stats API:</strong>
          <br />Status: {results.stats.status}
          <br />Data: <pre className="text-xs overflow-auto max-h-32">{JSON.stringify(results.stats.data, null, 2)}</pre>
        </div>
      )}
      
      {results.error && (
        <div className="mt-2 p-2 bg-red-100 rounded text-sm">
          <strong>Error:</strong> {results.error}
        </div>
      )}
    </div>
  );
};

export default APIDebug;
