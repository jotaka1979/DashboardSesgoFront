export interface Distribution {
  count: number;
  label: string;
  percentage: number;
  code: string;
  color?: string;
  selected?: boolean;
}

export interface DistributionResult {
  hate: Distribution[]; 
  type: Distribution[]; 
  intensity: Distribution[]; 
  language: Distribution[]; 
  user: Distribution[];
  emoji: Distribution[];
  hashtag: Distribution[];
  word: Distribution[];
}