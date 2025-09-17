"use client";

import React, { useMemo, useRef } from "react";
import Image from "next/image";
import { motion, type PanInfo } from "framer-motion";
import type { GameItem } from "./types";

export type DraggableItemProps = {
  item: GameItem;
  onDropAttempt: (item: GameItem, point: { x: number; y: number }) => void;
};

export const DraggableItem: React.FC<DraggableItemProps> = ({ item, onDropAttempt }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  // Random starting position for fun scattered layout
  const start = useMemo(() => ({
    x: Math.round(Math.random() * 120 - 60),
    y: Math.round(Math.random() * 60 - 30),
    r: Math.round(Math.random() * 6 - 3),
  }), []);

  const simulateDropTo = (targetId: string) => {
    const el = document.getElementById(targetId);
    const rect = el?.getBoundingClientRect();
    if (!rect) return;
    const point = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    onDropAttempt(item, point);
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (e.key === "ArrowLeft" || e.key === "1") {
      e.preventDefault();
      simulateDropTo("left-zone");
    } else if (e.key === "ArrowRight" || e.key === "2") {
      e.preventDefault();
      simulateDropTo("right-zone");
    }
  };

  return (
    <motion.div
      ref={ref}
      className="relative z-10 select-none cursor-grab active:cursor-grabbing"
      initial={{ x: start.x, y: start.y, rotate: start.r }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      whileDrag={{ zIndex: 50 }}
      drag
      dragMomentum={false}
      role="button"
      tabIndex={0}
      aria-label={`Draggable item: ${item.label}`}
      onKeyDown={onKeyDown}
      style={{ zIndex: 10, touchAction: "none" }}
      onDragEnd={(_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        onDropAttempt(item, { x: info.point.x, y: info.point.y });
      }}
    >
      <div
        className="rounded-2xl px-4 py-3 text-sm font-bold shadow-md border-2 min-w-[140px] min-h-[52px] sm:min-h-[48px] flex items-center gap-2 justify-center"
        style={{
          background: "#FDF3FF",
          borderColor: "#F1C6FF",
          color: "#7A2E8E",
        }}
      >
        <Image
          src={`/items/${item.key}.svg`}
          alt={item.label}
          width={28}
          height={28}
          className="shrink-0"
        />
        <span>{item.label}</span>
      </div>
    </motion.div>
  );
};

export default DraggableItem;
