"use client";

import React, { useState, useEffect } from 'react';
import portfolioData from '../data/portfolio.json';
import { Upload, Save, FileImage, Plus, Trash2 } from 'lucide-react';

export default function PortfolioManager({ token, setStatus }: { token: string, setStatus: any }) {
  const [items, setItems] = useState<any[]>(portfolioData);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  // New item form state
  const [newFile, setNewFile] = useState<File | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState('Design');
  const [newHealthComm, setNewHealthComm] = useState(false);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let encoded = reader.result?.toString().replace(/^data:(.*,)?/, '') || '';
        if ((encoded.length % 4) > 0) {
          encoded += '='.repeat(4 - (encoded.length % 4));
        }
        resolve(encoded);
      };
      reader.onerror = error => reject(error);
    });
  };

  const uploadFileToGitHub = async (file: File) => {
    const repoPath = 'jcbonnin/creative_portfolio';
    const filePath = `public/media/Uploads/${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const apiUrl = `https://api.github.com/repos/${repoPath}/contents/${filePath}`;
    
    const base64Content = await fileToBase64(file);

    const putResponse = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: `Upload new portfolio media: ${file.name}`,
        content: base64Content,
        branch: 'main'
      })
    });

    if (!putResponse.ok) {
      throw new Error('Failed to upload file to GitHub.');
    }
    
    return `/media/Uploads/${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  };

  const updatePortfolioJson = async (updatedData: any[]) => {
    const repoPath = 'jcbonnin/creative_portfolio';
    const filePath = 'src/data/portfolio.json';
    const apiUrl = `https://api.github.com/repos/${repoPath}/contents/${filePath}`;

    const getResponse = await fetch(apiUrl, {
      headers: { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github.v3+json' }
    });
    const fileData = await getResponse.json();
    
    const newContent = JSON.stringify(updatedData, null, 2);
    const base64Content = btoa(unescape(encodeURIComponent(newContent)));

    const putResponse = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Update portfolio JSON data',
        content: base64Content,
        sha: fileData.sha,
        branch: 'main'
      })
    });

    if (!putResponse.ok) throw new Error('Failed to update portfolio JSON.');
  };

  const handleAddNewItem = async () => {
    if (!token) {
      setStatus({ type: 'error', message: 'GitHub token required.' });
      return;
    }
    if (!newFile) {
      setStatus({ type: 'error', message: 'Please select a file to upload.' });
      return;
    }
    if (!newTitle) {
      setStatus({ type: 'error', message: 'Please provide a title.' });
      return;
    }

    try {
      setStatus({ type: 'loading', message: 'Uploading file to GitHub (this may take a minute)...' });
      const uploadedUrl = await uploadFileToGitHub(newFile);

      setStatus({ type: 'loading', message: 'Updating portfolio database...' });
      
      const fileType = newFile.type.startsWith('video/') ? 'video' : newFile.type.includes('pdf') ? 'document' : 'image';
      
      const newItem = {
        title: newTitle,
        description: newDescription,
        category: newCategory,
        isHealthCommunication: newHealthComm,
        type: 'single',
        items: [{
          id: newFile.name,
          title: newTitle,
          category: newCategory,
          isHealthCommunication: newHealthComm,
          url: uploadedUrl,
          type: fileType,
          originalCategory: 'Uploads'
        }]
      };

      const updatedItems = [newItem, ...items];
      await updatePortfolioJson(updatedItems);
      
      setItems(updatedItems);
      setNewFile(null);
      setNewTitle('');
      setNewDescription('');
      setStatus({ type: 'success', message: 'New item added successfully! Rebuilding site...' });
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message });
    }
  };

  const handleSaveEdits = async () => {
    if (!token) return setStatus({ type: 'error', message: 'GitHub token required.' });
    
    try {
      setStatus({ type: 'loading', message: 'Saving edits to database...' });
      await updatePortfolioJson(items);
      setStatus({ type: 'success', message: 'Edits saved successfully! Rebuilding site...' });
      setEditingItem(null);
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message });
    }
  };

  const handleDelete = async (index: number) => {
    if (!confirm('Are you sure you want to remove this item from the gallery? (The file will remain on GitHub, but will be hidden from the site).')) return;
    
    try {
      setStatus({ type: 'loading', message: 'Deleting item...' });
      const updated = [...items];
      updated.splice(index, 1);
      await updatePortfolioJson(updated);
      setItems(updated);
      setStatus({ type: 'success', message: 'Item removed successfully!' });
    } catch(err: any) {
      setStatus({ type: 'error', message: err.message });
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-4 border-b pb-2 flex items-center gap-2"><Plus size={20}/> Upload New Portfolio Item</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Upload File (Image, Video, or PDF)</label>
              <input type="file" onChange={e => setNewFile(e.target.files?.[0] || null)} className="w-full text-sm bg-white border border-gray-300 rounded p-1.5" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} className="w-full px-3 py-2 border rounded" placeholder="e.g. My Latest Project" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select value={newCategory} onChange={e => setNewCategory(e.target.value)} className="w-full px-3 py-2 border rounded bg-white">
                <option value="Design">Design</option>
                <option value="Video">Video</option>
                <option value="IEC Materials">IEC Materials</option>
              </select>
            </div>
          </div>
          <div className="space-y-4 flex flex-col justify-between">
            <div>
              <label className="block text-sm font-medium mb-1">Caption / Description</label>
              <textarea value={newDescription} onChange={e => setNewDescription(e.target.value)} rows={3} className="w-full px-3 py-2 border rounded" placeholder="Optional description..." />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="hc" checked={newHealthComm} onChange={e => setNewHealthComm(e.target.checked)} className="rounded" />
              <label htmlFor="hc" className="text-sm font-medium">Show in "Health Communication" section</label>
            </div>
            <button onClick={handleAddNewItem} className="w-full flex justify-center items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded font-medium transition-colors">
              <Upload size={18} /> Upload & Add to Site
            </button>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4 border-b pb-2 flex items-center gap-2"><FileImage size={20}/> Edit Existing Captions & Items</h2>
        <p className="text-sm text-gray-500 mb-4">Click any item to edit its title and caption, or permanently remove it.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-2">
          {items.map((item, idx) => (
            <div key={idx} className="border border-gray-200 rounded p-3 bg-gray-50 flex flex-col gap-2">
              {editingItem === idx ? (
                <div className="space-y-2 flex-grow">
                  <input type="text" value={item.title} onChange={e => { const newItems = [...items]; newItems[idx].title = e.target.value; setItems(newItems); }} className="w-full text-sm font-bold px-2 py-1 border rounded" />
                  <textarea value={item.description || ''} onChange={e => { const newItems = [...items]; newItems[idx].description = e.target.value; setItems(newItems); }} className="w-full text-xs px-2 py-1 border rounded" rows={3} placeholder="Caption..." />
                  <select value={item.category} onChange={e => { const newItems = [...items]; newItems[idx].category = e.target.value; setItems(newItems); }} className="w-full text-xs px-2 py-1 border rounded">
                    <option value="Design">Design</option>
                    <option value="Video">Video</option>
                    <option value="IEC Materials">IEC Materials</option>
                  </select>
                  <div className="flex gap-2 pt-2">
                    <button onClick={handleSaveEdits} className="flex-1 bg-blue-600 text-white text-xs py-1.5 rounded font-medium">Save Changes</button>
                    <button onClick={() => setEditingItem(null)} className="flex-1 bg-gray-300 text-gray-800 text-xs py-1.5 rounded font-medium">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-sm leading-tight text-gray-800 line-clamp-2">{item.title}</h3>
                    <span className="text-[10px] bg-gray-200 px-1.5 py-0.5 rounded text-gray-600 whitespace-nowrap ml-2">{item.category}</span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2 flex-grow">{item.description || 'No caption'}</p>
                  <div className="flex gap-2 mt-2 pt-2 border-t border-gray-200">
                    <button onClick={() => setEditingItem(idx)} className="flex-1 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 text-xs py-1 rounded font-medium transition-colors">Edit</button>
                    <button onClick={() => handleDelete(idx)} className="flex-none bg-red-50 text-red-600 hover:bg-red-100 px-2 py-1 rounded transition-colors"><Trash2 size={14}/></button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
