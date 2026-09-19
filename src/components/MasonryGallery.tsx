"use client";

import React, { useState, useRef, useEffect } from 'react';
import Masonry from 'react-masonry-css';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';

const VideoThumbnail = ({ src, inLightbox }: { src: string, inLightbox: boolean }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMetadata = () => {
    if (videoRef.current && !inLightbox) {
      // Go to 1.5 seconds before the end for the thumbnail
      const targetTime = Math.max(0, videoRef.current.duration - 1.5);
      videoRef.current.currentTime = targetTime;
    }
  };

  return (
    <video 
      ref={videoRef}
      src={encodeURI(src)} 
      controls={inLightbox}
      autoPlay={inLightbox}
      muted={!inLightbox}
      loop={!inLightbox}
      onLoadedMetadata={handleMetadata}
      className="w-full h-auto rounded-t-xl" 
      preload={inLightbox ? "auto" : "metadata"}
    />
  );
};

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
    if (!mediaItem) return null;
    
    // Drive links don't need encodeURI on the whole string, just local files
    const safeUrl = mediaItem.isGoogleDrive ? mediaItem.url : encodeURI(mediaItem.url);

    if (mediaItem.type === 'image') {
      return (
        <img 
          src={safeUrl} 
          alt={mediaItem.title || 'Portfolio Image'} 
          className={`w-full h-auto ${!inLightbox ? 'bg-gray-100 rounded-t-xl' : 'object-contain max-h-[80vh]'}`}
        />
      );
    }
    if (mediaItem.type === 'video') {
      if (mediaItem.isGoogleDrive) {
        return (
          <iframe 
            src={safeUrl} 
            className="w-full aspect-square sm:aspect-video border-0 rounded-t-xl"
            allow="autoplay"
            title={mediaItem.title}
          />
        );
      }
      return <VideoThumbnail src={mediaItem.url} inLightbox={inLightbox} />;
    }
    if (mediaItem.type === 'document') {
      if (inLightbox) {
        return (
          <object data={safeUrl} type="application/pdf" className="w-full h-[80vh] rounded-md shadow-inner bg-white">
            <p>Your browser does not support PDFs. <a href={safeUrl}>Download the PDF</a>.</p>
          </object>
        );
      }
      return (
        <div className="w-full h-80 bg-gray-50 border-b border-gray-100 flex flex-col items-center justify-center overflow-hidden rounded-t-xl relative group-hover:opacity-90 transition-opacity">
          <iframe 
            src={`${safeUrl}#toolbar=0&navpanes=0&scrollbar=0`} 
            className="w-full h-full pointer-events-none border-0 overflow-hidden" 
            title={mediaItem.title}
          />
          <div className="absolute inset-0 bg-transparent" /> {/* Overlay to capture clicks */}
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
              transition={{ delay: Math.min(idx * 0.05, 0.5) }}
              key={idx} 
              className="mb-8 cursor-pointer group"
              onClick={() => openLightbox(project)}
            >
              <div className="relative rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 ring-1 ring-black/5 bg-white flex flex-col">
                <div className="relative w-full overflow-hidden rounded-t-xl flex-shrink-0">
                  {renderMedia(thumb, false)}
                  {project.type === 'gallery' && project.items.length > 1 && (
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs px-2 py-1 rounded-md flex items-center gap-1 font-medium z-10">
                      <LayoutGrid size={14} />
                      {project.items.length}
                    </div>
                  )}
                </div>
                <div className="p-5 flex-grow">
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
              className="absolute top-6 right-6 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all z-50"
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
                  className="absolute left-0 sm:-left-12 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-4 z-50"
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
                className="w-full h-full flex flex-col justify-center"
              >
                <div className="relative w-full flex items-center justify-center rounded-lg">
                  {renderMedia(selectedProject.items[currentMediaIndex], true)}
                </div>
                
                <div className="mt-6 text-center text-white flex-shrink-0">
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
                  className="absolute right-0 sm:-right-12 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-4 z-50"
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
