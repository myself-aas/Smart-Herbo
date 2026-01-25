
import { CattleDimensions, FeedSuggestion, PredictionResult, UnitSystem } from '../types';

export const INCHES_TO_CM = 2.54;
export const LBS_TO_KG = 0.453592;

export const convertToMetric = (val: number) => val * INCHES_TO_CM;
export const convertToImperial = (val: number) => val / INCHES_TO_CM;

export const calculateMetabolicWeight = (weightKg: number): number => {
  // Metabolic Weight formula: Weight^0.75
  return Math.pow(weightKg, 0.75);
};

export const getFeedSuggestions = (weightKg: number, metabolicWeight: number): FeedSuggestion[] => {
  // Reference baseline: 50g supplement for 200kg body weight
  // Reference Metabolic Weight = 200^0.75
  const refWeight = 200;
  const refMetabolicWeight = Math.pow(refWeight, 0.75);
  
  // Scaling equation based on metabolic weight
  const dosageGrams = (metabolicWeight / refMetabolicWeight) * 50;
  
  return [
    {
      type: 'Plantain Herb Supplement',
      amount: dosageGrams,
      unit: 'g/day',
      description: 'Dietary supplementation scaled by metabolic weight (50g per 200kg BW baseline).'
    }
  ];
};

export const formatWeight = (kg: number, targetUnit: 'kg' | 'lbs') => {
  if (targetUnit === 'kg') return `${kg.toFixed(1)} kg`;
  return `${(kg / LBS_TO_KG).toFixed(1)} lbs`;
};

export const validateDimensions = (dims: CattleDimensions): { isValid: boolean; error?: string } => {
  if (dims.height <= 0 || dims.length <= 0 || dims.heartGirth <= 0) {
    return { isValid: false, error: "Dimensions must be positive values." };
  }
  if (dims.height > 100 || dims.length > 150 || dims.heartGirth > 150) {
     return { isValid: false, error: "Values seem unrealistically high for standard cattle." };
  }
  return { isValid: true };
};
