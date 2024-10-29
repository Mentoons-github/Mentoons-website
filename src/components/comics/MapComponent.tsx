import React from "react";

const MapComponent: React.FC = () => {
  return (
    <div>
      <iframe
        className="w-full"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.283665318442!2d77.63712091020311!3d12.95369168730733!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae155a60ecb7a1%3A0xac5bd734b84eb2b8!2sMentoons!5e0!3m2!1sen!2sin!4v1724659561224!5m2!1sen!2sin"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
      ></iframe>
    </div>
  );
};

export default MapComponent;
