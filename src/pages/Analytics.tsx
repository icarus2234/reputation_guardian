import { Box, Button, Chip, Grid, Paper, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { format, subDays } from 'date-fns';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
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
import {
  fetchAnalyticsData,
  fetchDashboardData,
} from '@/store/slices/analytics';

const Analytics: React.FC = () => {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    platformSentimentData,
    radarChartData,
    detailedTopics,
    sentimentDistribution,
    loading,
    error,
  } = useAppSelector((state) => state.analytics);

  // Filter state
  const [startDate, setStartDate] = useState<Date | null>(() => {
    const daysBack = parseInt(searchParams.get('daysBack') || '30');
    return subDays(new Date(), daysBack);
  });
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [productId] = useState<number>(1);

  // Calculate days back from date range
  const calculateDaysBack = (start: Date | null, end: Date | null): number => {
    if (!start || !end) return 30;
    const diffTime = end.getTime() - start.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Ensure end date is always today
  useEffect(() => {
    setEndDate(new Date());
  }, []);

  useEffect(() => {
    console.log('Analytics: Fetching data...');
    const daysBack = calculateDaysBack(startDate, endDate);
    dispatch(fetchAnalyticsData({ productId, daysBack }));
    dispatch(fetchDashboardData({ productId, daysBack }));
  }, [dispatch, productId, startDate, endDate]);

  // Handle filter changes
  const handleApplyFilters = () => {
    const daysBack = calculateDaysBack(startDate, endDate);
    const newSearchParams = new URLSearchParams();
    newSearchParams.set('daysBack', daysBack.toString());
    if (startDate) {
      newSearchParams.set('startDate', format(startDate, 'yyyy-MM-dd'));
    }
    if (endDate) {
      newSearchParams.set('endDate', format(endDate, 'yyyy-MM-dd'));
    }
    setSearchParams(newSearchParams);
  };

  const handleClearFilters = () => {
    setStartDate(subDays(new Date(), 30));
    setEndDate(new Date()); // Always set to today
    setSearchParams({});
  };

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

  // Sentiment colors for pie chart
  const SENTIMENT_COLORS = {
    positive: '#4caf50',
    negative: '#f44336',
    neutral: '#9e9e9e',
  };

  // Use sentiment distribution from API - filter out 0 values
  const sentimentPieData = sentimentDistribution
    ? [
        {
          name: 'Positive',
          value: sentimentDistribution.counts.positive,
          percentage: sentimentDistribution.percentages.positive,
          color: SENTIMENT_COLORS.positive,
        },
        {
          name: 'Negative',
          value: sentimentDistribution.counts.negative,
          percentage: sentimentDistribution.percentages.negative,
          color: SENTIMENT_COLORS.negative,
        },
        {
          name: 'Neutral',
          value: sentimentDistribution.counts.neutral,
          percentage: sentimentDistribution.percentages.neutral,
          color: SENTIMENT_COLORS.neutral,
        },
      ].filter((item) => item.value > 0) // Only show sentiments with data
    : [];

  // Show loading state
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
        }}
      >
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
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        <Typography variant="h4" gutterBottom fontWeight="600">
          Analytics
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Deep dive into your brand reputation metrics
        </Typography>

        {/* Filter Bar */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Filters
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
                slotProps={{
                  textField: {
                    size: 'small',
                    fullWidth: true,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <DatePicker
                label="End Date (Today)"
                value={endDate}
                disabled
                slotProps={{
                  textField: {
                    size: 'small',
                    fullWidth: true,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  onClick={handleApplyFilters}
                  size="small"
                >
                  Apply Filters
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleClearFilters}
                  size="small"
                >
                  Clear
                </Button>
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Date range:{' '}
              {startDate && endDate
                ? `${format(startDate, 'MMM dd, yyyy')} - ${format(
                    endDate,
                    'MMM dd, yyyy'
                  )} (${calculateDaysBack(startDate, endDate)} days)`
                : 'Select date range'}
            </Typography>
          </Box>
        </Paper>

        <Grid container spacing={3} sx={{ mt: 2 }}>
          {/* Platform Sentiment Breakdown */}
          <Grid item xs={12} md={12}>
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
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '400px' }}>
              <Typography variant="h6" gutterBottom>
                Topic Analysis
              </Typography>
              <ResponsiveContainer width="100%" height="90%">
                <RadarChart data={topicRadarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="topic" />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={{ fontSize: 10, fill: '#666' }}
                  />
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

          {/* Sentiment Distribution */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: '400px' }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography variant="h6">Sentiment Distribution</Typography>
                {sentimentDistribution && (
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Chip
                      label={`Total: ${sentimentDistribution.total_mentions}`}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      label={`Dominant: ${sentimentDistribution.dominant_sentiment}`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                )}
              </Box>
              <ResponsiveContainer width="100%" height="85%">
                <PieChart>
                  <Pie
                    data={sentimentPieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) =>
                      `${entry.name}: ${entry.percentage.toFixed(1)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {sentimentPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any, name: any, props: any) => [
                      `${value} mentions (${props.payload.percentage.toFixed(
                        1
                      )}%)`,
                      name,
                    ]}
                  />
                </PieChart>
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
                      <Box
                        sx={{
                          display: 'flex',
                          gap: 1,
                          alignItems: 'center',
                          flexWrap: 'wrap',
                        }}
                      >
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
                          color={
                            topic.trend_raw > 0
                              ? 'success'
                              : topic.trend_raw < 0
                                ? 'error'
                                : 'default'
                          }
                        />
                        <Chip
                          label={`Change: ${
                            topic.change_from_previous.absolute_change > 0
                              ? '+'
                              : ''
                          }${topic.change_from_previous.absolute_change}`}
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
    </LocalizationProvider>
  );
};

export default Analytics;
