import * as pdfjsLib from "pdfjs-dist";
import React, { useEffect, useRef, useState } from "react";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url
).toString();

interface ComicViewerProps {
  pdfUrl: string;
}

const ComicViewer: React.FC<ComicViewerProps> = ({ pdfUrl }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
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
        console.error("Error loading PDF:", error);
      }
    };

    loadPDF();
  }, [pdfUrl]);

  useEffect(() => {
    // Add resize event listener to handle window resizing
    const handleResize = () => {
      if (pdfDoc) {
        renderPage(currentPage, pdfDoc);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentPage, pdfDoc]);

  const renderPage = async (
    pageNum: number,
    pdf: pdfjsLib.PDFDocumentProxy
  ) => {
    if (!canvasRef.current || !containerRef.current) return;

    const page = await pdf.getPage(pageNum);
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (!context) return;

    // Get container dimensions
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;

    // Get the original viewport
    const originalViewport = page.getViewport({ scale: 1.0 });

    // Calculate scale to fit width and height
    const scaleX = containerWidth / originalViewport.width;
    const scaleY = containerHeight / originalViewport.height;

    // Use the smaller scale to ensure the entire page fits
    const scale = Math.min(scaleX, scaleY) * 0.95; // 0.95 to add a small margin

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

    const printContainer = document.createElement("div");
    printContainer.style.display = "none";
    document.body.appendChild(printContainer);

    try {
      const style = document.createElement("style");
      style.textContent = `
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          canvas {
            width: 100% !important;
            height: 100% !important;
            max-height: 297mm !important; /* A4 height */
            max-width: 210mm !important;  /* A4 width */
            object-fit: contain;
            page-break-after: always;
            margin: 0;
            padding: 0;
            display: block;
          }
        }
      `;
      printContainer.appendChild(style);

      for (let i = 1; i <= numPages; i++) {
        const canvas = document.createElement("canvas");
        const page = await pdfDoc.getPage(i);

        const viewport = page.getViewport({ scale: 2.0 });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const context = canvas.getContext("2d");
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
    <div className="flex flex-col p-6 w-full h-full">
      <h1 className="mb-4 text-2xl font-bold text-center">
        {pdfUrl
          .split("/")
          .pop()
          ?.split(".")[0]
          ?.split("+")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ") || "View comic"}
      </h1>
      <div
        ref={containerRef}
        className="flex overflow-hidden relative flex-1 justify-center items-center rounded-lg shadow-md bg-neutral-50"
      >
        <canvas ref={canvasRef} className="max-h-full" />
      </div>

      <div className="flex gap-6 justify-center items-center mt-4 font-light">
        <button
          onClick={() => changePage(-1)}
          disabled={currentPage <= 1}
          className="p-2 transition-colors text-neutral-600 hover:text-neutral-900 disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Previous page"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <span className="text-sm text-neutral-600 min-w-[80px] text-center">
          {currentPage} / {numPages}
        </span>
        <button
          onClick={() => changePage(1)}
          disabled={currentPage >= numPages}
          className="p-2 transition-colors text-neutral-600 hover:text-neutral-900 disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        <button
          onClick={handlePrint}
          className="p-2 transition-colors text-neutral-600 hover:text-neutral-900"
          aria-label="Print document"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ComicViewer;
