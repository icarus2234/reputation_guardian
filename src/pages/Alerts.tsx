import {
  CheckCircle as CheckIcon,
  Close as CloseIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  OpenInNew as OpenInNewIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  acknowledgeAlert,
  dismissAlert,
  fetchAlerts,
  fetchAlertStats,
  resolveAlert,
} from '@/store/slices/alerts';
import { Alert, AlertSeverity } from '@/types/alert';

const Alerts: React.FC = () => {
  const dispatch = useAppDispatch();
  const { alerts, stats, loading, error } = useAppSelector(
    (state) => state.alerts
  );
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [processingAlerts, setProcessingAlerts] = useState<
    Set<string | number>
  >(new Set());

  useEffect(() => {
    dispatch(fetchAlerts({ page: 1, pageSize: 20 }));
    dispatch(fetchAlertStats());
  }, [dispatch]);

  const getSeverityIcon = (severity: AlertSeverity) => {
    switch (severity) {
      case 'critical':
        return <ErrorIcon color="error" />;
      case 'high':
        return <WarningIcon color="warning" />;
      case 'medium':
        return <InfoIcon color="info" />;
      default:
        return <InfoIcon />;
    }
  };

  const getSeverityColor = (severity: AlertSeverity) => {
    switch (severity) {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'error';
      case 'acknowledged':
        return 'warning';
      case 'resolved':
        return 'success';
      default:
        return 'default';
    }
  };

  const handleAlertClick = (alert: Alert) => {
    setSelectedAlert(alert);
    setDialogOpen(true);
  };

  const handleAcknowledge = async () => {
    if (selectedAlert) {
      setProcessingAlerts((prev) => new Set([...prev, selectedAlert.id]));
      try {
        await dispatch(acknowledgeAlert({ id: selectedAlert.id, notes }));
        setDialogOpen(false);
        setNotes('');
      } finally {
        setProcessingAlerts((prev) => {
          const newSet = new Set(prev);
          newSet.delete(selectedAlert.id);
          return newSet;
        });
      }
    }
  };

  const handleResolve = async () => {
    if (selectedAlert) {
      setProcessingAlerts((prev) => new Set([...prev, selectedAlert.id]));
      try {
        await dispatch(resolveAlert({ id: selectedAlert.id, notes }));
        setDialogOpen(false);
        setNotes('');
      } finally {
        setProcessingAlerts((prev) => {
          const newSet = new Set(prev);
          newSet.delete(selectedAlert.id);
          return newSet;
        });
      }
    }
  };

  const handleDismiss = async () => {
    if (selectedAlert) {
      setProcessingAlerts((prev) => new Set([...prev, selectedAlert.id]));
      try {
        await dispatch(dismissAlert(selectedAlert.id));
        setDialogOpen(false);
      } finally {
        setProcessingAlerts((prev) => {
          const newSet = new Set(prev);
          newSet.delete(selectedAlert.id);
          return newSet;
        });
      }
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="600">
        Early Warning System
      </Typography>

      {error && (
        <Box sx={{ mb: 2 }}>
          <Typography color="error" variant="body2">
            Error: {error}
          </Typography>
        </Box>
      )}
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Monitor spikes, trends, and critical issues requiring immediate
        attention
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mt: 2, mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: '#ffebee' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ErrorIcon color="error" />
                <Typography variant="h6">Active Alerts</Typography>
              </Box>
              <Typography variant="h3" fontWeight="700" sx={{ mt: 1 }}>
                {loading ? (
                  <CircularProgress size={24} />
                ) : (
                  stats?.total_active || 0
                )}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="text.secondary">
                Critical
              </Typography>
              <Typography variant="h3" fontWeight="700" color="error.main">
                {loading ? (
                  <CircularProgress size={24} />
                ) : (
                  stats?.by_severity.critical || 0
                )}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom color="text.secondary">
                High Priority
              </Typography>
              <Typography variant="h3" fontWeight="700" color="warning.main">
                {loading ? (
                  <CircularProgress size={24} />
                ) : (
                  stats?.by_severity.high || 0
                )}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ bgcolor: '#e8f5e9' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CheckIcon color="success" />
                <Typography variant="h6">Resolved</Typography>
              </Box>
              <Typography variant="h3" fontWeight="700" sx={{ mt: 1 }}>
                {loading ? (
                  <CircularProgress size={24} />
                ) : (
                  stats?.resolved_today || 0
                )}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Alerts List */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Active Alerts
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {loading ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 8,
            }}
          >
            <CircularProgress size={40} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Loading alerts...
            </Typography>
          </Box>
        ) : alerts.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 8,
              color: 'text.secondary',
            }}
          >
            <CheckIcon sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
            <Typography variant="h6">No active alerts</Typography>
            <Typography variant="body2">
              All systems are running smoothly
            </Typography>
          </Box>
        ) : (
          <List>
            {alerts.map((alert, index) => (
              <React.Fragment key={alert.id}>
                <ListItem
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    '&:hover': { bgcolor: '#f5f5f5' },
                    borderRadius: 1,
                  }}
                  onClick={() => handleAlertClick(alert)}
                >
                  <ListItemIcon>{getSeverityIcon(alert.priority)}</ListItemIcon>
                  <ListItemText
                    primary={
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          mb: 0.5,
                        }}
                      >
                        <Typography variant="subtitle1" fontWeight="600">
                          {alert.author_name}
                        </Typography>
                        <Chip
                          label={alert.priority}
                          color={getSeverityColor(alert.priority)}
                          size="small"
                        />
                        <Chip
                          label={alert.is_marked ? 'resolved' : 'active'}
                          color={getStatusColor(
                            alert.is_marked ? 'resolved' : 'active'
                          )}
                          size="small"
                          variant="outlined"
                        />
                        <Chip
                          label={alert.platform.replace('_', ' ')}
                          size="small"
                          variant="outlined"
                        />
                        {alert.rating && (
                          <Chip
                            label={`⭐ ${alert.rating.toFixed(1)}`}
                            size="small"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {alert.content}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ mt: 0.5, display: 'block' }}
                        >
                          {format(new Date(alert.original_date), 'PPp')} •{' '}
                          {alert.platform}
                        </Typography>
                      </Box>
                    }
                  />
                  <IconButton edge="end">
                    <OpenInNewIcon />
                  </IconButton>
                </ListItem>
                {index < alerts.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>

      {/* Alert Details Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedAlert && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {getSeverityIcon(selectedAlert.priority)}
                <Typography variant="h6">
                  {selectedAlert.author_name}
                </Typography>
                <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
                  <Chip
                    label={selectedAlert.priority}
                    color={getSeverityColor(selectedAlert.priority)}
                    size="small"
                  />
                  <Chip
                    label={selectedAlert.sentiment}
                    size="small"
                    sx={{
                      bgcolor:
                        selectedAlert.sentiment === 'positive'
                          ? '#e8f5e9'
                          : selectedAlert.sentiment === 'negative'
                            ? '#ffebee'
                            : '#f5f5f5',
                      color:
                        selectedAlert.sentiment === 'positive'
                          ? '#2e7d32'
                          : selectedAlert.sentiment === 'negative'
                            ? '#c62828'
                            : '#757575',
                    }}
                  />
                </Box>
                <IconButton onClick={() => setDialogOpen(false)} size="small">
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Full Content
                  </Typography>
                  <Typography variant="body1">
                    {selectedAlert.full_content}
                  </Typography>
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Alert Type
                  </Typography>
                  <Chip label={selectedAlert.alert_type} size="small" />
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Status
                  </Typography>
                  <Chip
                    label={selectedAlert.is_marked ? 'resolved' : 'active'}
                    color={getStatusColor(
                      selectedAlert.is_marked ? 'resolved' : 'active'
                    )}
                    size="small"
                  />
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Platform
                  </Typography>
                  <Chip
                    label={selectedAlert.platform.replace('_', ' ')}
                    size="small"
                  />
                </Grid>

                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Date
                  </Typography>
                  <Typography variant="body2">
                    {format(new Date(selectedAlert.original_date), 'PPp')}
                  </Typography>
                </Grid>

                {selectedAlert.rating && (
                  <Grid item xs={12}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Rating
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h4" fontWeight="700">
                        ⭐ {selectedAlert.rating.toFixed(1)}
                      </Typography>
                    </Box>
                  </Grid>
                )}

                {selectedAlert.source_url && (
                  <Grid item xs={12}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Source
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<OpenInNewIcon />}
                      href={selectedAlert.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Original
                    </Button>
                  </Grid>
                )}

                {!selectedAlert.is_marked && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Notes (Optional)"
                      placeholder="Add notes about the action taken..."
                      value={notes}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNotes(e.target.value)
                      }
                    />
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              {!selectedAlert.is_marked ? (
                <>
                  <Button
                    onClick={handleDismiss}
                    color="inherit"
                    disabled={processingAlerts.has(selectedAlert.id)}
                    startIcon={
                      processingAlerts.has(selectedAlert.id) ? (
                        <CircularProgress size={16} />
                      ) : undefined
                    }
                  >
                    Dismiss
                  </Button>
                  <Button
                    onClick={handleResolve}
                    variant="contained"
                    color="success"
                    disabled={processingAlerts.has(selectedAlert.id)}
                    startIcon={
                      processingAlerts.has(selectedAlert.id) ? (
                        <CircularProgress size={16} />
                      ) : undefined
                    }
                  >
                    Mark as Resolved
                  </Button>
                </>
              ) : (
                <Button onClick={() => setDialogOpen(false)}>Close</Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default Alerts;
