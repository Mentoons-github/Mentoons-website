const Notification = () => {
  
  return (
    <div className="flex flex-col gap-4 p-5`">
      <h1 className="text-xl font-bold">Notifications</h1>

      <div className="flex flex-col max-h-screen gap-4 ">
        <div className="flex items-start w-full gap-3 p-4 bg-orange-100 rounded-lg ">
          <div className="w-10 h-10 overflow-hidden border border-gray-300 rounded-full">
            <img
              src="/profilePictures/pexels-simon-robben-55958-614810.jpg"
              alt="profile"
              className="object-cover w-full h-full"
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
