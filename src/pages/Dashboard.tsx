import React, { useEffect, useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Alert as MuiAlert,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  Lightbulb as InsightIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  TipsAndUpdates as TipsIcon,
  Cached as CachedIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchDashboardData } from '@/store/slices/analytics';
import { fetchAlertStats } from '@/store/slices/alerts';
import {
  formatReputationScore,
  getPriorityColor,
  getScoreColor,
} from '@/utils/dashboardHelpers';
import { generateDashboardInsights } from '@/services/dashboardInsights';
import { DashboardData } from '@/types/analytics';

interface DashboardInsight {
  summary: string;
  keyFindings: string[];
  recommendations: string[];
  urgentActions: string[];
}

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    reputationScore,
    sentimentTrend,
    sentimentDistribution,
    platformStats,
    topIssues,
    loading,
    error,
  } = useAppSelector((state) => state.analytics);
  const alertStats = useAppSelector((state) => state.alerts.stats);
  const [insights, setInsights] = useState<DashboardInsight | null>(null);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [insightsError, setInsightsError] = useState<string | null>(null);
  const [showDetailedInsights, setShowDetailedInsights] = useState(false);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [dataHash, setDataHash] = useState<string | null>(null);
  const [isCachedInsights, setIsCachedInsights] = useState(false);

  // Utility functions for local storage and data hashing
  const generateDataHash = (data: DashboardData): string => {
    const keyData = {
      reputation_score: data.reputation_score?.current_score,
      sentiment_distribution: data.sentiment_distribution,
      top_issues_count: data.top_issues_requiring_attention?.length,
      platform_count: data.platform_distribution?.platforms?.length,
      total_mentions: data.dashboard_data?.total_mentions,
      generated_at: data.dashboard_data?.generated_at,
    };
    return btoa(JSON.stringify(keyData)).slice(0, 16); // Simple hash
  };

  const getCachedInsights = (hash: string): DashboardInsight | null => {
    try {
      const cached = localStorage.getItem(`dashboard_insights_${hash}`);
      if (cached) {
        const parsed = JSON.parse(cached);
        // Check if cache is less than 24 hours old
        const cacheTime = new Date(parsed.timestamp).getTime();
        const now = new Date().getTime();
        const hoursDiff = (now - cacheTime) / (1000 * 60 * 60);

        if (hoursDiff < 24) {
          console.log('Using cached insights');
          return parsed.insights;
        } else {
          console.log('Cached insights expired, removing...');
          localStorage.removeItem(`dashboard_insights_${hash}`);
        }
      }
    } catch (error) {
      console.error('Error reading cached insights:', error);
    }
    return null;
  };

  const saveInsightsToCache = (
    hash: string,
    insights: DashboardInsight
  ): void => {
    try {
      const cacheData = {
        insights,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(
        `dashboard_insights_${hash}`,
        JSON.stringify(cacheData)
      );
      console.log('Insights saved to cache');
    } catch (error) {
      console.error('Error saving insights to cache:', error);
    }
  };

  useEffect(() => {
    console.log('Dashboard: Fetching data...');
    const fetchData = async () => {
      const result = await dispatch(
        fetchDashboardData({ productId: 1, daysBack: 30 })
      );
      if (result.payload) {
        const data = result.payload as DashboardData;
        setDashboardData(data);

        // Generate hash for current data
        const currentHash = generateDataHash(data);
        setDataHash(currentHash);

        // Check if we have cached insights for this data
        const cachedInsights = getCachedInsights(currentHash);
        if (cachedInsights) {
          setInsights(cachedInsights);
          setInsightsError(null);
          setIsCachedInsights(true);
        } else {
          // Auto-generate insights if no cache available
          setIsCachedInsights(false);
          generateInsightsAutomatically(data, currentHash);
        }
      }
    };
    fetchData();
    dispatch(fetchAlertStats());
  }, [dispatch]);

  const generateInsightsAutomatically = async (
    data: DashboardData,
    hash: string
  ) => {
    setInsightsLoading(true);
    setInsightsError(null);

    try {
      const generatedInsights = await generateDashboardInsights(data);
      setInsights(generatedInsights);

      // Save to cache
      saveInsightsToCache(hash, generatedInsights);
      setIsCachedInsights(false);
    } catch (error) {
      console.error('Error generating insights:', error);
      setInsightsError(
        error instanceof Error ? error.message : 'Failed to generate insights'
      );
    } finally {
      setInsightsLoading(false);
    }
  };

  const handleGenerateInsights = async () => {
    if (!dashboardData || !dataHash) {
      setInsightsError(
        'Dashboard data not available. Please wait for data to load.'
      );
      return;
    }

    setInsightsLoading(true);
    setInsightsError(null);

    try {
      const generatedInsights = await generateDashboardInsights(dashboardData);
      setInsights(generatedInsights);

      // Save to cache
      saveInsightsToCache(dataHash, generatedInsights);
      setIsCachedInsights(false);
    } catch (error) {
      console.error('Error generating insights:', error);
      setInsightsError(
        error instanceof Error ? error.message : 'Failed to generate insights'
      );
    } finally {
      setInsightsLoading(false);
    }
  };

  const clearInsightsCache = () => {
    if (dataHash) {
      localStorage.removeItem(`dashboard_insights_${dataHash}`);
      setIsCachedInsights(false);
      console.log('Cache cleared');
    }
  };

  // Format reputation score for display
  const formattedScore = formatReputationScore(reputationScore);

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case 'increase':
        return <TrendingUp sx={{ color: 'inherit', fontSize: '2.5rem' }} />;
      case 'decrease':
        return <TrendingDown sx={{ color: 'inherit', fontSize: '2.5rem' }} />;
      default:
        return <TrendingFlat sx={{ color: 'inherit', fontSize: '2.5rem' }} />;
    }
  };

  const SENTIMENT_COLORS = {
    positive: '#4caf50',
    negative: '#f44336',
    neutral: '#9e9e9e',
  };

  const sentimentData = sentimentTrend.map((item) => ({
    date: new Date(item.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    positive: item.positive,
    negative: item.negative,
    neutral: item.neutral,
  }));

  const platformData = platformStats.map((stat) => ({
    name: stat.platform,
    value: stat.count,
  }));

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
        <Typography variant="h6">Loading dashboard data...</Typography>
      </Box>
    );
  }

  // Show error state
  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="error" gutterBottom>
          Error loading dashboard data
        </Typography>
        <Typography variant="body1">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Left Column - Main Content */}
        <Grid item xs={12} md={6}>
          <Grid container spacing={3}>
            {/* Reputation Score */}
            <Grid item xs={12} sm={6}>
              <Card
                sx={{
                  height: '100%',
                  background: `linear-gradient(135deg, ${formattedScore.color} 0%, ${formattedScore.lightColor} 100%)`,
                  color: formattedScore.textColor,
                  boxShadow: 3,
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background:
                      'linear-gradient(45deg, rgba(0,0,0,0.1) 0%, transparent 100%)',
                    pointerEvents: 'none',
                  },
                }}
              >
                <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 1,
                    }}
                  >
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{
                        mb: 0,
                        color: formattedScore.textColor,
                        textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                      }}
                    >
                      Reputation Score
                    </Typography>
                    {reputationScore && (
                      <Chip
                        label={reputationScore.score_interpretation.status.toUpperCase()}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(255, 255, 255, 0.25)',
                          backdropFilter: 'blur(10px)',
                          color: formattedScore.textColor,
                          fontWeight: 700,
                          border: `1px solid rgba(255, 255, 255, 0.3)`,
                          textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                        }}
                      />
                    )}
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <Typography
                      variant="h2"
                      fontWeight="700"
                      sx={{
                        color: formattedScore.textColor,
                        textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {reputationScore?.current_score?.toFixed(1) || '0.0'}
                    </Typography>
                    <Box
                      sx={{
                        filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))',
                        color: formattedScore.textColor,
                      }}
                    >
                      {getTrendIcon(formattedScore.changeIcon)}
                    </Box>
                  </Box>
                  {reputationScore?.previous_score !== undefined && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: formattedScore.textColor,
                        opacity: 0.85,
                        textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                        display: 'block',
                        mb: 1,
                      }}
                    >
                      Previous: {reputationScore.previous_score.toFixed(1)}
                    </Typography>
                  )}
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 1,
                      color: formattedScore.textColor,
                      textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                      fontWeight: 500,
                    }}
                  >
                    {formattedScore.changeText}
                  </Typography>
                  {reputationScore && (
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 1,
                        display: 'block',
                        opacity: 0.95,
                        color: formattedScore.textColor,
                        textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                        lineHeight: 1.4,
                      }}
                    >
                      {reputationScore.score_interpretation.description}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Active Alerts */}
            <Grid item xs={12} sm={6}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom color="text.secondary">
                    Active Alerts
                  </Typography>
                  <Typography variant="h2" fontWeight="700" color="error.main">
                    {alertStats?.total_active || 0}
                  </Typography>
                  <Box
                    sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}
                  >
                    <Chip
                      label={`${alertStats?.by_severity.critical || 0} Critical`}
                      color="error"
                      size="small"
                    />
                    <Chip
                      label={`${alertStats?.by_severity.high || 0} High`}
                      color="warning"
                      size="small"
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Sentiment Trend */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3, height: '400px' }}>
                <Typography variant="h6" gutterBottom>
                  Sentiment Trend (Last 30 Days)
                </Typography>
                <ResponsiveContainer width="100%" height="90%">
                  <LineChart data={sentimentData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="positive"
                      stroke={SENTIMENT_COLORS.positive}
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="negative"
                      stroke={SENTIMENT_COLORS.negative}
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="neutral"
                      stroke={SENTIMENT_COLORS.neutral}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>

            {/* AI Insights Section */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <InsightIcon color="primary" />
                    <Typography variant="h6" fontWeight="600">
                      AI-Powered Insights & Recommendations
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      onClick={handleGenerateInsights}
                      disabled={insightsLoading || !dashboardData}
                      startIcon={
                        insightsLoading ? (
                          <CircularProgress size={20} />
                        ) : (
                          <TipsIcon />
                        )
                      }
                    >
                      {insightsLoading
                        ? 'Generating...'
                        : insights
                          ? 'Regenerate Insights'
                          : 'Generate Insights'}
                    </Button>
                  </Box>
                </Box>

                {insightsError && (
                  <MuiAlert severity="error" sx={{ mb: 2 }}>
                    {insightsError}
                  </MuiAlert>
                )}

                {insightsLoading && (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <CircularProgress sx={{ mb: 2 }} />
                    <Typography variant="body1" color="text.secondary">
                      Generating AI-powered insights...
                    </Typography>
                  </Box>
                )}

                {!insights && !insightsLoading && !insightsError && (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <TipsIcon
                      sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }}
                    />
                    <Typography variant="body1" color="text.secondary">
                      Loading insights...
                    </Typography>
                  </Box>
                )}

                {insights && !insightsLoading && (
                  <Grid container spacing={3}>
                    {/* Executive Summary */}
                    <Grid item xs={12}>
                      <Card sx={{ bgcolor: '#e3f2fd' }}>
                        <CardContent>
                          <Typography
                            variant="subtitle2"
                            color="primary"
                            gutterBottom
                            fontWeight="600"
                          >
                            Executive Summary
                          </Typography>
                          <Typography variant="body1">
                            {insights.summary}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Collapsed view - Show only Key Findings */}
                    {!showDetailedInsights && (
                      <>
                        <Grid item xs={12}>
                          <Card sx={{ height: '100%' }}>
                            <CardContent>
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1,
                                  mb: 2,
                                }}
                              >
                                <InsightIcon color="info" />
                                <Typography variant="h6" fontWeight="600">
                                  Key Findings
                                </Typography>
                              </Box>
                              <List dense>
                                {insights.keyFindings.map((finding, index) => (
                                  <ListItem key={index} sx={{ pl: 0 }}>
                                    <ListItemIcon sx={{ minWidth: 36 }}>
                                      <CheckIcon
                                        color="info"
                                        fontSize="small"
                                      />
                                    </ListItemIcon>
                                    <ListItemText primary={finding} />
                                  </ListItem>
                                ))}
                              </List>
                            </CardContent>
                          </Card>
                        </Grid>
                        <Grid item xs={12}>
                          <Box sx={{ textAlign: 'center', mt: 2 }}>
                            <Button
                              variant="outlined"
                              onClick={() => setShowDetailedInsights(true)}
                              startIcon={<TipsIcon />}
                              size="large"
                            >
                              Show Detailed Recommendations
                            </Button>
                          </Box>
                        </Grid>
                      </>
                    )}

                    {/* Detailed view - All three sections in columns */}
                    {showDetailedInsights && (
                      <>
                        {/* Key Findings */}
                        <Grid item xs={12}>
                          <Card sx={{ height: '100%' }}>
                            <CardContent>
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1,
                                  mb: 2,
                                }}
                              >
                                <InsightIcon color="info" />
                                <Typography variant="h6" fontWeight="600">
                                  Key Findings
                                </Typography>
                              </Box>
                              <List dense>
                                {insights.keyFindings.map((finding, index) => (
                                  <ListItem key={index} sx={{ pl: 0 }}>
                                    <ListItemIcon sx={{ minWidth: 36 }}>
                                      <CheckIcon
                                        color="info"
                                        fontSize="small"
                                      />
                                    </ListItemIcon>
                                    <ListItemText primary={finding} />
                                  </ListItem>
                                ))}
                              </List>
                            </CardContent>
                          </Card>
                        </Grid>

                        {/* Recommendations */}
                        <Grid item xs={12}>
                          <Card sx={{ height: '100%' }}>
                            <CardContent>
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1,
                                  mb: 2,
                                }}
                              >
                                <TipsIcon color="success" />
                                <Typography variant="h6" fontWeight="600">
                                  Recommendations
                                </Typography>
                              </Box>
                              <List dense>
                                {insights.recommendations.map((rec, index) => (
                                  <ListItem key={index} sx={{ pl: 0 }}>
                                    <ListItemIcon sx={{ minWidth: 36 }}>
                                      <CheckIcon
                                        color="success"
                                        fontSize="small"
                                      />
                                    </ListItemIcon>
                                    <ListItemText primary={rec} />
                                  </ListItem>
                                ))}
                              </List>
                            </CardContent>
                          </Card>
                        </Grid>

                        {/* Urgent Actions */}
                        <Grid item xs={12}>
                          <Card sx={{ height: '100%', bgcolor: '#fff3e0' }}>
                            <CardContent>
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1,
                                  mb: 2,
                                }}
                              >
                                <WarningIcon color="warning" />
                                <Typography variant="h6" fontWeight="600">
                                  Urgent Actions
                                </Typography>
                              </Box>
                              <List dense>
                                {insights.urgentActions.map((action, index) => (
                                  <ListItem key={index} sx={{ pl: 0 }}>
                                    <ListItemIcon sx={{ minWidth: 36 }}>
                                      <WarningIcon
                                        color="warning"
                                        fontSize="small"
                                      />
                                    </ListItemIcon>
                                    <ListItemText primary={action} />
                                  </ListItem>
                                ))}
                              </List>
                            </CardContent>
                          </Card>
                        </Grid>
                      </>
                    )}
                  </Grid>
                )}
              </Paper>
            </Grid>

            {/* Sentiment Distribution */}
            <Grid item xs={12}>
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
                        `${value} mentions (${props.payload.percentage.toFixed(1)}%)`,
                        name,
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Paper>
            </Grid>
          </Grid>
        </Grid>

        {/* Right Column - Top Issues (Fixed/Locked) */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              height: 'calc(100vh - 150px)',
              overflow: 'auto',
              position: 'sticky',
              top: 100,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Top Issues Requiring Attention
            </Typography>
            <Box sx={{ mt: 2 }}>
              {topIssues.slice(0, 10).map((issue, index) => (
                <Box
                  key={`${issue.issue_category}-${index}`}
                  sx={{
                    p: 2,
                    mb: 2,
                    border: '1px solid #e0e0e0',
                    borderRadius: 1,
                    '&:hover': { bgcolor: '#f5f5f5', cursor: 'pointer' },
                    transition: 'background-color 0.2s',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <Chip
                      label={issue.priority.toUpperCase()}
                      color={getPriorityColor(issue.priority)}
                      size="small"
                    />
                    <Chip
                      label={`${issue.total_mentions} mentions`}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                  <Typography variant="subtitle1" fontWeight="600">
                    {issue.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {issue.description}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
