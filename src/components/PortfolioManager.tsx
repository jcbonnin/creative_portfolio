"use client";

import React, { useState, useMemo } from 'react';
import portfolioData from '../data/portfolio.json';
import { Upload, Save, FileImage, Plus, Trash2, Search, X, Check, Activity } from 'lucide-react';

export default function PortfolioManager({ token, setStatus }: { token: string, setStatus: any }) {
  const [items, setItems] = useState<any[]>(portfolioData);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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
    if (!token) return setStatus({ type: 'error', message: 'GitHub token required.' });
    if (!newFile) return setStatus({ type: 'error', message: 'Please select a file to upload.' });
    if (!newTitle) return setStatus({ type: 'error', message: 'Please provide a title.' });

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
      setNewHealthComm(false);
      setStatus({ type: 'success', message: 'New item added successfully! Rebuilding site...' });
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message });
    }
  };

  const handleSaveEdits = async () => {
    if (!token) return setStatus({ type: 'error', message: 'GitHub token required.' });
    if (editingIndex === null || !editDraft) return;
    
    try {
      setStatus({ type: 'loading', message: 'Saving edits to database...' });
      const updated = [...items];
      updated[editingIndex] = editDraft;
      
      // Sync internal items array if it's a single item gallery
      if (updated[editingIndex].items && updated[editingIndex].items.length === 1) {
        updated[editingIndex].items[0].title = editDraft.title;
        updated[editingIndex].items[0].category = editDraft.category;
        updated[editingIndex].items[0].isHealthCommunication = editDraft.isHealthCommunication;
      }
      
      await updatePortfolioJson(updated);
      setItems(updated);
      setStatus({ type: 'success', message: 'Edits saved successfully! Rebuilding site...' });
      setEditingIndex(null);
      setEditDraft(null);
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message });
    }
  };

  const handleDelete = async (index: number) => {
    if (!confirm('Are you sure you want to completely remove this item from the gallery?')) return;
    
    try {
      setStatus({ type: 'loading', message: 'Deleting item...' });
      const updated = [...items];
      updated.splice(index, 1);
      await updatePortfolioJson(updated);
      setItems(updated);
      setStatus({ type: 'success', message: 'Item removed successfully!' });
      if (editingIndex === index) {
        setEditingIndex(null);
        setEditDraft(null);
      }
    } catch(err: any) {
      setStatus({ type: 'error', message: err.message });
    }
  };

  const filteredItems = useMemo(() => {
    if (!searchQuery) return items.map((item, originalIndex) => ({ ...item, originalIndex }));
    const lowerQ = searchQuery.toLowerCase();
    return items
      .map((item, originalIndex) => ({ ...item, originalIndex }))
      .filter(item => 
        item.title?.toLowerCase().includes(lowerQ) || 
        item.description?.toLowerCase().includes(lowerQ) ||
        item.category?.toLowerCase().includes(lowerQ)
      );
  }, [items, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Upload Section */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="bg-emerald-50/50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-emerald-900 flex items-center gap-2"><Plus size={18}/> Add New Portfolio Item</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-700">Upload Media File</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50 text-center hover:bg-gray-100 transition-colors">
                  <input type="file" onChange={e => setNewFile(e.target.files?.[0] || null)} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-700">Display Title</label>
                <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500" placeholder="e.g. 2024 Campaign Poster" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5 text-gray-700">Category</label>
                <select value={newCategory} onChange={e => setNewCategory(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 bg-white">
                  <option value="Design">Design</option>
                  <option value="Video">Video</option>
                  <option value="IEC Materials">IEC Materials</option>
                </select>
              </div>
            </div>
            <div className="space-y-4 flex flex-col">
              <div className="flex-grow">
                <label className="block text-sm font-medium mb-1.5 text-gray-700">Caption / Description</label>
                <textarea value={newDescription} onChange={e => setNewDescription(e.target.value)} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500" placeholder="Describe this project..." />
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-blue-50/50 border border-blue-100 rounded-md">
                <input type="checkbox" id="hc_new" checked={newHealthComm} onChange={e => setNewHealthComm(e.target.checked)} className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500 cursor-pointer" />
                <label htmlFor="hc_new" className="text-sm font-medium text-blue-900 cursor-pointer select-none flex items-center gap-1.5">
                  <Activity size={16} className="text-blue-600"/> Display in Health Communication Page
                </label>
              </div>

              <button onClick={handleAddNewItem} className="w-full mt-2 flex justify-center items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-md font-medium transition-colors shadow-sm">
                <Upload size={18} /> Upload to Portfolio
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Editor Section */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col h-[700px]">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2"><FileImage size={18}/> Portfolio Content Manager</h2>
            <p className="text-sm text-gray-500 mt-1">Select any item below to edit its details or remove it.</p>
          </div>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search items..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm w-full sm:w-64 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {filteredItems.map((item) => {
              const isEditing = editingIndex === item.originalIndex;
              const draft = isEditing ? editDraft : item;

              return (
                <div key={item.originalIndex} className={`border rounded-lg flex flex-col transition-all duration-200 ${isEditing ? 'border-blue-400 shadow-md bg-blue-50/10 ring-1 ring-blue-400' : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'}`}>
                  
                  {isEditing ? (
                    <div className="p-4 space-y-3 flex-grow flex flex-col">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Editing Item</span>
                        <button onClick={() => { setEditingIndex(null); setEditDraft(null); }} className="text-gray-400 hover:text-gray-600"><X size={16}/></button>
                      </div>
                      
                      <div>
                        <label className="text-[10px] font-semibold text-gray-500 uppercase">Title</label>
                        <input type="text" value={draft.title} onChange={e => setEditDraft({...draft, title: e.target.value})} className="w-full text-sm font-medium px-2 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none" />
                      </div>
                      
                      <div className="flex-grow">
                        <label className="text-[10px] font-semibold text-gray-500 uppercase">Caption</label>
                        <textarea value={draft.description || ''} onChange={e => setEditDraft({...draft, description: e.target.value})} className="w-full text-xs px-2 py-1.5 border border-gray-300 rounded resize-none focus:ring-1 focus:ring-blue-500 outline-none" rows={3} placeholder="No caption..." />
                      </div>
                      
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="text-[10px] font-semibold text-gray-500 uppercase">Category</label>
                          <select value={draft.category} onChange={e => setEditDraft({...draft, category: e.target.value})} className="w-full text-xs px-2 py-1.5 border border-gray-300 rounded bg-white focus:ring-1 focus:ring-blue-500 outline-none">
                            <option value="Design">Design</option>
                            <option value="Video">Video</option>
                            <option value="IEC Materials">IEC Materials</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1 pb-2 border-b border-gray-100">
                        <input type="checkbox" id={`edit-hc-${item.originalIndex}`} checked={draft.isHealthCommunication || false} onChange={e => setEditDraft({...draft, isHealthCommunication: e.target.checked})} className="rounded text-blue-600 w-3.5 h-3.5 cursor-pointer" />
                        <label htmlFor={`edit-hc-${item.originalIndex}`} className="text-xs font-medium text-gray-700 cursor-pointer">Health Comm Tag</label>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button onClick={handleSaveEdits} className="flex-1 flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs py-2 rounded-md font-medium transition-colors"><Check size={14}/> Save</button>
                        <button onClick={() => handleDelete(item.originalIndex)} className="flex-none bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-md transition-colors" title="Delete Item"><Trash2 size={14}/></button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 flex flex-col h-full cursor-pointer group" onClick={() => { setEditingIndex(item.originalIndex); setEditDraft(JSON.parse(JSON.stringify(item))); }}>
                      <div className="flex justify-between items-start mb-2 gap-2">
                        <h3 className="font-bold text-sm leading-tight text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">{item.title}</h3>
                        <span className="text-[10px] font-semibold bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 whitespace-nowrap border border-gray-200">{item.category}</span>
                      </div>
                      
                      <p className="text-xs text-gray-500 line-clamp-3 flex-grow mb-3">{item.description || <span className="italic text-gray-400">No caption provided</span>}</p>
                      
                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-1.5">
                          {item.isHealthCommunication ? (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full ring-1 ring-emerald-500/30"><Activity size={10}/> Health Comm</span>
                          ) : (
                            <span className="text-[10px] text-gray-400">Standard</span>
                          )}
                          {item.type === 'gallery' && <span className="text-[10px] font-medium text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-100">Gallery</span>}
                        </div>
                        <span className="text-xs font-medium text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">Edit →</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            
            {filteredItems.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-500">
                <Search size={32} className="mx-auto mb-3 opacity-20" />
                <p>No items match your search query.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
