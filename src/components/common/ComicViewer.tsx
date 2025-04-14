import { useUser } from "@clerk/clerk-react";
import * as pdfjsLib from "pdfjs-dist";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url
).toString();

interface ComicViewerProps {
  pdfUrl: string;
  productType?: string;
}

const ComicViewer: React.FC<ComicViewerProps> = ({ pdfUrl, productType }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const navigate = useNavigate();

  const { user } = useUser();

  console.log("User:", user);

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

  const handleBrowsePlansClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => scrollToSubscription(), 500);
    } else {
      scrollToSubscription();
    }
  };
  const scrollToSubscription = () =>
    document
      .getElementById("subscription")
      ?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      {pdfUrl && pdfUrl.toLowerCase().endsWith(".pdf") ? (
        <div className="flex flex-col w-full h-full p-6">
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
            className="relative flex items-center justify-center flex-1 overflow-hidden rounded-lg shadow-md bg-neutral-50"
          >
            <canvas ref={canvasRef} className="max-h-full" />
          </div>

          <div className="flex items-center justify-center gap-6 mt-4 font-light">
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
      ) : pdfUrl &&
        pdfUrl.toLowerCase().endsWith(".mp4") &&
        productType === "Free" ? (
        <div className="flex items-center justify-center w-full h-full p-6">
          <video
            controls
            className="w-full h-full rounded-lg shadow-md"
            src={pdfUrl}
          />
        </div>
      ) : (
        <div className="relative flex flex-col items-center justify-center h-full p-8 overflow-hidden text-center">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 -translate-x-12 -translate-y-16 rounded-full bg-primary/10" />
          <div className="absolute bottom-0 left-0 w-40 h-40 translate-x-8 translate-y-20 rounded-full bg-primary/10" />
          <img
            src="/assets/comic-V2/star-1.png"
            alt=""
            className="absolute w-16 top-8 left-8 animate-pulse"
          />
          <img
            src="/assets/comic-V2/star-2.png"
            alt=""
            className="absolute w-16 bottom-8 right-8 animate-pulse"
          />

          <div className="relative z-10 max-w-2xl mx-auto">
            <h3 className="mb-6 text-4xl font-bold text-primary luckiest-guy-regular">
              Subscribe to Access Premium Content or Explore Mentoons store for
              individual purchases!
            </h3>
            <p className="mb-10 text-xl leading-relaxed text-gray-600">
              Join Mentoons to unlock our full library of educational comics and
              engaging content designed to help children learn and grow. Get
              access to exclusive comics, audio stories, and more
            </p>
            <button
              onClick={(e) => handleBrowsePlansClick(e)}
              className="px-10 py-4 text-xl font-semibold text-white transition-all duration-300 rounded-full bg-primary hover:bg-primary/90 hover:scale-105 hover:shadow-lg"
            >
              Subscribe Now
            </button>
            <button
              onClick={() => navigate("/product-page")}
              className="px-10 py-4 text-xl font-semibold text-white transition-all duration-300 rounded-full bg-primary hover:bg-primary/90 hover:scale-105 hover:shadow-lg ml-4"
            >
              Explore Mentoons Store
            </button>
          </div>

          {/* Additional decorative illustrations */}
          <div className="absolute w-24 h-24 left-12 top-1/2 opacity-20">
            <img
              src="/assets/comic-V2/comic-doodle.png"
              alt=""
              className="object-contain w-full h-full"
            />
          </div>
          <div className="absolute w-24 h-24 right-12 top-1/3 opacity-20">
            <img
              src="/assets/comic-V2/comic-doodle-2.png"
              alt=""
              className="object-contain w-full h-full"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ComicViewer;
