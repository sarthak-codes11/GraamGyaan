export type ItemKey =
  | "spoon"
  | "glass"
  | "eraser"
  | "leaf"
  | "coin"
  | "sugar"
  | "salt"
  | "stone";

export type GameItem = {
  key: ItemKey;
  label: string;
  // classification
  solubleInsoluble: "soluble" | "insoluble";
  hint: string; // displayed on wrong drop
};

export type DropTarget = {
  id: string;
  label: string;
};
