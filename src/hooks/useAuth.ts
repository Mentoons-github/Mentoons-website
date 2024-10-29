import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";

export const useAuthHook = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
const  {isSignedIn }= useAuth()
console.log(isSignedIn,'iiiiiii')
  useEffect(() => {
    if(isSignedIn){
      setIsLoggedIn(true)
    }
  }, [isSignedIn]);

  return { isLoggedIn };
};
