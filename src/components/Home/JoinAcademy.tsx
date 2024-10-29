import { useNavigate } from 'react-router-dom';

const JoinAcademy = () => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate('/academy');
  };

  return (
    <div
      className="w-full h-[100vh] flex flex-col lg:flex-row bg-light-yellow" >
      <div className="w-full lg:w-1/2 h-[50vh] lg:h-full flex flex-col justify-center items-center bg-black bg-opacity-40 p-8 text-white">
        <h1 className="text-4xl lg:text-5xl font-bold mb-4">Join Our Academy</h1>
        <p className="text-lg lg:text-xl mb-6">Learn, grow, and excel with us. Explore our course&apos;s and start your journey today!</p>
        <button
          onClick={handleRedirect}
          className="bg-[#ec9600] hover:bg-yellow-400 text-black font-bold py-2 px-4 rounded transition duration-300"
        >
          Explore Now
        </button>
      </div>
      <div className="w-full lg:w-1/2 h-[50vh] lg:h-full" style={{ backgroundImage: "url('/academy.png')", backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
      </div>
    </div>
  );
};

export default JoinAcademy;
