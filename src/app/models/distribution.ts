export interface Distribution {
  count: number;
  label: string;
  percentage: number; 
  color?: string;
}

export interface DistributionResult {
  result: Distribution[]; 
}