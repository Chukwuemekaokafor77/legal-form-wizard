// src/components/ui/TemplatePreview.js
import React, { useState, useEffect, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { 
  Loader, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Search,
  ChevronLeft, 
  ChevronRight,
  Maximize2,
  Minimize2 
} from 'lucide-react';

// Set worker URL for pdf.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export const TemplatePreview = ({ 
  pdfData, 
  mappedFields = {}, 
  onFieldClick,
  highlightField = null,
  initialPage = 1,
  initialScale = 1.0
}) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(initialPage);
  const [scale, setScale] = useState(initialScale);
  const [rotation, setRotation] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setLoading(false);
  };

  const nextPage = () => {
    setPageNumber(prev => Math.min(prev + 1, numPages));
  };

  const prevPage = () => {
    setPageNumber(prev => Math.max(prev - 1, 1));
  };

  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 3.0));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5));
  };

  const rotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowRight') nextPage();
      if (e.key === 'ArrowLeft') prevPage();
      if (e.key === '+' && e.ctrlKey) {
        e.preventDefault();
        zoomIn();
      }
      if (e.key === '-' && e.ctrlKey) {
        e.preventDefault();
        zoomOut();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [numPages]);

  const customTextRenderer = useCallback(({ str, itemIndex }) => {
    const isMapped = Object.values(mappedFields).includes(str);
    const isHighlighted = highlightField === str;
    const matchesSearch = searchTerm && 
      str.toLowerCase().includes(searchTerm.toLowerCase());

    return (
      <span
        className={`
          cursor-pointer transition-colors duration-200
          ${isMapped ? 'text-blue-600' : ''}
          ${isHighlighted ? 'bg-yellow-200' : ''}
          ${matchesSearch ? 'bg-green-200' : ''}
          hover:bg-gray-100
        `}
        onClick={() => onFieldClick?.(str)}
        title={isMapped ? 'Mapped field' : 'Click to map field'}
      >
        {str}
      </span>
    );
  }, [mappedFields, highlightField, searchTerm, onFieldClick]);

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center justify-between p-2 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <button
            onClick={prevPage}
            disabled={pageNumber <= 1}
            className="p-2 hover:bg-gray-200 rounded disabled:opacity-50"
            title="Previous page (←)"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="text-sm font-medium">
            Page {pageNumber} of {numPages || '-'}
          </div>
          <button
            onClick={nextPage}
            disabled={pageNumber >= numPages}
            className="p-2 hover:bg-gray-200 rounded disabled:opacity-50"
            title="Next page (→)"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-2 top-2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="pl-8 pr-4 py-1 rounded border focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={zoomOut}
            className="p-2 hover:bg-gray-200 rounded"
            title="Zoom out (Ctrl -)"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium min-w-[4rem] text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={zoomIn}
            className="p-2 hover:bg-gray-200 rounded"
            title="Zoom in (Ctrl +)"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button
            onClick={rotate}
            className="p-2 hover:bg-gray-200 rounded"
            title="Rotate"
          >
            <RotateCw className="w-5 h-5" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-2 hover:bg-gray-200 rounded"
            title="Toggle fullscreen"
          >
            {isFullscreen ? (
              <Minimize2 className="w-5 h-5" />
            ) : (
              <Maximize2 className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-sm">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-600" />
          <span>Mapped field</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-yellow-200" />
          <span>Selected field</span>
        </div>
        {searchTerm && (
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-200" />
            <span>Search match</span>
          </div>
        )}
      </div>

      {/* PDF Viewer */}
      <div className={`
        border rounded-lg overflow-auto
        ${isFullscreen ? 'h-screen' : 'max-h-[600px]'}
      `}>
        {loading && (
          <div className="flex items-center justify-center h-[600px]">
            <Loader className="animate-spin h-8 w-8 text-blue-600" />
          </div>
        )}
        <Document
          file={pdfData}
          onLoadSuccess={handleDocumentLoadSuccess}
          loading={null}
          className="flex justify-center"
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            rotate={rotation}
            renderAnnotationLayer={true}
            renderTextLayer={true}
            customTextRenderer={customTextRenderer}
            className="shadow-lg"
          />
        </Document>
      </div>
    </div>
  );
};