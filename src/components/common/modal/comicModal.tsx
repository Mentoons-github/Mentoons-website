// import { useState, useEffect } from "react";
// import { Document, Page, pdfjs } from "react-pdf";

// // Dynamically set the worker source
// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   "pdfjs-dist/build/pdf.worker.mjs",
//   import.meta.url
// ).toString();

// const ComicModal = ({
//   isOpen,
//   onClose,
//   comicLink,
// }: {
//   isOpen: boolean;
//   onClose: () => void;
//   comicLink: string;
// }) => {
//   const [numPages, setNumPages] = useState<number | null>(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [loading, setLoading] = useState(true);


//   if (!isOpen || !comicLink) return null;

//   const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
//     setNumPages(numPages);
//     setLoading(false);
//   };

//   const nextPage = () => {
//     if (numPages && currentPage < numPages) {
//       setCurrentPage(currentPage + 1);
//     }
//   };

//   const prevPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(currentPage - 1);
//     }
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center z-[9999] bg-black bg-opacity-70">
//       <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full mx-4 overflow-hidden max-h-[75vh]">
//         <div className="flex justify-between items-center border-b p-4">
//           <h2 className="text-xl font-bold">Comic Viewer</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-700"
//           >
//             <span className="text-2xl">&times;</span>
//           </button>
//         </div>

//         <div className="p-4 max-h-[70vh] overflow-auto">
//           <div className="flex justify-center items-center min-h-64">
//             {loading && (
//               <div className="text-center py-8">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
//                 <p className="mt-4 text-gray-600">Loading comic...</p>
//               </div>
//             )}
//             <Document
//               file={comicLink}
//               onLoadSuccess={onDocumentLoadSuccess}
//               loading={null}
//               error={
//                 <div className="text-red-500 text-center py-8">
//                   Failed to load PDF. Please check the link.
//                 </div>
//               }
//             >
//               <Page
//                 pageNumber={currentPage}
//                 width={window.innerWidth * 0.8}
//                 className={loading ? "opacity-0" : "opacity-100"}
//                 loading={null}
//               />
//             </Document>
//           </div>
//         </div>

//         <div className="flex justify-between items-center p-4 border-t">
//           <div className="text-sm">
//             {numPages ? `Page ${currentPage} of ${numPages}` : "Loading..."}
//           </div>
//           <div className="flex gap-2">
//             <button
//               onClick={prevPage}
//               disabled={currentPage <= 1 || loading}
//               className={`px-4 py-2 rounded ${
//                 currentPage <= 1 || loading
//                   ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//                   : "bg-blue-500 text-white hover:bg-blue-600"
//               }`}
//             >
//               Previous
//             </button>
//             <button
//               onClick={nextPage}
//               disabled={currentPage >= (numPages ?? 1) || loading}
//               className={`px-4 py-2 rounded ${
//                 currentPage >= (numPages ?? 1) || loading
//                   ? "bg-gray-200 text-gray-500 cursor-not-allowed"
//                   : "bg-blue-500 text-white hover:bg-blue-600"
//               }`}
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ComicModal;
