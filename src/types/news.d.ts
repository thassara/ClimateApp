export type NewsItem = {
  id?: string;
  title: string;
  url: string;
  urlToImage?: string;
  source: { name: string };
  publishedAt?: string;
  summary?: string;
  description?: string;
  content?: string;
};
