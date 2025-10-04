import { ReputationScore } from '@/types/analytics';

/**
 * Get color based on reputation score
 * @param score - Reputation score (0-100)
 * @returns Hex color string
 */
export const getScoreColor = (score: number): string => {
  if (score >= 80) return '#2e7d32'; // Dark Green for better contrast
  if (score >= 60) return '#ed6c02'; // Dark Orange for better contrast
  return '#d32f2f'; // Dark Red for better contrast
};

/**
 * Get text color for reputation score based on background
 * @param score - Reputation score (0-100)
 * @returns Text color (white or black)
 */
export const getScoreTextColor = (score: number): string => {
  // All our dark backgrounds work well with white text
  return '#ffffff';
};

/**
 * Get lighter color for gradient effect
 * @param score - Reputation score (0-100)
 * @returns Lighter hex color string
 */
export const getScoreLightColor = (score: number): string => {
  if (score >= 80) return '#4caf50'; // Lighter green
  if (score >= 60) return '#ff9800'; // Lighter orange
  return '#f44336'; // Lighter red
};

/**
 * Get score status badge color
 * @param status - Status from API (good, fair, poor)
 * @returns MUI color
 */
export const getScoreStatusColor = (status: string): 'success' | 'warning' | 'error' | 'default' => {
  switch (status.toLowerCase()) {
    case 'excellent':
    case 'good':
      return 'success';
    case 'fair':
    case 'moderate':
      return 'warning';
    case 'poor':
    case 'critical':
      return 'error';
    default:
      return 'default';
  }
};

/**
 * Format reputation score for display
 * @param score - Reputation score object from API
 * @returns Formatted display object
 */
export const formatReputationScore = (score: ReputationScore | null) => {
  if (!score) {
    return {
      displayScore: '0.0',
      color: getScoreColor(0),
      lightColor: getScoreLightColor(0),
      textColor: getScoreTextColor(0),
      changeText: 'No data',
      changeIcon: 'stable' as const,
      statusColor: 'default' as const,
    };
  }

  return {
    displayScore: score.current_score.toFixed(1),
    color: getScoreColor(score.current_score),
    lightColor: getScoreLightColor(score.current_score),
    textColor: getScoreTextColor(score.current_score),
    changeText: score.change_description,
    changeIcon: score.change_direction,
    statusColor: getScoreStatusColor(score.score_interpretation.status),
    interpretation: score.score_interpretation,
  };
};

/**
 * Get priority color for badges
 * @param priority - Priority level
 * @returns MUI color
 */
export const getPriorityColor = (
  priority: string
): 'error' | 'warning' | 'info' | 'default' => {
  switch (priority.toLowerCase()) {
    case 'critical':
      return 'error';
    case 'high':
      return 'warning';
    case 'medium':
      return 'info';
    default:
      return 'default';
  }
};

/**
 * Format large numbers for display
 * @param num - Number to format
 * @returns Formatted string (e.g., "1.2K", "3.4M")
 */
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

/**
 * Format percentage for display
 * @param value - Percentage value
 * @param decimals - Number of decimal places
 * @returns Formatted string with % sign
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Calculate sentiment trend direction
 * @param current - Current sentiment score
 * @param previous - Previous sentiment score
 * @returns Trend direction
 */
export const getSentimentTrend = (
  current: number,
  previous: number
): 'up' | 'down' | 'stable' => {
  const diff = current - previous;
  if (Math.abs(diff) < 0.5) return 'stable';
  return diff > 0 ? 'up' : 'down';
};

