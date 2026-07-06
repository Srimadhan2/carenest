import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { pageTransition, pageVariants } from '@/lib/motion';

export function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <motion.div
        className="w-full max-w-md"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        transition={pageTransition}
      >
        <Outlet />
      </motion.div>
    </div>
  );
}
