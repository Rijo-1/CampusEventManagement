import React from 'react';
import { useAuthContext } from '../context/AuthContext';

const TestPage: React.FC = () => {
  const { user, loading } = useAuthContext();
  
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-4">Test Page</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
        <div className="space-y-4">
          <div>
            <p className="font-medium">Loading State:</p>
            <pre className="bg-gray-100 p-2 rounded">
              {JSON.stringify({ loading }, null, 2)}
            </pre>
          </div>
          <div>
            <p className="font-medium">User:</p>
            <pre className="bg-gray-100 p-2 rounded overflow-x-auto">
              {JSON.stringify(user, null, 2) || 'Not logged in'}
            </pre>
          </div>
          <div>
            <p className="font-medium">Environment:</p>
            <pre className="bg-gray-100 p-2 rounded">
              {JSON.stringify({
                nodeEnv: import.meta.env.MODE,
                supabaseUrl: import.meta.env.VITE_SUPABASE_URL ? 'Set' : 'Not set',
                supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Not set'
              }, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
