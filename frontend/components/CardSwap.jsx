/**
 * CardSwap Component — adapted from the CardSwap reference for Intervista AI.
 * Uses GSAP for smooth perspective card swapping animation.
 * Adapted to work without Tailwind, using inline styles and the existing dark theme.
 */
import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import gsap from 'gsap';

// ─── Card sub-component ─────────────────────────────────────────────────────

export const Card = forwardRef(({ customClass, style, children, ...rest }, ref) => (
  <div
    ref={ref}
    style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.12)',
      backgroundColor: 'var(--bg-card, #151515)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
      transformStyle: 'preserve-3d',
      willChange: 'transform',
      backfaceVisibility: 'hidden',
      cursor: 'pointer',
      overflow: 'hidden',
      ...style,
    }}
    {...rest}
  >
    {children}
  </div>
));

Card.displayName = 'Card';

// ─── Slot positioning helpers ───────────────────────────────────────────────

const makeSlot = (i, distX, distY, total) => {
  const centerOffset = (total - 1) / 2;
  return {
    x: (i - centerOffset) * distX,
    y: -(i - centerOffset) * distY,
    z: -i * distX * 1.5,
    zIndex: total - i,
  };
};

const placeNow = (el, slot, skew) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: 'center center',
    zIndex: slot.zIndex,
    force3D: true,
  });

// ─── CardSwap container ─────────────────────────────────────────────────────

export default function CardSwap({
  width = 340,
  height = 220,
  cardDistance = 40,
  verticalDistance = 35,
  delay = 5000,
  pauseOnHover = true,
  onCardClick,
  skewAmount = 4,
  easing = 'elastic',
  children,
}) {
  const config =
    easing === 'elastic'
      ? {
          ease: 'elastic.out(0.6,0.9)',
          durDrop: 2,
          durMove: 2,
          durReturn: 2,
          promoteOverlap: 0.9,
          returnDelay: 0.05,
        }
      : {
          ease: 'power1.inOut',
          durDrop: 0.8,
          durMove: 0.8,
          durReturn: 0.8,
          promoteOverlap: 0.45,
          returnDelay: 0.2,
        };

  // Check for reduced motion preference
  const prefersReducedMotion = useRef(
    typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  );

  const childArr = useMemo(
    () => Children.toArray(children),
    [children]
  );
  const refs = useMemo(
    () => childArr.map(() => React.createRef()),
    [childArr.length]
  );
  const order = useRef(Array.from({ length: childArr.length }, (_, i) => i));
  const tlRef = useRef(null);
  const intervalRef = useRef(0);
  const container = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion.current) return;

    const total = refs.length;
    refs.forEach((r, i) => {
      if (r.current) {
        placeNow(r.current, makeSlot(i, cardDistance, verticalDistance, total), skewAmount);
      }
    });

    const swap = () => {
      if (order.current.length < 2) return;
      const [front, ...rest] = order.current;
      const elFront = refs[front]?.current;
      if (!elFront) return;

      const tl = gsap.timeline();
      tlRef.current = tl;

      tl.to(elFront, {
        y: '+=500',
        duration: config.durDrop,
        ease: config.ease,
      });

      tl.addLabel('promote', `-=${config.durDrop * config.promoteOverlap}`);
      rest.forEach((idx, i) => {
        const el = refs[idx]?.current;
        if (!el) return;
        const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
        tl.set(el, { zIndex: slot.zIndex }, 'promote');
        tl.to(
          el,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            duration: config.durMove,
            ease: config.ease,
          },
          `promote+=${i * 0.15}`
        );
      });

      const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length);
      tl.addLabel('return', `promote+=${config.durMove * config.returnDelay}`);
      tl.call(
        () => {
          gsap.set(elFront, { zIndex: backSlot.zIndex });
        },
        undefined,
        'return'
      );

      tl.to(
        elFront,
        {
          x: backSlot.x,
          y: backSlot.y,
          z: backSlot.z,
          duration: config.durReturn,
          ease: config.ease,
        },
        'return'
      );

      tl.call(() => {
        order.current = [...rest, front];
      });
    };

    intervalRef.current = window.setInterval(swap, delay);

    if (pauseOnHover && container.current) {
      const node = container.current;
      const pause = () => {
        tlRef.current?.pause();
        clearInterval(intervalRef.current);
      };
      const resume = () => {
        tlRef.current?.play();
        intervalRef.current = window.setInterval(swap, delay);
      };
      node.addEventListener('mouseenter', pause);
      node.addEventListener('mouseleave', resume);
      return () => {
        node.removeEventListener('mouseenter', pause);
        node.removeEventListener('mouseleave', resume);
        clearInterval(intervalRef.current);
        tlRef.current?.kill();
      };
    }

    return () => {
      clearInterval(intervalRef.current);
      tlRef.current?.kill();
    };
  }, [cardDistance, verticalDistance, delay, pauseOnHover, skewAmount, easing, refs]);

  // For reduced motion, just show static stacked cards
  if (prefersReducedMotion.current) {
    return (
      <div
        ref={container}
        style={{
          position: 'relative',
          width,
          height,
          perspective: '1200px',
          transformStyle: 'preserve-3d',
        }}
      >
        <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d' }}>
          {childArr.map((child, i) =>
            isValidElement(child)
              ? cloneElement(child, {
                  key: i,
                  ref: refs[i],
                  style: {
                    width,
                    height,
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: `translate(-50%, -50%) translateX(${(i - (childArr.length - 1) / 2) * cardDistance}px) translateY(${-(i - (childArr.length - 1) / 2) * verticalDistance}px)`,
                    zIndex: childArr.length - i,
                    ...(child.props.style ?? {}),
                  },
                  onClick: (e) => {
                    child.props.onClick?.(e);
                    onCardClick?.(i);
                  },
                })
              : child
          )}
        </div>
      </div>
    );
  }

  const rendered = childArr.map((child, i) =>
    isValidElement(child)
      ? cloneElement(child, {
          key: i,
          ref: refs[i],
          style: { width, height, ...(child.props.style ?? {}) },
          onClick: (e) => {
            child.props.onClick?.(e);
            onCardClick?.(i);
          },
        })
      : child
  );

  return (
    <div
      ref={container}
      style={{
        position: 'relative',
        width,
        height,
        perspective: '1200px',
        transformStyle: 'preserve-3d',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d' }}>
        {rendered}
      </div>
    </div>
  );
}
