import { Animated } from 'react-native';

export type SuggestionLevel = "high" | "middle" | "low";

export interface TabItem {
  key: string;
  label: string;
  icon: string;
}

export interface Suggestion {
  text: string;
  color: string;
  icon: string;
}

export interface FootprintHistoryItem {
  _id?: string;
  createdAt?: string;
  total?: number;
  level?: string;
  transportation?: Record<string, number>;
  electricity?: { kwh: number };
}

export interface FootprintTabsScreenState {
  activeTab: string;
  level: SuggestionLevel | null;
  result: number | null;
  loading: boolean;
  input: string;
  fadeAnim: Animated.Value;
  history: FootprintHistoryItem[];
  showHistory: boolean;
}
