import { format, formatDistanceToNow } from 'date-fns';

export const formatDate = (date: string | Date, formatStr: string = 'PPP'): string => {
  return format(new Date(date), formatStr);
};

export const formatDateTime = (date: string | Date): string => {
  return format(new Date(date), 'PPp');
};

export const formatRelativeTime = (date: string | Date): string => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

export const formatPercentage = (num: number, decimals: number = 1): string => {
  return `${num.toFixed(decimals)}%`;
};

export const formatSentimentScore = (score: number): string => {
  const percentage = ((score + 1) / 2) * 100; // Convert -1 to 1 range to 0-100
  return `${percentage.toFixed(0)}%`;
};

export const truncateText = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const formatPlatformName = (platform: string): string => {
  return platform
    .split('_')
    .map((word) => capitalizeFirst(word))
    .join(' ');
};
