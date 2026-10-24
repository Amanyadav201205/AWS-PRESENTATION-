import { ReactNode, useLayoutEffect, useRef, useState } from 'react';

/** Layout width the simulation is designed at. It is scaled up or down from this width to fill the slide. */
const DESIGN_WIDTH = 1100;
const MAX_SCALE = 2.2;

interface FitToBoxProps {
  children: ReactNode;
}

/** Scales its child, laid out at a fixed design width, to the largest size that fits the box it sits in. */
export const FitToBox: React.FC<FitToBoxProps> = ({ children }) => {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState({ scale: 1, left: 0, top: 0 });

  useLayoutEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return undefined;

    const measure = () => {
      const naturalHeight = inner.offsetHeight;
      if (naturalHeight === 0 || outer.clientHeight === 0) return;
      const scale = Math.min(outer.clientWidth / DESIGN_WIDTH, outer.clientHeight / naturalHeight, MAX_SCALE);
      const left = Math.max(0, (outer.clientWidth - DESIGN_WIDTH * scale) / 2);
      const top = Math.max(0, (outer.clientHeight - naturalHeight * scale) / 2);
      setFit({ scale, left, top });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(outer);
    observer.observe(inner);
    return () => observer.disconnect();
  }, [children]);

  return (
    <div className="fit-box" ref={outerRef}>
      <div
        className="fit-box-inner"
        ref={innerRef}
        style={{ width: DESIGN_WIDTH, left: fit.left, top: fit.top, transform: `scale(${fit.scale})` }}
      >
        {children}
      </div>
    </div>
  );
};
