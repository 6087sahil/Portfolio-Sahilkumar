import React from 'react';
import { motion, type Variants } from 'framer-motion';

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  yOffset?: number;
  duration?: number;
  className?: string;
  staggerChildren?: number;
  style?: React.CSSProperties;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({ 
  children, 
  delay = 0, 
  yOffset = 30, 
  duration = 0.4,
  className = "",
  staggerChildren = 0,
  style
}) => {
  const containerVariants: Variants = {
    hidden: { opacity: 0, y: yOffset },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration, 
        delay: delay * 0.5, 
        ease: [0.16, 1, 0.3, 1],
        when: staggerChildren ? "beforeChildren" : undefined,
        staggerChildren: staggerChildren ? staggerChildren * 0.5 : undefined
      } 
    }
  };

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1, margin: "0px 0px -50px 0px" }}
      style={style}
    >
      {children}
    </motion.div>
  );
};

export const ScrollRevealItem: React.FC<{ children: React.ReactNode, className?: string, yOffset?: number, duration?: number }> = ({ children, className = "", yOffset = 20, duration = 0.4 }) => {
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: yOffset },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
};

export default ScrollReveal;
