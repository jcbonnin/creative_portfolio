"use client";

import React from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PdfThumbnail({ url }: { url: string }) {
  return (
    <div className="w-full h-auto min-h-[300px] bg-gray-50 flex flex-col items-center justify-center overflow-hidden rounded-t-xl relative group-hover:opacity-90 transition-opacity">
      <Document file={url} loading={<div className="animate-pulse w-full h-64 bg-gray-200" />}>
        <Page 
          pageNumber={1} 
          width={400} 
          renderTextLayer={false} 
          renderAnnotationLayer={false}
          className="w-full h-auto drop-shadow-md"
        />
      </Document>
      <div className="absolute inset-0 bg-transparent" /> {/* Overlay to capture clicks */}
    </div>
  );
}
