import { useEffect, useRef } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import type { RemoteCommandInput } from '../services/presentationRemoteSync';
import { clampContentZoom } from '../utils/contentScrollControl';

const INERTIA_DECAY_PER_FRAME = 0.92;
const INERTIA_STOP_VELOCITY = 0.05; // px per ms
const INERTIA_MAX_VELOCITY = 4; // px per ms
const FLING_WINDOW_MS = 80;
const VELOCITY_SMOOTHING = 0.6;
const FRAME_MS = 16;

interface Point {
  x: number;
  y: number;
}

interface DragState {
  lastY: number;
  lastTime: number;
  velocity: number;
}

interface PinchState {
  startDistance: number;
  startZoom: number;
  lastSentLevel: number;
}

export interface ScrollPadGestureOptions {
  speedMultiplier: number;
  getZoomLevel: () => number;
  onCommand: (cmd: RemoteCommandInput) => void;
}

const distanceBetween = (a: Point, b: Point): number => Math.hypot(a.x - b.x, a.y - b.y);

/**
 * Touch gestures for the phone scroll pad.
 * One finger drags the main site (with momentum on release); two fingers pinch to zoom.
 * Scroll deltas are batched to one command per animation frame.
 */
export const useScrollPadGestures = (options: ScrollPadGestureOptions) => {
  const optionsRef = useRef(options);
  const pointersRef = useRef<Map<number, Point>>(new Map());
  const dragRef = useRef<DragState | null>(null);
  const pinchRef = useRef<PinchState | null>(null);
  const pendingDeltaRef = useRef(0);
  const flushFrameRef = useRef<number | null>(null);
  const inertiaFrameRef = useRef<number | null>(null);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  useEffect(() => () => {
    if (flushFrameRef.current !== null) cancelAnimationFrame(flushFrameRef.current);
    if (inertiaFrameRef.current !== null) cancelAnimationFrame(inertiaFrameRef.current);
  }, []);

  const flushScroll = () => {
    flushFrameRef.current = null;
    const delta = pendingDeltaRef.current;
    pendingDeltaRef.current = 0;
    if (delta !== 0) {
      optionsRef.current.onCommand({ type: 'SCROLL_BY', scrollDelta: delta, isContinuous: true });
    }
  };

  const queueScroll = (delta: number) => {
    pendingDeltaRef.current += delta;
    if (flushFrameRef.current === null) {
      flushFrameRef.current = requestAnimationFrame(flushScroll);
    }
  };

  const stopInertia = () => {
    if (inertiaFrameRef.current !== null) {
      cancelAnimationFrame(inertiaFrameRef.current);
      inertiaFrameRef.current = null;
    }
  };

  const startInertia = (initialVelocity: number) => {
    let velocity = Math.max(-INERTIA_MAX_VELOCITY, Math.min(INERTIA_MAX_VELOCITY, initialVelocity));
    let previousTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - previousTime;
      previousTime = now;
      queueScroll(velocity * elapsed);
      velocity *= INERTIA_DECAY_PER_FRAME ** (elapsed / FRAME_MS);
      if (Math.abs(velocity) < INERTIA_STOP_VELOCITY) {
        inertiaFrameRef.current = null;
        return;
      }
      inertiaFrameRef.current = requestAnimationFrame(step);
    };
    inertiaFrameRef.current = requestAnimationFrame(step);
  };

  const beginPinch = () => {
    const [first, second] = Array.from(pointersRef.current.values());
    dragRef.current = null;
    pinchRef.current = {
      startDistance: distanceBetween(first, second),
      startZoom: optionsRef.current.getZoomLevel(),
      lastSentLevel: Number.NaN,
    };
  };

  const updatePinch = (pinch: PinchState) => {
    const [first, second] = Array.from(pointersRef.current.values());
    if (pinch.startDistance === 0) return;
    const level = clampContentZoom(pinch.startZoom * (distanceBetween(first, second) / pinch.startDistance));
    if (level === pinch.lastSentLevel) return;
    pinch.lastSentLevel = level;
    optionsRef.current.onCommand({ type: 'ZOOM_CONTENT', zoomAction: 'set', zoomLevel: level, isContinuous: true });
  };

  const updateDrag = (drag: DragState, y: number, time: number) => {
    const scrollDelta = -(y - drag.lastY) * optionsRef.current.speedMultiplier;
    const elapsed = time - drag.lastTime;
    if (elapsed > 0) {
      const instantVelocity = scrollDelta / elapsed;
      drag.velocity = VELOCITY_SMOOTHING * instantVelocity + (1 - VELOCITY_SMOOTHING) * drag.velocity;
    }
    drag.lastY = y;
    drag.lastTime = time;
    queueScroll(scrollDelta);
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    stopInertia();
    if (pointersRef.current.size === 1) {
      dragRef.current = { lastY: event.clientY, lastTime: event.timeStamp, velocity: 0 };
    } else if (pointersRef.current.size === 2) {
      beginPinch();
    }
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const point = pointersRef.current.get(event.pointerId);
    if (!point) return;
    point.x = event.clientX;
    point.y = event.clientY;
    const pinch = pinchRef.current;
    if (pinch && pointersRef.current.size >= 2) {
      updatePinch(pinch);
      return;
    }
    if (dragRef.current) updateDrag(dragRef.current, event.clientY, event.timeStamp);
  };

  const releasePointer = (event: ReactPointerEvent<HTMLElement>, allowFling: boolean) => {
    pointersRef.current.delete(event.pointerId);
    pinchRef.current = null;
    const [remaining] = Array.from(pointersRef.current.values());
    if (remaining) {
      // Second finger lifted mid-pinch: keep dragging with the finger still down
      dragRef.current = { lastY: remaining.y, lastTime: event.timeStamp, velocity: 0 };
      return;
    }
    const drag = dragRef.current;
    dragRef.current = null;
    const isRecent = drag !== null && event.timeStamp - drag.lastTime < FLING_WINDOW_MS;
    if (allowFling && drag && isRecent && Math.abs(drag.velocity) > INERTIA_STOP_VELOCITY) {
      startInertia(drag.velocity);
    }
  };

  return {
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: (event: ReactPointerEvent<HTMLElement>) => releasePointer(event, true),
    onPointerCancel: (event: ReactPointerEvent<HTMLElement>) => releasePointer(event, false),
  };
};
