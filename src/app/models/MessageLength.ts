import { Histogram } from "./histogram";

export interface MessageLength {
  histogram: Histogram[];
  mean: number;
  median: number;

  std:number;
}