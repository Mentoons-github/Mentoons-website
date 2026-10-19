import FreeDownloadForm from "@/components/comics/FreeDownloadForm";
import FreeBanner from "@/components/freeDownloads/banner";
import Items from "@/components/freeDownloads/items";
import { useState } from "react";

export interface SelectedComicType {
  thumbnail_url: string;
  pdf_url: string;
}

const FreeDownloads = () => {
  const [selectedComic, setSelectedComic] = useState<SelectedComicType>({
    thumbnail_url: "",
    pdf_url: "",
  });
  const [showFreeDownloadForm, setShowFreeDownloadForm] =
    useState<boolean>(false);

  return (
    <div
      className="min-h-screen bg-yellow-100"
      style={{
        backgroundImage:
          "radial-gradient(rgba(234,88,12,0.18) 2px, transparent 2px)",
        backgroundSize: "18px 18px",
      }}
    >
      <div className="mx-4 md:mx-8 lg:mx-20 py-10">
        <FreeBanner />
        <Items
          setSelectedComic={setSelectedComic}
          setShowFreeDownloadForm={setShowFreeDownloadForm}
        />
      </div>

      {showFreeDownloadForm && (
        <FreeDownloadForm
          page="freedownload"
          selectedComic={selectedComic}
          setShowFreeDownloadForm={setShowFreeDownloadForm}
        />
      )}
    </div>
  );
};

export default FreeDownloads;
