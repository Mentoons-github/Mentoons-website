import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthHook } from '@/hooks/useAuth';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { AiOutlineClose } from 'react-icons/ai';
import MiniLogo from "@/assets/imgs/logo mini.png";
import { useDailyAccess } from '@/hooks/useRestricted';

type ProtectedRouteProps = {
  children: React.ReactNode;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoggedIn } = useAuthHook();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const isRestricted = useDailyAccess();

  useEffect(() => {
    if (!isLoggedIn) {
      setOpen(true);
    }
  }, [isLoggedIn]);

  if (isRestricted) {
    return (
      <>
        {children}
        <Dialog open={true}>
          <DialogContent className="bg-[url('/assets/cards/restrict.png')] bg-cover bg-center  rounded-xl shadow-lg p-8 max-w-md mx-auto text-center z-[9999]">
            <div className="space-y-6">
              <div className="flex flex-col items-center">
                <div className="bg-red-100 p-3 rounded-full">
                  <svg 
                    className="w-8 h-8 text-red-500" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                    />
                  </svg>
                </div>
                <h2 className="mt-4 text-2xl font-bold text-gray-900">Access Restricted</h2>
                <p className="mt-2 text-gray-600">
                  You have reached your 30-minute limit for today. Please come back tomorrow!
                </p>
              </div>
              <button
                onClick={() => navigate('/')}
                className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-200"
              >
                Return Home
              </button>
            </div>
          </DialogContent>
        </Dialog>
        <div 
          className="fixed inset-0 bg-black/50 z-[9998]" 
          onClick={(e) => {
            // Prevent clicks from reaching the video
            e.preventDefault();
            e.stopPropagation();
          }}
        />
      </>
    );
  }

  const handleLoginRedirect = () => {
    setOpen(false);
    navigate('/sign-up');
  };

  if (!isLoggedIn) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className='bg-gray-100 rounded-lg shadow-lg p-12 lg:p-16 text-center z-[9999]'>
          <h1 className="font-semibold text-xl flex justify-center gap-2">
            <img className="w-20" src={MiniLogo} alt="mentoons logo" />
          </h1>
          <p className='text-lg text-gray-800 mb-4'>You need to be logged in to access this page.</p>
          <button className='absolute top-4 right-4' onClick={() => {
            setOpen(false);
            navigate('/');
          }}>
            <AiOutlineClose />
          </button>
          <button
            className='bg-men-blue text-white rounded-md px-4 py-2 text-base transition duration-300 ease-in-out hover:bg-red-600'
            onClick={handleLoginRedirect}
          >
            Login / Register
          </button>
        </DialogContent>
      </Dialog>
    );
  }
  return <>{children}</>;
};

export default ProtectedRoute;
