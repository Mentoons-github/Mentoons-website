import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Replace the CDN worker setup with:
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString();

interface ComicViewerProps {
  pdfUrl: string;
}

const ComicViewer: React.FC<ComicViewerProps> = ({ pdfUrl }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);

  useEffect(() => {
    const loadPDF = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        setPdfDoc(pdf);
        setNumPages(pdf.numPages);
        renderPage(1, pdf);
      } catch (error) {
        console.error('Error loading PDF:', error);
      }
    };

    loadPDF();
  }, [pdfUrl]);

  const renderPage = async (pageNum: number, pdf: pdfjsLib.PDFDocumentProxy) => {
    if (!canvasRef.current) return;

    const page = await pdf.getPage(pageNum);
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Calculate scale to fit viewport height
    const viewport = page.getViewport({ scale: 1.0 });
    const containerHeight = window.innerHeight - 100; // Account for navigation
    const scale = containerHeight / viewport.height;
    
    const scaledViewport = page.getViewport({ scale });
    canvas.height = scaledViewport.height;
    canvas.width = scaledViewport.width;

    const renderContext = {
      canvasContext: context,
      viewport: scaledViewport,
    };

    await page.render(renderContext).promise;
  };

  const changePage = async (delta: number) => {
    if (!pdfDoc) return;

    const newPage = currentPage + delta;
    if (newPage >= 1 && newPage <= numPages) {
      setCurrentPage(newPage);
      await renderPage(newPage, pdfDoc);
    }
  };

  const handlePrint = async () => {
    if (!pdfDoc) return;
    
    const printContainer = document.createElement('div');
    printContainer.style.display = 'none';
    document.body.appendChild(printContainer);
    
    try {
      const style = document.createElement('style');
      style.textContent = `
        @media print {
          @page {
            margin: 1cm;
            size: auto;
          }
          canvas {
            width: 90% !important;
            height: full !important;
            page-break-after: always;
            margin: 0 auto;
            display: block;
          }
        }
      `;
      printContainer.appendChild(style);

      for (let i = 1; i <= numPages; i++) {
        const canvas = document.createElement('canvas');
        const page = await pdfDoc.getPage(i);
        
        const viewport = page.getViewport({ scale: 3.0 });
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        const context = canvas.getContext('2d');
        if (!context) continue;
        
        await page.render({
          canvasContext: context,
          viewport: viewport,
        }).promise;
        
        printContainer.appendChild(canvas);
      }
      
      window.print();
    } finally {
      document.body.removeChild(printContainer);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 h-full max-w-fit p-6">
        <h1 className="text-2xl font-bold">View comic</h1>
      <div className="relative flex-1 max-w-fit bg-neutral-50 rounded-lg shadow-md overflow-hidden">
        <canvas ref={canvasRef} className="max-h-full mx-auto" />
      </div>
      
      <div className="flex items-center gap-6 font-light">
        <button 
          onClick={() => changePage(-1)} 
          disabled={currentPage <= 1}
          className="p-2 text-neutral-600 hover:text-neutral-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <span className="text-sm text-neutral-600 min-w-[80px] text-center">
          {currentPage} / {numPages}
        </span>
        
        <button 
          onClick={() => changePage(1)} 
          disabled={currentPage >= numPages}
          className="p-2 text-neutral-600 hover:text-neutral-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <button 
          onClick={handlePrint}
          className="p-2 text-neutral-600 hover:text-neutral-900 transition-colors"
          aria-label="Print document"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ComicViewer;
