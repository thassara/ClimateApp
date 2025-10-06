import type { NewsItem } from './news';

export interface AnimatedCardHorizontalProps {
  item: NewsItem;
  index: number;
  onPress: (item: NewsItem) => void;
  bookmarked: boolean;
  onBookmark: (id: string) => void;
}

export interface AnimatedCardVerticalProps {
  item: NewsItem;
  index: number;
  onPress: (item: NewsItem) => void;
  bookmarked: boolean;
  onBookmark: (id: string) => void;
}

export interface IsBookmarked {
  (id: string): boolean;
}

export interface HandleBookmark {
  (id: string): void;
}
