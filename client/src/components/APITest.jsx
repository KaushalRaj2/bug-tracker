import { useState } from 'react';
import Button from './ui/Button';

const APITest = () => {
  const [result, setResult] = useState('');

  const testConnection = async () => {
    setResult('Testing...');
    
    try {
      // Test direct fetch to backend
      const response = await fetch('http://localhost:5000/api/bugs/stats', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setResult(`✅ Success! Received: ${JSON.stringify(data)}`);
      
    } catch (error) {
      setResult(`❌ Error: ${error.message}`);
    }
  };

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h3 className="font-semibold mb-2">🔧 API Connection Test</h3>
      <Button onClick={testConnection} size="sm">
        Test Backend Connection
      </Button>
      {result && (
        <div className="mt-2 p-2 bg-white rounded text-sm font-mono">
          {result}
        </div>
      )}
    </div>
  );
};

export default APITest;
