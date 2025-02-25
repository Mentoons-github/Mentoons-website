const ImageUpload = () => {
  {
    // onImageUpload, (multiple = false);
  }
  // const [uploading, setUploading] = useState(false);

  // const handleImageChange = async (e) => {
  //   const files = Array.from(e.target.files);
  //   setUploading(true);

  //   try {
  //     const formData = new FormData();
  //     files.forEach((file) => {
  //       formData.append("images", file);
  //     });

  //     const response = await fetch("http://localhost:5000/api/upload", {
  //       method: "POST",
  //       body: formData,
  //     });

  //     const data = await response.json();
  //     onImageUpload(multiple ? data.urls : data.urls[0]);
  //   } catch (error) {
  //     console.error("Error uploading images:", error);
  //   } finally {
  //     setUploading(false);
  //   }
  // };

  // return (
  //   <div className="mt-2">
  //     <input
  //       type="file"
  //       onChange={handleImageChange}
  //       multiple={multiple}
  //       accept="image/*"
  //       className="hidden"
  //       id="image-upload"
  //     />
  //     <label
  //       htmlFor="image-upload"
  //       className="px-4 py-2 bg-gray-100 rounded cursor-pointer hover:bg-gray-200"
  //     >
  //       {uploading ? "Uploading..." : "Upload Images"}
  //     </label>
  //   </div>
  <div>helleo</div>;
};

export default ImageUpload;
