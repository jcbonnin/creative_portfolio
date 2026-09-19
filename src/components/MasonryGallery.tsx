"use client";

import React, { useState } from 'react';
import Masonry from 'react-masonry-css';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';

export default function MasonryGallery({ items }: { items: any[] }) {
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1
  };

  const openLightbox = (project: any) => {
    setSelectedProject(project);
    setCurrentMediaIndex(0);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedProject(null);
    document.body.style.overflow = 'unset';
  };

  const nextMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedProject && currentMediaIndex < selectedProject.items.length - 1) {
      setCurrentMediaIndex(prev => prev + 1);
    }
  };

  const prevMedia = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedProject && currentMediaIndex > 0) {
      setCurrentMediaIndex(prev => prev - 1);
    }
  };

  const renderMedia = (mediaItem: any, inLightbox: boolean = false) => {
    if (mediaItem.type === 'image') {
      return (
        <img 
          src={mediaItem.url} 
          alt={mediaItem.title || 'Portfolio Image'} 
          className={`w-full h-full object-contain ${!inLightbox ? 'bg-gray-100' : ''}`}
        />
      );
    }
    if (mediaItem.type === 'video') {
      if (mediaItem.isGoogleDrive) {
        return (
          <iframe 
            src={mediaItem.url} 
            className="w-full h-full border-0"
            allow="autoplay"
            title={mediaItem.title}
          />
        );
      }
      return (
        <video 
          src={mediaItem.url} 
          controls={inLightbox}
          autoPlay={inLightbox}
          muted={!inLightbox}
          loop={!inLightbox}
          className="w-full h-full object-cover" 
        />
      );
    }
    if (mediaItem.type === 'document') {
      if (inLightbox) {
        return (
          <object data={mediaItem.url} type="application/pdf" className="w-full h-full rounded-md shadow-inner bg-white">
            <p>Your browser does not support PDFs. <a href={mediaItem.url}>Download the PDF</a>.</p>
          </object>
        );
      }
      return (
        <div className="w-full h-64 bg-gray-50 border border-gray-200 flex flex-col items-center justify-center text-gray-500">
          <svg className="w-12 h-12 mb-2 text-rose-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-3H9V7h2v6z"/></svg>
          <span className="text-sm font-medium">PDF Document</span>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="flex -ml-6 w-auto"
        columnClassName="pl-6 bg-clip-padding"
      >
        {items.map((project, idx) => {
          const thumb = project.items[0];
          return (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={idx} 
              className="mb-8 cursor-pointer group"
              onClick={() => openLightbox(project)}
            >
              <div className="relative rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 ring-1 ring-black/5 bg-white">
                <div className="relative w-full">
                  {renderMedia(thumb, false)}
                  {project.type === 'gallery' && project.items.length > 1 && (
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs px-2 py-1 rounded-md flex items-center gap-1 font-medium">
                      <LayoutGrid size={14} />
                      {project.items.length}
                    </div>
                  )}
                </div>
                <div className="p-5 border-t border-gray-100">
                  <h3 className="font-semibold text-gray-900 text-lg leading-tight mb-2 group-hover:text-blue-600 transition-colors">{project.title}</h3>
                  {project.description && (
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">{project.description}</p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {project.isHealthCommunication && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20">
                        Health Comm
                      </span>
                    )}
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600">
                      {project.category}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </Masonry>

      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 sm:p-8"
            onClick={closeLightbox}
          >
            <button 
              className="absolute top-6 right-6 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full p-2 transition-all z-50"
              onClick={closeLightbox}
            >
              <X size={24} />
            </button>

            <div 
              className="relative w-full h-full max-w-6xl max-h-[90vh] flex flex-col justify-center items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedProject.items.length > 1 && currentMediaIndex > 0 && (
                <button 
                  className="absolute left-0 sm:-left-12 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-4"
                  onClick={prevMedia}
                >
                  <ChevronLeft size={48} />
                </button>
              )}

              <motion.div 
                key={currentMediaIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="w-full h-full flex flex-col"
              >
                <div className="flex-grow relative w-full flex items-center justify-center overflow-hidden rounded-lg">
                  {renderMedia(selectedProject.items[currentMediaIndex], true)}
                </div>
                
                <div className="mt-6 text-center text-white">
                  <h2 className="text-2xl font-bold">{selectedProject.title}</h2>
                  {selectedProject.description && (
                    <p className="text-gray-400 mt-2 max-w-2xl mx-auto">{selectedProject.description}</p>
                  )}
                  {selectedProject.items.length > 1 && (
                    <div className="mt-4 flex gap-1 justify-center">
                      {selectedProject.items.map((_: any, i: number) => (
                        <div 
                          key={i} 
                          className={`h-1.5 rounded-full transition-all ${i === currentMediaIndex ? 'w-6 bg-white' : 'w-2 bg-white/30'}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>

              {selectedProject.items.length > 1 && currentMediaIndex < selectedProject.items.length - 1 && (
                <button 
                  className="absolute right-0 sm:-right-12 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-4"
                  onClick={nextMedia}
                >
                  <ChevronRight size={48} />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
