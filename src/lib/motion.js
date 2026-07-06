export const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export const pageTransition = {
  duration: 0.25,
  ease: 'easeOut',
};

export const fadeVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const fadeTransition = {
  duration: 0.2,
  ease: 'easeOut',
};

export const springVariants = {
  initial: { opacity: 0, scale: 0.96, y: 8 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.96, y: 8 },
};

export const springTransition = {
  type: 'spring',
  stiffness: 320,
  damping: 26,
  mass: 0.8,
};
