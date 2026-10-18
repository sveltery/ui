export interface BrushStartEndIndex {
  startIndex: number;
  endIndex: number;
}
export type OnBrushUpdate = (newState: BrushStartEndIndex) => void;
