import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface TextRevealProps {
  children: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  once?: boolean;
  style?: React.CSSProperties;
}

/**
 * Word-by-word mask clip reveal.
 * Each word slides up from behind a clip boundary — no bounce, no typewriter.
 * GPU-only: uses transform (translateY) + opacity only.
 */
const TextReveal: React.FC<TextRevealProps> = ({
  children,
  className = '',
  delay = 0,
  stagger = 0.08,
  as: Tag = 'span',
  once = true,
  style,
}) => {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref as React.RefObject<Element>, {
    once,
    margin: '0px 0px -80px 0px',
  });

  const words = children.split(' ');

  return (
    // @ts-expect-error polymorphic tag
    <Tag ref={ref} className={className} style={style} aria-label={children}>
      {words.map((word, i) => (
        <span
          key={i}
          className="word-mask-wrapper"
          style={{ marginRight: i < words.length - 1 ? '0.28em' : 0 }}
          aria-hidden="true"
        >
          <motion.span
            className="word-mask-inner"
            initial={{ y: '110%', opacity: 0 }}
            animate={isInView ? { y: '0%', opacity: 1 } : { y: '110%', opacity: 0 }}
            transition={{
              duration: 0.75,
              delay: delay + i * stagger,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
};

export default TextReveal;
