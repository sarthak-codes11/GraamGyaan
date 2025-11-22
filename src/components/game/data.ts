import type { GameItem } from "./types";

export const GAME_ITEMS: GameItem[] = [
  {
    key: "spoon",
    label: "Spoon",
    solubleInsoluble: "insoluble",
    hint: "Metal spoon does not dissolve in water and is a metal object.",
  },
  {
    key: "glass",
    label: "Glass",
    solubleInsoluble: "insoluble",
    hint: "A plastic glass does not dissolve and is plastic.",
  },
  {
    key: "eraser",
    label: "Eraser",
    solubleInsoluble: "insoluble",
    hint: "An eraser is made of rubber/plastic and does not dissolve.",
  },
  {
    key: "leaf",
    label: "Leaf",
    solubleInsoluble: "insoluble",
    hint: "A leaf does not dissolve in water and is not metal.",
  },
  {
    key: "coin",
    label: "Coin",
    solubleInsoluble: "insoluble",
    hint: "A coin is made of metal and does not dissolve.",
  },
  {
    key: "sugar",
    label: "Sugar",
    solubleInsoluble: "soluble",
    hint: "Sugar dissolves in water, so it’s soluble!",
  },
  {
    key: "salt",
    label: "Salt",
    solubleInsoluble: "soluble",
    hint: "Salt dissolves in water, so it’s soluble!",
  },
  {
    key: "stone",
    label: "Stone",
    solubleInsoluble: "insoluble",
    hint: "A stone is not metal-plastic category friendly and does not dissolve.",
  },
];
