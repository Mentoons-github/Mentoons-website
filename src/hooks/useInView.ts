import { useRef } from "react";
import { useInView as framerUseInView } from "framer-motion";

const useInView = (amount: number = 0.3, once: boolean = false) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const isInView = framerUseInView(ref, { amount, once });

  return { ref, isInView };
};

export default useInView;
