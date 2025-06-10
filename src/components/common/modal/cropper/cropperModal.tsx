import { useState, useRef, useCallback } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import { Button } from "@/components/ui/button";
import "react-image-crop/dist/ReactCrop.css";

interface ImageCropperModalProps {
  imageSrc: string;
  onCrop: (croppedFile: File) => void;
  onCancel: () => void;
  aspectRatio?: number;
}

const ImageCropperModal = ({
  imageSrc,
  onCrop,
  onCancel,
  aspectRatio,
}: ImageCropperModalProps) => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: "%",
    x: 20,
    y: 20,
    width: 60,
    height: 40,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);

  const getCroppedImage = useCallback(
    async (image: HTMLImageElement, crop: PixelCrop): Promise<File> => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Canvas context not available");
      }

      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      canvas.width = crop.width * scaleX;
      canvas.height = crop.height * scaleY;

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.scale(scale, scale);
      ctx.rotate((rotate * Math.PI) / 180);
      ctx.translate(
        -crop.x * scaleX - (crop.width * scaleX) / 2,
        -crop.y * scaleY - (crop.height * scaleY) / 2
      );
      ctx.drawImage(image, 0, 0);

      return new Promise((resolve) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(
                new File([blob], "cropped-image.jpg", { type: "image/jpeg" })
              );
            } else {
              throw new Error("Failed to create blob");
            }
          },
          "image/jpeg",
          0.9
        );
      });
    },
    [scale, rotate]
  );

  const handleCrop = useCallback(async () => {
    if (imgRef.current && completedCrop) {
      try {
        const croppedFile = await getCroppedImage(
          imgRef.current,
          completedCrop
        );
        onCrop(croppedFile);
      } catch (error) {
        console.error("Error cropping image:", error);
      }
    }
  }, [completedCrop, getCroppedImage, onCrop]);

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      imgRef.current = e.currentTarget;
    },
    []
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg p-4 sm:p-6 max-w-3xl w-full max-h-[90vh] overflow-auto">
        <div className="relative">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspectRatio}
            minWidth={100}
            minHeight={100}
            keepSelection={true}
          >
            <img
              ref={imgRef}
              src={imageSrc}
              alt="Image to crop"
              style={{
                transform: `scale(${scale}) rotate(${rotate}deg)`,
                maxWidth: "100%",
                maxHeight: "70vh",
              }}
              onLoad={onImageLoad}
            />
          </ReactCrop>
        </div>
        <div className="flex flex-col gap-2 mt-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <label className="flex flex-col w-full sm:w-1/2">
              Zoom
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
                className="mt-1"
              />
            </label>
            <label className="flex flex-col w-full sm:w-1/2">
              Rotate
              <input
                type="range"
                min="-180"
                max="180"
                step="1"
                value={rotate}
                onChange={(e) => setRotate(Number(e.target.value))}
                className="mt-1"
              />
            </label>
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <Button
              variant="outline"
              onClick={onCancel}
              className="border-orange-500 text-orange-500 hover:bg-orange-50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCrop}
              disabled={!completedCrop}
              className="bg-orange-500 text-white hover:bg-orange-600"
            >
              Crop & Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCropperModal;
