"use client";

import React, { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { motion, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";
import { examplePhotos } from "@/lib/example-images";

export interface InfiniteGridProps {
  imagePathRoot?: string;
  itemCount?: number;
  itemGap?: number;
  columns?: number;
  itemWidth?: number;
  itemHeight?: number;
  className?: string;
}

interface DragState {
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  dragVelocityX: number;
  dragVelocityY: number;
  lastDragTime: number;
  mouseHasMoved: boolean;
  canDrag: boolean;
}

export const InfiniteGrid: React.FC<InfiniteGridProps> = ({
  imagePathRoot = "",
  itemCount = 20,
  itemGap = 50,
  columns = 4,
  itemWidth = 160,
  itemHeight = 150,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const isDraggingRef = useRef(false);

  const dragStateRef = useRef<DragState>({
    startX: 0,
    startY: 0,
    targetX: 0,
    targetY: 0,
    dragVelocityX: 0,
    dragVelocityY: 0,
    lastDragTime: 0,
    mouseHasMoved: false,
    canDrag: true,
  });

  const motionX = useMotionValue(0);
  const motionY = useMotionValue(0);

  const syncMotionValues = useCallback(() => {
    motionX.set(dragStateRef.current.targetX);
    motionY.set(dragStateRef.current.targetY);
  }, [motionX, motionY]);

  useEffect(() => {
    motionX.set(dragStateRef.current.targetX);
    motionY.set(dragStateRef.current.targetY);
  }, [motionX, motionY]);

  const config = useMemo(
    () => ({
      itemCount,
      itemGap,
      columns,
      itemWidth,
      itemHeight,
      ease: 0.075,
      momentumFactor: 200,
      scrollSpeed: 1,
      minCols: 10,
      minRows: 10,
      buffer: 4,
      directionBuffer: 500,
      velocityThreshold: 0.1,
      moveThreshold: 5,
      minDt: 10,
    }),
    [itemCount, itemGap, columns, itemWidth, itemHeight]
  );

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (dragStateRef.current.canDrag) {
      isDraggingRef.current = true;
      dragStateRef.current.mouseHasMoved = false;
      dragStateRef.current.startX = e.clientX;
      dragStateRef.current.startY = e.clientY;
      if (containerRef.current) {
        containerRef.current.style.cursor = "grabbing";
      }
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDraggingRef.current || !dragStateRef.current.canDrag) return;
      e.preventDefault();
      const { moveThreshold, minDt } = config;
      const deltaX = e.clientX - dragStateRef.current.startX;
      const deltaY = e.clientY - dragStateRef.current.startY;

      if (Math.abs(deltaX) > moveThreshold || Math.abs(deltaY) > moveThreshold) {
        dragStateRef.current.mouseHasMoved = true;
      }

      const now = Date.now();
      const dt = Math.max(minDt, now - dragStateRef.current.lastDragTime);
      dragStateRef.current.lastDragTime = now;
      dragStateRef.current.dragVelocityX = deltaX / dt;
      dragStateRef.current.dragVelocityY = deltaY / dt;
      dragStateRef.current.targetX += deltaX;
      dragStateRef.current.targetY += deltaY;
      dragStateRef.current.startX = e.clientX;
      dragStateRef.current.startY = e.clientY;

      syncMotionValues();
    },
    [config, syncMotionValues]
  );

  const handleMouseUp = useCallback(
    (e?: MouseEvent) => {
      if (e) e.preventDefault();
      if (isDraggingRef.current && dragStateRef.current.canDrag) {
        isDraggingRef.current = false;
        if (containerRef.current) {
          containerRef.current.style.cursor = "grab";
        }
        const { velocityThreshold, momentumFactor } = config;
        if (
          Math.abs(dragStateRef.current.dragVelocityX) > velocityThreshold ||
          Math.abs(dragStateRef.current.dragVelocityY) > velocityThreshold
        ) {
          dragStateRef.current.targetX += dragStateRef.current.dragVelocityX * momentumFactor;
          dragStateRef.current.targetY += dragStateRef.current.dragVelocityY * momentumFactor;
        }
        syncMotionValues();
      }
    },
    [config, syncMotionValues]
  );

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      if (!dragStateRef.current.canDrag) return;
      const { scrollSpeed } = config;
      dragStateRef.current.targetX += -e.deltaX * scrollSpeed;
      dragStateRef.current.targetY += -e.deltaY * scrollSpeed;
      syncMotionValues();
    },
    [config, syncMotionValues]
  );

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (dragStateRef.current.canDrag) {
      isDraggingRef.current = true;
      dragStateRef.current.mouseHasMoved = false;
      dragStateRef.current.startX = touch.clientX;
      dragStateRef.current.startY = touch.clientY;
      if (containerRef.current) {
        containerRef.current.style.cursor = "grabbing";
      }
    }
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      if (!isDraggingRef.current || !dragStateRef.current.canDrag) return;
      const { moveThreshold, minDt } = config;
      const deltaX = touch.clientX - dragStateRef.current.startX;
      const deltaY = touch.clientY - dragStateRef.current.startY;

      if (Math.abs(deltaX) > moveThreshold || Math.abs(deltaY) > moveThreshold) {
        dragStateRef.current.mouseHasMoved = true;
      }

      const now = Date.now();
      const dt = Math.max(minDt, now - dragStateRef.current.lastDragTime);
      dragStateRef.current.lastDragTime = now;
      dragStateRef.current.dragVelocityX = deltaX / dt;
      dragStateRef.current.dragVelocityY = deltaY / dt;
      dragStateRef.current.targetX += deltaX;
      dragStateRef.current.targetY += deltaY;
      dragStateRef.current.startX = touch.clientX;
      dragStateRef.current.startY = touch.clientY;

      syncMotionValues();
    },
    [config, syncMotionValues]
  );

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      e.preventDefault();
      if (isDraggingRef.current && dragStateRef.current.canDrag) {
        isDraggingRef.current = false;
        if (containerRef.current) {
          containerRef.current.style.cursor = "grab";
        }
        const { velocityThreshold, momentumFactor } = config;
        if (
          Math.abs(dragStateRef.current.dragVelocityX) > velocityThreshold ||
          Math.abs(dragStateRef.current.dragVelocityY) > velocityThreshold
        ) {
          dragStateRef.current.targetX += dragStateRef.current.dragVelocityX * momentumFactor;
          dragStateRef.current.targetY += dragStateRef.current.dragVelocityY * momentumFactor;
        }
        syncMotionValues();
      }
    },
    [config, syncMotionValues]
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isMounted, handleMouseMove, handleMouseUp]);

  const renderGridItems = useCallback(() => {
    if (!isMounted) return [];
    const elements: React.ReactNode[] = [];
    const { targetX, targetY } = dragStateRef.current;
    const {
      buffer,
      directionBuffer,
      itemWidth: w,
      itemHeight: h,
      itemGap: g,
      itemCount: total,
      columns: cols,
      minCols,
      minRows,
    } = config;

    const viewW = window.innerWidth * (1 + buffer);
    const viewH = window.innerHeight * (1 + buffer);

    const minColIdx = Math.min(Math.floor((-targetX - viewW / 2) / (w + g)), -minCols);
    const maxColIdx = Math.max(Math.ceil((-targetX + 1.5 * viewW + directionBuffer) / (w + g)), minCols);
    const minRowIdx = Math.min(Math.floor((-targetY - viewH / 2) / (h + g)), -minRows);
    const maxRowIdx = Math.max(Math.ceil((-targetY + 1.5 * viewH + directionBuffer) / (h + g)), minRows);

    for (let r = minRowIdx; r <= maxRowIdx; r++) {
      for (let c = minColIdx; c <= maxColIdx; c++) {
        const key = `${c},${r}`;
        const imgIndex = (Math.abs(r * cols + c) % total) + 1;
        const src = imagePathRoot
          ? `${imagePathRoot}${imgIndex}.png`
          : examplePhotos[(imgIndex - 1) % examplePhotos.length];

        elements.push(
          <motion.div
            key={key}
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 * Math.random() }}
            className="absolute h-[160px] w-[160px] rounded-2xl overflow-hidden shadow-md bg-muted"
            style={{
              left: `${c * (w + g)}px`,
              top: `${r * (h + g)}px`,
            }}
          >
            <img
              src={src}
              alt={`Image ${imgIndex}`}
              className="pointer-events-none h-full w-full object-cover"
              loading="lazy"
            />
          </motion.div>
        );
      }
    }

    return elements;
  }, [isMounted, config, imagePathRoot]);

  if (!isMounted) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-white text-black/60">
        Loading...
      </div>
    );
  }

  return (
    <div
      className={cn(
        "font-sans flex h-screen w-screen items-center justify-center overflow-hidden bg-[#f5f4f3] select-none",
        className
      )}
    >
      <div
        ref={containerRef}
        className="relative h-full w-full cursor-grab overflow-hidden"
        onMouseDown={handleMouseDown}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <motion.div
          className="absolute will-change-transform"
          style={{ x: motionX, y: motionY }}
        >
          {renderGridItems()}
        </motion.div>
      </div>
    </div>
  );
};

export const Skipper5: React.FC = () => {
  return <InfiniteGrid />;
};

export const DemoSkipper5 = Skipper5;
export default Skipper5;
