const EmployeeHeader = () => {
  return (
    <div className="flex justify-between items-center h-16 bg-gray-100 w-full px-10">
      <h1 className="text-xl xxs:text-3xl font-bold tracking-wider">
        Employee Panel
      </h1>

      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-orange-400 flex justify-center items-center text-white font-semibold">
          U
        </div>
      </div>
    </div>
  );
};

export default EmployeeHeader;
