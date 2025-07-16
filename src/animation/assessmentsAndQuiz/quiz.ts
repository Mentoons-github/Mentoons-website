export const fadeContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const fadeItem = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.9,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
};

export const cardHoverEffect = {
  rest: {
    scale: 1,
    y: 0,
    rotateY: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  },
  hover: {
    scale: 1.02,
    y: -8,
    rotateY: 2,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  },
};

export const overlayFade = {
  rest: {
    opacity: 0,
    scale: 1.1,
  },
  hover: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

export const liftText = {
  rest: {
    y: 0,
    opacity: 1,
  },
  hover: {
    y: -5,
    opacity: 1,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
};

export const bounceIcon = {
  rest: {
    scale: 1,
    rotate: 0,
  },
  hover: {
    scale: 1.2,
    rotate: 10,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
};
