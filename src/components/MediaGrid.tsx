import React from 'react';

export default function MediaGrid({ items }: { items: any[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
          <div className="aspect-w-16 aspect-h-9 w-full bg-gray-100 flex items-center justify-center relative min-h-[250px]">
            {item.type === 'image' && (
              <img src={item.url} alt={item.title} className="object-cover w-full h-full absolute inset-0" />
            )}
            {item.type === 'video' && item.isGoogleDrive && (
              <iframe 
                src={item.url} 
                className="w-full h-full absolute inset-0 border-0"
                allow="autoplay"
                title={item.title}
              ></iframe>
            )}
            {item.type === 'video' && !item.isGoogleDrive && (
              <video src={item.url} controls className="w-full h-full absolute inset-0 object-cover" />
            )}
            {item.type === 'document' && (
              <div className="flex flex-col items-center justify-center text-gray-500 p-4 text-center">
                <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                <span className="text-sm">Document</span>
                <a href={item.url} target="_blank" rel="noreferrer" className="mt-4 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100 transition-colors">
                  View PDF
                </a>
              </div>
            )}
          </div>
          <div className="p-4 flex-grow flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-2">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.originalCategory}</p>
            </div>
            {item.isHealthCommunication && (
              <span className="mt-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 self-start">
                Health Communication
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
