import { Box, Card, CardContent, Chip, Grid, Paper, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAnalyticsData } from '@/store/slices/analytics';

const Analytics: React.FC = () => {
  const dispatch = useAppDispatch();
  const { platformSentimentData, radarChartData, detailedTopics, loading, error } =
    useAppSelector((state) => state.analytics);

  useEffect(() => {
    console.log('Analytics: Fetching data...');
    dispatch(fetchAnalyticsData({ productId: 1, daysBack: 30 }));
  }, [dispatch]);

  // Debug logging
  useEffect(() => {
    console.log('Analytics: State updated:', {
      platformSentimentDataCount: platformSentimentData?.length,
      radarChartDataCount: radarChartData?.length,
      detailedTopicsCount: detailedTopics?.length,
      loading,
      error,
    });
  }, [platformSentimentData, radarChartData, detailedTopics, loading, error]);

  // Transform platform data for bar chart
  const platformChartData = platformSentimentData.map((platform) => ({
    platform: platform.platform.replace('_', ' '),
    positive: platform.counts.positive,
    negative: platform.counts.negative,
    neutral: platform.counts.neutral,
  }));

  // Radar chart data is already transformed in Redux
  const topicRadarData = radarChartData.map((item) => ({
    topic: item.category,
    score: item.value,
  }));

  // Show loading state
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Typography variant="h6">Loading analytics data...</Typography>
      </Box>
    );
  }

  // Show error state
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="error" gutterBottom>
          Error loading analytics data
        </Typography>
        <Typography variant="body1">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="600">
        Analytics
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Deep dive into your brand reputation metrics
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Platform Sentiment Breakdown */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" gutterBottom>
              Sentiment by Platform
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart data={platformChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="platform" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="positive" stackId="a" fill="#4caf50" />
                <Bar dataKey="neutral" stackId="a" fill="#9e9e9e" />
                <Bar dataKey="negative" stackId="a" fill="#f44336" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Topic Radar Chart */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '400px' }}>
            <Typography variant="h6" gutterBottom>
              Topic Analysis
            </Typography>
            <ResponsiveContainer width="100%" height="90%">
              <RadarChart data={topicRadarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="topic" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#1976d2"
                  fill="#1976d2"
                  fillOpacity={0.6}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Topic Details */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Detailed Topic Analysis
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {detailedTopics.map((topic) => (
                <Grid item xs={12} md={6} key={topic.topic}>
                  <Box
                    sx={{
                      p: 2,
                      border: '1px solid #e0e0e0',
                      borderRadius: 1,
                      '&:hover': { bgcolor: '#f5f5f5' },
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 1,
                      }}
                    >
                      <Typography variant="subtitle1" fontWeight="600">
                        {topic.topic}
                      </Typography>
                      <Chip
                        label={`${topic.mentions} mentions`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                      <Chip
                        label={`Sentiment: ${topic.sentiment}`}
                        size="small"
                        color={
                          topic.sentiment_raw > 0
                            ? 'success'
                            : topic.sentiment_raw < 0
                              ? 'error'
                              : 'default'
                        }
                      />
                      <Chip
                        label={`Trend: ${topic.trend}`}
                        size="small"
                        color={topic.trend_raw > 0 ? 'success' : topic.trend_raw < 0 ? 'error' : 'default'}
                      />
                      <Chip
                        label={`Change: ${topic.change_from_previous.absolute_change > 0 ? '+' : ''}${topic.change_from_previous.absolute_change}`}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                      <Chip
                        label={`Positive: ${topic.sentiment_breakdown.positive}`}
                        size="small"
                        sx={{ bgcolor: '#e8f5e9', color: '#2e7d32' }}
                      />
                      <Chip
                        label={`Neutral: ${topic.sentiment_breakdown.neutral}`}
                        size="small"
                        sx={{ bgcolor: '#f5f5f5', color: '#757575' }}
                      />
                      <Chip
                        label={`Negative: ${topic.sentiment_breakdown.negative}`}
                        size="small"
                        sx={{ bgcolor: '#ffebee', color: '#c62828' }}
                      />
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;
