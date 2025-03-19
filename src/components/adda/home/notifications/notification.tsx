const Notification = () => {
  return (
    <div className="p-5 flex flex-col gap-4">
      <h1 className="text-xl font-bold">Notifications</h1>

      <div className="flex flex-col gap-4 max-h-screen ">
        <div className="flex items-start gap-3 bg-gray-100 p-4 rounded-lg shadow-md w-full">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-300">
            <img
              src="/profilePictures/pexels-simon-robben-55958-614810.jpg"
              alt="profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="font-semibold">Notification</h2>
            <p className="text-gray-700">Devan PS liked your post</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
