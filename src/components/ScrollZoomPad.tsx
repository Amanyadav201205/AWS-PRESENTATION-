import React, { useEffect, useState } from 'react';
import {
  ArrowDownToLine,
  ArrowUpToLine,
  ChevronDown,
  ChevronUp,
  ChevronsDown,
  ChevronsUp,
  Hand,
  Minus,
  Plus,
  RotateCcw
} from 'lucide-react';
import type { RemoteCommandInput } from '../services/presentationRemoteSync';
import { useScrollPadGestures } from '../hooks/useScrollPadGestures';
import {
  CONTENT_ZOOM_MAX,
  CONTENT_ZOOM_MIN,
  CONTENT_ZOOM_STEP,
  LINE_SCROLL_PX
} from '../utils/contentScrollControl';

type PadSpeed = 'slow' | 'normal' | 'fast';

const SPEED_OPTIONS: { value: PadSpeed; label: string; multiplier: number }[] = [
  { value: 'slow', label: 'Slow', multiplier: 0.5 },
  { value: 'normal', label: 'Normal', multiplier: 1 },
  { value: 'fast', label: 'Fast', multiplier: 2 },
];

const ZOOM_PRESETS = [75, 100, 125, 150];

export interface ScrollZoomPadProps {
  scrollPercent: number;
  zoomLevel: number;
  onCommand: (cmd: RemoteCommandInput) => void;
}

export const ScrollZoomPad: React.FC<ScrollZoomPadProps> = ({ scrollPercent, zoomLevel, onCommand }) => {
  const [speed, setSpeed] = useState<PadSpeed>('normal');
  const [sliderZoom, setSliderZoom] = useState<number>(zoomLevel);

  // Follow the stage's reported zoom, but let the slider move instantly while dragged
  useEffect(() => {
    setSliderZoom(zoomLevel);
  }, [zoomLevel]);

  const speedMultiplier = SPEED_OPTIONS.find((option) => option.value === speed)?.multiplier ?? 1;
  const gestures = useScrollPadGestures({
    speedMultiplier,
    getZoomLevel: () => zoomLevel,
    onCommand,
  });

  const handleSliderChange = (value: number) => {
    setSliderZoom(value);
    onCommand({ type: 'ZOOM_CONTENT', zoomAction: 'set', zoomLevel: value, isContinuous: true });
  };

  return (
    <div className="scroll-pad">
      <div className="scroll-pad-status">
        <div
          className="scroll-pad-progress"
          role="progressbar"
          aria-label="Main site scroll position"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={scrollPercent}
        >
          <div className="scroll-pad-progress-fill" style={{ width: `${scrollPercent}%` }} />
        </div>
        <div className="scroll-pad-readout">
          <span>{scrollPercent}% scrolled</span>
          <span>Zoom {zoomLevel}%</span>
        </div>
      </div>

      <div
        className="scroll-pad-surface"
        role="group"
        aria-label="Touchpad. Drag up or down to scroll the main site. Pinch with two fingers to zoom."
        {...gestures}
      >
        <Hand size={28} aria-hidden="true" />
        <span>Drag to scroll · Pinch to zoom</span>
      </div>

      <div className="scroll-pad-segmented" role="group" aria-label="Touchpad sensitivity">
        {SPEED_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className="scroll-pad-chip"
            aria-pressed={speed === option.value}
            onClick={() => setSpeed(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="scroll-pad-section">
        <span className="scroll-pad-label">Scroll</span>
        <div className="scroll-pad-grid">
          <button type="button" className="scroll-pad-btn" aria-label="Scroll up one line" onClick={() => onCommand({ type: 'SCROLL_BY', scrollDelta: -LINE_SCROLL_PX })}>
            <ChevronUp size={18} aria-hidden="true" /> Line up
          </button>
          <button type="button" className="scroll-pad-btn" aria-label="Scroll down one line" onClick={() => onCommand({ type: 'SCROLL_BY', scrollDelta: LINE_SCROLL_PX })}>
            <ChevronDown size={18} aria-hidden="true" /> Line down
          </button>
          <button type="button" className="scroll-pad-btn" aria-label="Page up" onClick={() => onCommand({ type: 'SCROLL_PAGE', scrollDirection: 'up' })}>
            <ChevronsUp size={18} aria-hidden="true" /> Page up
          </button>
          <button type="button" className="scroll-pad-btn" aria-label="Page down" onClick={() => onCommand({ type: 'SCROLL_PAGE', scrollDirection: 'down' })}>
            <ChevronsDown size={18} aria-hidden="true" /> Page down
          </button>
          <button type="button" className="scroll-pad-btn" aria-label="Jump to top of page" onClick={() => onCommand({ type: 'SCROLL_EDGE', scrollEdge: 'top' })}>
            <ArrowUpToLine size={18} aria-hidden="true" /> Top
          </button>
          <button type="button" className="scroll-pad-btn" aria-label="Jump to bottom of page" onClick={() => onCommand({ type: 'SCROLL_EDGE', scrollEdge: 'bottom' })}>
            <ArrowDownToLine size={18} aria-hidden="true" /> Bottom
          </button>
        </div>
        <div className="scroll-pad-grid scroll-pad-grid--two">
          <button type="button" className="scroll-pad-btn" aria-label="Previous section" onClick={() => onCommand({ type: 'SCROLL_SECTION_STEP', sectionDirection: 'prev' })}>
            <ChevronUp size={18} aria-hidden="true" /> Previous section
          </button>
          <button type="button" className="scroll-pad-btn" aria-label="Next section" onClick={() => onCommand({ type: 'SCROLL_SECTION_STEP', sectionDirection: 'next' })}>
            <ChevronDown size={18} aria-hidden="true" /> Next section
          </button>
        </div>
      </div>

      <div className="scroll-pad-section">
        <span className="scroll-pad-label">Zoom</span>
        <div className="scroll-pad-zoom-row">
          <button type="button" className="scroll-pad-btn scroll-pad-btn--icon" aria-label="Zoom out" onClick={() => onCommand({ type: 'ZOOM_CONTENT', zoomAction: 'out' })}>
            <Minus size={18} aria-hidden="true" />
          </button>
          <input
            type="range"
            className="scroll-pad-slider"
            aria-label="Content zoom percent"
            min={CONTENT_ZOOM_MIN}
            max={CONTENT_ZOOM_MAX}
            step={CONTENT_ZOOM_STEP}
            value={sliderZoom}
            onChange={(event) => handleSliderChange(Number(event.target.value))}
          />
          <button type="button" className="scroll-pad-btn scroll-pad-btn--icon" aria-label="Zoom in" onClick={() => onCommand({ type: 'ZOOM_CONTENT', zoomAction: 'in' })}>
            <Plus size={18} aria-hidden="true" />
          </button>
          <button type="button" className="scroll-pad-btn scroll-pad-btn--icon" aria-label="Reset zoom to 100 percent" onClick={() => onCommand({ type: 'ZOOM_CONTENT', zoomAction: 'reset' })}>
            <RotateCcw size={18} aria-hidden="true" />
          </button>
        </div>
        <div className="scroll-pad-grid scroll-pad-grid--four">
          {ZOOM_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              className="scroll-pad-chip"
              aria-pressed={zoomLevel === preset}
              onClick={() => onCommand({ type: 'ZOOM_CONTENT', zoomAction: 'set', zoomLevel: preset })}
            >
              {preset}%
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
