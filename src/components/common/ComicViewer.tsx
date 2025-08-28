import { RewardEventType } from "@/types/rewards";
import { triggerReward } from "@/utils/rewardMiddleware";
import * as pdfjsLib from "pdfjs-dist";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url
).toString();

interface DBUser {
  _id: string;
  subscription: {
    plan: string;
    startDate?: string;
  };
}

interface ComicViewerProps {
  pdfUrl: string;
  productType?: string;
  productId?: string;
  dbUser?: DBUser | null;
  userPlan?: string;
}

const ComicViewer: React.FC<ComicViewerProps> = ({
  pdfUrl,
  productId,
  userPlan,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(0);
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const navigate = useNavigate();
  const pagesViewedRef = useRef<Set<number>>(new Set());
  const [readProgress, setReadProgress] = useState(0);
  const [hasEarnedReward, setHasEarnedReward] = useState(false);
  const [videoWatched, setVideoWatched] = useState(false);

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
    if (pdfUrl.toLowerCase().endsWith(".pdf")) {
      loadPDF();
      pagesViewedRef.current = new Set([1]);
      setReadProgress(0);
      setHasEarnedReward(false);
    }
  }, [pdfUrl]);

  useEffect(() => {
    const handleResize = () => {
      if (pdfDoc) {
        renderPage(currentPage, pdfDoc);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentPage, pdfDoc]);

  useEffect(() => {
    if (numPages > 0) {
      const progress = (pagesViewedRef.current.size / numPages) * 100;
      setReadProgress(Math.round(progress));
      if (progress >= 100 && !hasEarnedReward && productId) {
        triggerReward(RewardEventType.READ_COMIC, productId);
        setHasEarnedReward(true);
      }
    }
  }, [pagesViewedRef.current.size, numPages, hasEarnedReward, productId]);

  const renderPage = async (
    pageNum: number,
    pdf: pdfjsLib.PDFDocumentProxy
  ) => {
    if (!canvasRef.current || !containerRef.current) return;
    const page = await pdf.getPage(pageNum);
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;
    const originalViewport = page.getViewport({ scale: 1.0 });
    const scaleX = containerWidth / originalViewport.width;
    const scaleY = containerHeight / originalViewport.height;
    const scale = Math.min(scaleX, scaleY) * 0.95;
    const scaledViewport = page.getViewport({ scale });
    canvas.height = scaledViewport.height;
    canvas.width = scaledViewport.width;
    const renderContext = { canvasContext: context, viewport: scaledViewport };
    await page.render(renderContext).promise;
    pagesViewedRef.current.add(pageNum);
    setReadProgress((pagesViewedRef.current.size / numPages) * 100);
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
          @page { size: A4; margin: 0; }
          canvas { width: 100% !important; height: 100% !important; max-height: 297mm !important; max-width: 210mm !important; object-fit: contain; page-break-after: always; margin: 0; padding: 0; display: block; }
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
        await page.render({ canvasContext: context, viewport: viewport })
          .promise;
        printContainer.appendChild(canvas);
        pagesViewedRef.current.add(i);
      }
      setReadProgress(100);
      if (productId && !hasEarnedReward) {
        triggerReward(RewardEventType.READ_COMIC, productId);
        setHasEarnedReward(true);
      }
      window.print();
    } finally {
      document.body.removeChild(printContainer);
    }
  };

  const handleVideoEnded = () => {
    setVideoWatched(true);
    if (productId && !hasEarnedReward) {
      triggerReward(RewardEventType.LISTEN_AUDIO_COMIC, productId);
      setHasEarnedReward(true);
    }
  };

  const handleBrowsePlansClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigate("/membership");
  };

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
          <div className="w-full h-2 mb-4 bg-gray-200 rounded-full">
            <div
              className="h-full transition-all duration-300 rounded-full bg-primary"
              style={{ width: `${readProgress}%` }}
            ></div>
          </div>
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
          {hasEarnedReward && (
            <div className="p-3 mt-4 text-center text-green-700 border border-green-200 rounded-lg bg-green-50 animate-pulse">
              <span className="font-medium">Congratulations!</span> You've
              earned points for reading this comic!
            </div>
          )}
        </div>
      ) : pdfUrl && pdfUrl.toLowerCase().endsWith(".mp4") ? (
        <div className="flex flex-col items-center justify-center w-full h-full p-6">
          <video
            controls
            className="w-full h-full rounded-lg shadow-md"
            src={pdfUrl}
            onEnded={handleVideoEnded}
          />
          {videoWatched && (
            <div className="p-3 mt-4 text-center text-green-700 border border-green-200 rounded-lg bg-green-50 animate-pulse">
              <span className="font-medium">Congratulations!</span> You've
              earned points for watching this audio comic!
            </div>
          )}
        </div>
      ) : (
        <div className="relative flex flex-col items-center justify-center h-full p-8 overflow-hidden text-center">
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
              {userPlan === "platinum"
                ? "Purchase Content"
                : "Subscribe to Access Content"}
            </h3>
            <p className="mb-10 text-xl leading-relaxed text-gray-600">
              {userPlan === "platinum"
                ? "You've reached your content limit. Purchase this content for ₹1 to continue."
                : "Join Mentoons or upgrade your plan to unlock our full library of educational comics and engaging content."}
            </p>
            <button
              onClick={handleBrowsePlansClick}
              className="px-10 py-4 text-xl font-semibold text-white transition-all duration-300 rounded-full bg-primary hover:bg-primary/90 hover:scale-105 hover:shadow-lg"
            >
              {userPlan === "platinum" ? "Purchase Now" : "Subscribe Now"}
            </button>
            <button
              onClick={() => navigate("/product")}
              className="px-10 py-4 ml-4 text-xl font-semibold text-white transition-all duration-300 rounded-full bg-primary hover:bg-primary/90 hover:scale-105 hover:shadow-lg"
            >
              Explore Mentoons Store
            </button>
          </div>
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
