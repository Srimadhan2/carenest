import { motion } from 'framer-motion';
import { pageTransition, pageVariants } from '@/lib/motion';

export function DashboardLayout({ children }) {
  return (
    <motion.div
      className="flex-1 p-6"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      transition={pageTransition}
    >
      <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2">{children}</div>
    </motion.div>
  );
}
