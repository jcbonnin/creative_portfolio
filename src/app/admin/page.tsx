"use client";

import React, { useState, useEffect } from 'react';
import configData from '../../data/config.json';
import { Save, Lock, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import PortfolioManager from '../../components/PortfolioManager';

export default function AdminPage() {
  const [token, setToken] = useState('');
  const [config, setConfig] = useState(configData);
  const [status, setStatus] = useState<{type: 'idle' | 'loading' | 'success' | 'error', message: string}>({ type: 'idle', message: '' });

  useEffect(() => {
    const savedToken = localStorage.getItem('github_token');
    if (savedToken) setToken(savedToken);
  }, []);

  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setToken(e.target.value);
    localStorage.setItem('github_token', e.target.value);
  };

  const handleConfigChange = (field: string, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const saveToGitHub = async () => {
    if (!token) {
      setStatus({ type: 'error', message: 'Please provide a GitHub Personal Access Token.' });
      return;
    }

    setStatus({ type: 'loading', message: 'Saving to GitHub...' });

    try {
      const repoPath = 'jcbonnin/creative_portfolio';
      const filePath = 'src/data/config.json';
      const apiUrl = `https://api.github.com/repos/${repoPath}/contents/${filePath}`;

      const getResponse = await fetch(apiUrl, {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!getResponse.ok) throw new Error('Failed to fetch current file from GitHub. Check your token permissions.');

      const fileData = await getResponse.json();
      const newContent = JSON.stringify(config, null, 2);
      const base64Content = btoa(unescape(encodeURIComponent(newContent)));

      const putResponse = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: 'Update config.json via Admin Dashboard',
          content: base64Content,
          sha: fileData.sha,
          branch: 'main'
        })
      });

      if (!putResponse.ok) throw new Error('Failed to commit changes to GitHub.');

      setStatus({ type: 'success', message: 'Successfully saved! Vercel will rebuild the site in ~45 seconds.' });
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'An unknown error occurred.' });
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold">Site Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your portfolio content directly from the browser.</p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <Lock size={18} /> Authentication
        </h2>
        <p className="text-sm text-blue-800 mb-4">
          To save changes directly to your live website, you need a GitHub Personal Access Token (Classic) with the <strong>repo</strong> scope checked, or a Fine-grained token with <strong>Contents: Read and write</strong>.
        </p>
        <input 
          type="password" 
          value={token}
          onChange={handleTokenChange}
          placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxx"
          className="w-full px-4 py-2 rounded border border-blue-300 focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono text-sm"
        />
      </div>

      {status.type !== 'idle' && (
        <div className={`p-4 rounded-lg flex items-center gap-2 ${status.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
          {status.type === 'error' && <AlertCircle size={20}/>}
          {status.type === 'success' && <CheckCircle size={20}/>}
          {status.type === 'loading' && <RefreshCw size={20} className="animate-spin"/>}
          <span className="font-medium">{status.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Config */}
        <div className="lg:col-span-1 bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-6 h-fit">
          <h2 className="text-xl font-semibold mb-2">Homepage Texts</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input type="text" value={config.name} onChange={(e) => handleConfigChange('name', e.target.value)} className="w-full px-3 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Professional Role</label>
            <input type="text" value={config.role} onChange={(e) => handleConfigChange('role', e.target.value)} className="w-full px-3 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Biography</label>
            <textarea value={config.bio} onChange={(e) => handleConfigChange('bio', e.target.value)} rows={6} className="w-full px-3 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={config.email} onChange={(e) => handleConfigChange('email', e.target.value)} className="w-full px-3 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
            <input type="url" value={config.linkedin} onChange={(e) => handleConfigChange('linkedin', e.target.value)} className="w-full px-3 py-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500" />
          </div>

          <button onClick={saveToGitHub} disabled={status.type === 'loading'} className="w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 rounded-md font-medium transition-colors">
            <Save size={18} /> Save Homepage Texts
          </button>
        </div>

        {/* Right Column: Portfolio Manager */}
        <div className="lg:col-span-2">
          <PortfolioManager token={token} setStatus={setStatus} />
        </div>
      </div>
    </div>
  );
}
