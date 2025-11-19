const ProgressBarUpload = ({ progress }: { progress: number }) => {
  return (
    <div className="w-full h-10 rounded-full border border-gray-200 p-1 overflow-hidden">
      <div style={{ backgroundColor: "yellow", width: `${progress}` }}></div>
    </div>
  );
};

export default ProgressBarUpload;
