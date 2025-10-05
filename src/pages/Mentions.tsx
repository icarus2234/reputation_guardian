import {
  Android as AndroidIcon,
  Apple as AppleIcon,
  CheckCircle as CheckCircleIcon,
  Forum as ForumIcon,
  Instagram as InstagramIcon,
  OpenInNew as OpenInNewIcon,
  QuestionAnswer as QuoraIcon,
  Reddit as RedditIcon,
  Reply as ReplyIcon,
  Search as GoogleIcon,
  Star as TrustpilotIcon,
} from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  clearError,
  fetchMentions,
  markMention,
  setFilter,
  setPage,
  setPageSize,
  setSelectedMention,
} from '@/store/slices/mentions';
import { Mention, Platform, Sentiment } from '@/types/mention';

const Mentions: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { mentions, filter, loading, pagination, selectedMention, error } =
    useAppSelector((state) => state.mentions);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | ''>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    dispatch(
      fetchMentions({
        filter,
        page: pagination.page,
        pageSize: pagination.pageSize,
      })
    );
  }, [dispatch, filter, pagination.page, pagination.pageSize]);

  // Auto-apply filters when values change
  useEffect(() => {
    dispatch(
      setFilter({
        platforms: selectedPlatform ? [selectedPlatform] : undefined,
        from_date: startDate || undefined,
        to_date: endDate || undefined,
      })
    );
  }, [dispatch, selectedPlatform, startDate, endDate]);

  const handleClearFilters = () => {
    setSelectedPlatform('');
    setStartDate('');
    setEndDate('');
    dispatch(setFilter({}));
  };

  const handlePlatformChange = (event: SelectChangeEvent<Platform | ''>) => {
    const value = event.target.value as Platform | '';
    setSelectedPlatform(value);
  };

  const getSentimentColor = (sentiment: Sentiment) => {
    switch (sentiment) {
      case 'positive':
        return 'success';
      case 'negative':
        return 'error';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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

  const getPlatformLabel = (platform: Platform) => {
    return platform;
  };

  const getPlatformIcon = (platform: Platform) => {
    switch (platform) {
      case 'App Store':
        return <AppleIcon />;
      case 'Reddit':
        return <RedditIcon />;
      case 'Instagram':
        return <InstagramIcon />;
      case 'Google Serp':
        return <GoogleIcon />;
      case 'Quora':
        return <QuoraIcon />;
      case 'Google Play':
        return <AndroidIcon />;
      case 'Trustpilot':
        return <TrustpilotIcon />;
      default:
        return <ForumIcon />;
    }
  };

  const handleRowClick = (mention: Mention) => {
    dispatch(setSelectedMention(mention));
    setDetailsOpen(true);
  };

  const handleGenerateResponse = () => {
    if (selectedMention) {
      setDetailsOpen(false);
      navigate('/responses', { state: { mention: selectedMention } });
    }
  };

  const handleMarkAsResolved = async () => {
    if (selectedMention) {
      try {
        const result = await dispatch(
          markMention({ id: selectedMention.id, isMarked: true })
        );
        if (result.type.endsWith('/fulfilled')) {
          setDetailsOpen(false);
          // Optionally refresh the mentions list
          dispatch(
            fetchMentions({
              filter,
              page: pagination.page,
              pageSize: pagination.pageSize,
            })
          );
        }
      } catch (error) {
        console.error('Error marking mention as resolved:', error);
      }
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'platform',
      headerName: 'Platform',
      width: 90,
      flex: 0,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Tooltip title={getPlatformLabel(params.value)} arrow>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {getPlatformIcon(params.value)}
          </Box>
        </Tooltip>
      ),
    },
    {
      field: 'author',
      headerName: 'Author',
      minWidth: 130,
      flex: 0.8,
      renderCell: (params) => (
        <Typography variant="body2" noWrap>
          {params.value.name}
        </Typography>
      ),
    },
    {
      field: 'content',
      headerName: 'Content',
      flex: 2,
      minWidth: 250,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            whiteSpace: 'normal',
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'sentiment',
      headerName: 'Sentiment',
      width: 115,
      flex: 0,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getSentimentColor(params.value)}
          size="small"
        />
      ),
    },
    {
      field: 'intent',
      headerName: 'Intent',
      minWidth: 120,
      flex: 0.7,
      renderCell: (params) => <Chip label={params.value} size="small" />,
    },
    {
      field: 'priority',
      headerName: 'Priority',
      width: 100,
      flex: 0,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getPriorityColor(params.value)}
          size="small"
        />
      ),
    },
    {
      field: 'date',
      headerName: 'Date',
      width: 120,
      flex: 0,
      renderCell: (params) => (
        <Typography variant="body2" noWrap>
          {format(new Date(params.value), 'MMM dd, yyyy')}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      flex: 0,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton size="small" onClick={() => handleRowClick(params.row)}>
            <ReplyIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            href={params.row.metadata?.source_url}
            target="_blank"
            component="a"
          >
            <OpenInNewIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="600">
        Brand Mentions
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Monitor and manage all brand mentions across platforms
      </Typography>

      {/* Filters */}
      <Paper sx={{ p: 3, mt: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Platform</InputLabel>
              <Select value={selectedPlatform} onChange={handlePlatformChange}>
                <MenuItem value="">
                  <em>All Platforms</em>
                </MenuItem>
                {[
                  'App Store',
                  'Reddit',
                  'Instagram',
                  'Google Serp',
                  'Quora',
                  'Google Play',
                  'Trustpilot',
                ].map((platform) => (
                  <MenuItem key={platform} value={platform}>
                    {platform}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={2.5}>
            <TextField
              fullWidth
              type="date"
              label="Start Date"
              value={startDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setStartDate(e.target.value)
              }
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={2.5}>
            <TextField
              fullWidth
              type="date"
              label="End Date"
              value={endDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEndDate(e.target.value)
              }
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleClearFilters}
              sx={{ height: 56 }}
            >
              Clear
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Error Display */}
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          onClose={() => dispatch(clearError())}
        >
          {error}
        </Alert>
      )}

      {/* Data Grid */}
      <Paper
        sx={{ height: 'calc(100vh - 320px)', width: '100%', minHeight: 400 }}
      >
        <DataGrid
          rows={mentions}
          columns={columns}
          loading={loading}
          paginationMode="server"
          rowCount={pagination.total}
          paginationModel={{
            page: pagination.page - 1, // Convert 1-based to 0-based for DataGrid
            pageSize: pagination.pageSize,
          }}
          onPaginationModelChange={(model: {
            page: number;
            pageSize: number;
          }) => {
            const newPage = model.page + 1; // Convert 0-based to 1-based for backend
            if (newPage !== pagination.page) {
              dispatch(setPage(newPage));
            }
            if (model.pageSize !== pagination.pageSize) {
              dispatch(setPageSize(model.pageSize));
            }
          }}
          pageSizeOptions={[10, 25, 50, 100]}
          disableRowSelectionOnClick
          disableVirtualization={false}
          rowHeight={52}
          columnHeaderHeight={56}
          sx={{
            '& .MuiDataGrid-row:hover': {
              cursor: 'pointer',
            },
            '& .MuiDataGrid-virtualScroller': {
              minHeight: '300px',
            },
          }}
        />

        {/* Empty State */}
        {!loading && mentions.length === 0 && !error && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '300px',
              color: 'text.secondary',
            }}
          >
            <Typography variant="h6" gutterBottom>
              No mentions found
            </Typography>
            <Typography variant="body2">
              Try adjusting your filters or check back later for new mentions.
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedMention ? (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar src={selectedMention.author.avatar_url || undefined}>
                  {selectedMention.author.name[0]}
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {selectedMention.author.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {getPlatformLabel(selectedMention.platform)} •{' '}
                    {format(new Date(selectedMention.date), 'PPP')}
                  </Typography>
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body1" paragraph>
                  {selectedMention.content}
                </Typography>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Sentiment
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip
                      label={selectedMention.sentiment}
                      color={getSentimentColor(selectedMention.sentiment)}
                      size="small"
                    />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Intent
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip label={selectedMention.intent} size="small" />
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Priority
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <Chip
                      label={selectedMention.priority}
                      color={getPriorityColor(selectedMention.priority)}
                      size="small"
                    />
                  </Box>
                </Grid>
                {selectedMention.topics?.length > 0 && (
                  <Grid item xs={6}>
                    <Typography variant="caption" color="text.secondary">
                      Topics
                    </Typography>
                    <Box
                      sx={{
                        mt: 0.5,
                        display: 'flex',
                        gap: 0.5,
                        flexWrap: 'wrap',
                      }}
                    >
                      {selectedMention.topics.map((topic) => (
                        <Chip
                          key={topic}
                          label={topic}
                          size="small"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailsOpen(false)}>Close</Button>
              <Button
                variant="outlined"
                startIcon={<CheckCircleIcon />}
                onClick={handleMarkAsResolved}
                color="success"
              >
                Mark as Resolved
              </Button>
              <Button
                variant="contained"
                startIcon={<ReplyIcon />}
                onClick={handleGenerateResponse}
              >
                Generate Response
              </Button>
            </DialogActions>
          </>
        ) : (
          <DialogContent>
            <Typography variant="body1" color="text.secondary">
              No mention selected
            </Typography>
          </DialogContent>
        )}
      </Dialog>
    </Box>
  );
};

export default Mentions;
