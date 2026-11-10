/**
 * FASAL Revamp Dashboard - Nutrition & Food Security Formatters
 */

export function formatPercent(value: number, decimals: number = 1): string {
  if (value === null || value === undefined || isNaN(value)) return '0.0%';
  return `${value.toFixed(decimals)}%`;
}

export function formatDelta(value: number, unit: string = 'pp'): string {
  if (value === null || value === undefined || isNaN(value)) return '+0.0 pp';
  const prefix = value > 0 ? '+' : '';
  return `${prefix}${value.toFixed(1)} ${unit}`;
}

export function formatCount(value: number): string {
  if (value === null || value === undefined || isNaN(value)) return '0';
  return value.toLocaleString('en-IN');
}

export interface FoodCategoryStyle {
  label: string;
  hindiLabel: string;
  dotColor: string;
  borderColor: string;
  bgColor: string;
  textColor: string;
  description: string;
}

export const FOOD_CATEGORY_STYLES: Record<'white' | 'green' | 'yellow', FoodCategoryStyle> = {
  white: {
    label: 'White Foods (Cereals & Dairy)',
    hindiLabel: 'Safed Bhojan',
    dotColor: '#D4D4D8', // Zinc/Ivory
    borderColor: '#A1A1AA',
    bgColor: 'rgba(212, 212, 216, 0.15)',
    textColor: 'text-content-primary',
    description: 'Rice, wheat, milk, and curd providing universal caloric baseline stability',
  },
  green: {
    label: 'Green Foods (Vegetables)',
    hindiLabel: 'Hara Bhojan',
    dotColor: '#047857', // Emerald
    borderColor: '#34D399',
    bgColor: 'rgba(4, 120, 87, 0.15)',
    textColor: 'text-accent-growth',
    description: 'Leafy greens, cucurbits, and okra delivering vitamins A, C, iron, and folate',
  },
  yellow: {
    label: 'Yellow Foods (Pulses & Spices)',
    hindiLabel: 'Peela Bhojan',
    dotColor: '#92400E', // Ochre / Amber
    borderColor: '#F59E0B',
    bgColor: 'rgba(146, 64, 14, 0.15)',
    textColor: 'text-accent-harvest',
    description: 'Dal (arhar, moong, gram), turmeric, and mustard oil providing protein and curcumin',
  },
};
