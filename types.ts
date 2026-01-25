
export type UnitSystem = 'imperial' | 'metric';
export type WeightUnit = 'kg' | 'lbs';

export interface CattleDimensions {
  height: number;
  length: number;
  heartGirth: number;
}

export interface PredictionResult {
  weight: number;
  metabolicWeight: number;
  feedSuggestions: FeedSuggestion[];
  confidence: number;
  timestamp: number;
  image: string;
  dimensions: CattleDimensions;
  units: UnitSystem;
}

export interface FeedSuggestion {
  type: string;
  amount: number;
  unit: string;
  description: string;
}

export interface ScalerParams {
  mean: number[];
  scale: number[];
  feature_names: string[];
}
