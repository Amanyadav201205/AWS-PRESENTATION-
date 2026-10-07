import React, { useRef, useEffect } from 'react';
import katex from 'katex';

interface LatexFormulaProps {
  formula: string;
  displayMode?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Renders a LaTeX math formula using KaTeX.
 * The data strings use double-escaped backslashes (\\\\) in source,
 * which become single backslashes (\\) at runtime — standard LaTeX.
 */
export const LatexFormula: React.FC<LatexFormulaProps> = ({
  formula,
  displayMode = true,
  style,
  className
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !formula) return;
    try {
      katex.render(formula, containerRef.current, {
        displayMode,
        throwOnError: false,
        trust: true,
        strict: false
      });
    } catch {
      // Fallback: show raw formula in mono font if KaTeX chokes
      if (containerRef.current) {
        containerRef.current.textContent = formula;
      }
    }
  }, [formula, displayMode]);

  return <div ref={containerRef} className={className} style={style} />;
};

export default LatexFormula;
