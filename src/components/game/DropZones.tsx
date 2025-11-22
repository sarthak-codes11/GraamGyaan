"use client";

import React from "react";
import { motion } from "framer-motion";

export type DropZonesProps = {
  leftLabel: string;
  rightLabel: string;
  leftRef: React.RefObject<HTMLDivElement>;
  rightRef: React.RefObject<HTMLDivElement>;
};

export const DropZones: React.FC<DropZonesProps> = ({ leftLabel, rightLabel, leftRef, rightRef }) => {
  return (
    <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-3xl mx-auto">
      <motion.div
        id="left-zone"
        ref={leftRef}
        className="rounded-3xl p-4 border-4 min-h-[110px] sm:min-h-[120px] flex items-center justify-center text-center font-extrabold"
        style={{ background: "#E6FAFB", borderColor: "#8AE1E8", color: "#0D7681" }}
        whileHover={{ scale: 1.02 }}
        aria-label={`${leftLabel} drop zone`}
      >
        <span>{leftLabel}</span>
      </motion.div>
      <motion.div
        id="right-zone"
        ref={rightRef}
        className="rounded-3xl p-4 border-4 min-h-[110px] sm:min-h-[120px] flex items-center justify-center text-center font-extrabold"
        style={{ background: "#FFF4E6", borderColor: "#FFD1A3", color: "#945200" }}
        whileHover={{ scale: 1.02 }}
        aria-label={`${rightLabel} drop zone`}
      >
        <span>{rightLabel}</span>
      </motion.div>
    </div>
  );
};

export default DropZones;
