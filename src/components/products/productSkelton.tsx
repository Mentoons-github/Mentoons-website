import { FaMagnifyingGlass } from "react-icons/fa6";
import { MobileProductSkeleton } from "./mobile/mobileView";

const ProductsSkeletonCard = () => (
  <div className="w-full animate-pulse">
    <div className="flex justify-center w-full">
      <div className="w-full mb-4 bg-gray-200 rounded-lg h-48 sm:h-60"></div>
    </div>
    <div className="w-3/4 h-6 sm:h-8 mb-2 bg-gray-200 rounded"></div>
    <div className="w-1/2 h-5 sm:h-6 mb-4 bg-gray-200 rounded"></div>
    <div className="flex mb-3 space-x-2">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="w-3 sm:w-4 h-3 sm:h-4 bg-gray-200 rounded-full"
        ></div>
      ))}
    </div>
    <div className="w-full h-16 sm:h-20 mb-4 bg-gray-200 rounded"></div>
    <div className="flex items-center justify-between">
      <div className="w-20 sm:w-24 h-6 sm:h-8 bg-gray-200 rounded"></div>
      <div className="w-24 sm:w-32 h-8 sm:h-10 bg-gray-200 rounded"></div>
    </div>
  </div>
);

export const SearchingSkeleton = ({ searchTerm }: { searchTerm: string }) => (
  <div className="w-full max-w-full overflow-hidden h-auto px-2 sm:px-4 py-6 sm:py-8 md:px-8 md:py-10 lg:px-12 lg:py-12">
    <div className="relative p-3 sm:p-4 mb-4 sm:mb-6 rounded-full shadow-lg">
      <FaMagnifyingGlass className="absolute w-3 sm:w-4 h-3 sm:h-4 text-gray-400 transform -translate-y-1/2 top-1/2 left-3 sm:left-4" />
      <input
        type="text"
        placeholder="search here...."
        value={searchTerm}
        className="w-full pl-8 sm:pl-10 pr-8 sm:pr-10 bg-gray-100 border border-transparent outline-none rounded-full text-sm sm:text-base"
        disabled
      />
      <div className="absolute transform -translate-y-1/2 right-3 sm:right-4 top-1/2">
        <div className="w-3 sm:w-4 h-3 sm:h-4 border-2 border-gray-300 rounded-full animate-spin border-t-blue-500"></div>
      </div>
    </div>

    <div className="p-6 sm:p-8 mt-8 sm:mt-10 text-center border border-blue-100 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="flex justify-center mb-4">
        <div className="relative">
          <div className="w-12 sm:w-16 h-12 sm:h-16 border-4 border-blue-100 rounded-full animate-spin border-t-blue-500"></div>
          <FaMagnifyingGlass className="absolute w-5 sm:w-6 h-5 sm:h-6 text-blue-500 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 animate-pulse" />
        </div>
      </div>
      <h3 className="mb-2 text-xl sm:text-2xl font-semibold text-blue-700 break-words">
        Searching for "{searchTerm}"...
      </h3>
      <p className="text-base sm:text-lg text-blue-600">
        Please wait while we find the best products for you
      </p>
      <div className="flex justify-center mt-4 sm:mt-6 space-x-1">
        <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-blue-400 rounded-full animate-bounce"></div>
        <div
          className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-blue-400 rounded-full animate-bounce"
          style={{ animationDelay: "0.1s" }}
        ></div>
        <div
          className="w-1.5 sm:w-2 h-1.5 sm:h-2 bg-blue-400 rounded-full animate-bounce"
          style={{ animationDelay: "0.2s" }}
        ></div>
      </div>
    </div>
  </div>
);

export const ErrorDisplay = ({ message }: { message: string }) => (
  <div className="p-6 sm:p-8 mt-8 sm:mt-10 text-center border border-red-300 rounded-lg bg-red-50">
    <h3 className="mb-2 text-lg sm:text-xl font-semibold text-red-700">
      Oops! Something went wrong
    </h3>
    <p className="text-sm sm:text-base text-red-600 break-words">
      {message || "Failed to load products. Please try again later."}
    </p>
    <button
      onClick={() => window.location.reload()}
      className="px-4 sm:px-6 py-1.5 sm:py-2 mt-3 sm:mt-4 text-sm sm:text-base text-white transition bg-red-600 rounded-lg hover:bg-red-700"
    >
      Retry
    </button>
  </div>
);

export const ProductsLoadingSkeleton = () => (
  <div className="w-full max-w-full overflow-hidden">
    <div className="relative p-3 sm:p-4 mb-4 sm:mb-6 rounded-full shadow-lg animate-pulse">
      <div className="w-full h-8 sm:h-10 bg-gray-200 rounded-full"></div>
    </div>
    <div className="w-full mb-8 sm:mb-10 bg-gray-200 rounded-lg h-52 sm:h-60"></div>

    <div className="hidden md:block">
      <div className="grid w-full grid-cols-1 gap-4 sm:gap-6 mx-auto mt-8 sm:mt-10 sm:grid-cols-2 lg:grid-cols-4 sm:gap-8 md:gap-12 lg:gap-16">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-12 sm:h-16 bg-gray-200 rounded-full"></div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 sm:gap-8 mt-12 sm:mt-20">
        {[...Array(3)].map((_, i) => (
          <ProductsSkeletonCard key={i} />
        ))}
      </div>
    </div>

    <div className="block md:hidden mt-8 sm:mt-10">
      {[...Array(6)].map((_, i) => (
        <MobileProductSkeleton key={i} />
      ))}
    </div>
  </div>
);
