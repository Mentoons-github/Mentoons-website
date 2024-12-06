import React, { useEffect, useRef, useState } from "react";
import { TbZoomInArea } from "react-icons/tb";

interface ImageMagnifierProps {
  src: string;
  width: number;
  height: number;
  magnifierHeight: number;
  magnifierWidth: number;
  zoomLevel: number;
}

export default function ImageMagnifier({
  src,
  width,
  height,
  magnifierHeight = 300,
  magnifierWidth = 300,
  zoomLevel = 1.5,
}: ImageMagnifierProps) {
  const [[x, y], setXY] = useState([0, 0]);
  const [[imgWidth, imgHeight], setSize] = useState([0, 0]);
  const [showMagnifier, setShowMagnifier] = useState(false);

  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (img) {
      const updateSize = () => {
        setSize([img.naturalWidth, img.naturalHeight]);
      };
      updateSize();

      img.onload = updateSize;
      return () => {
        img.onload = null;
      };
    }
  }, [src]);

  const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
    const elem = e.currentTarget;
    const { top, left } = elem.getBoundingClientRect();

    const x = e.pageX - left - window.pageXOffset;
    const y = e.pageY - top - window.pageYOffset;
    setXY([x, y]);
  };

  const handleMouseEnter = () => {
    setShowMagnifier(true);
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 items-start ">
      <div className="relative border" style={{ width, height }}>
        <img
          ref={imgRef}
          src={src}
          alt="Original"
          className="w-full object-cover"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
        />
        {showMagnifier && (
          <div
            className="absolute  bg-white/50  pointer-events-none"
            style={{
              top: `${y - 50}px`,
              left: `${x - 50}px`,
              width: "100px",
              height: "100px",
            }}
          />
        )}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-opacity-50 text-white bg-black/50 text-center p-2  flex justify-center gap-2 rounded-xl px-4">
          <TbZoomInArea className="text-xl text-h" />
          <p className="text-sm ">Hover to zoom</p>
        </div>
      </div>

      <div
        className="border border-gray-300 bg-amber-50 absolute z-10 right-52 top-36 shadow-lg rounded-2xl "
        style={{
          display: showMagnifier ? "block" : "none",
          height: `${magnifierHeight}px`,
          width: `${magnifierWidth}px`,
          overflow: "hidden",
        }}
      >
        {showMagnifier ? (
          <img
            src={src}
            alt="Magnified"
            style={{
              height: imgHeight * zoomLevel,
              width: imgWidth * zoomLevel,
              transform: `translate(
                ${-x * zoomLevel + magnifierWidth / 2}px,
                ${-y * zoomLevel + magnifierHeight / 2}px
              )`,
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Magnified view will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
