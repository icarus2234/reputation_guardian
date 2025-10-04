import {
  AutoAwesome as AIIcon,
  CheckCircle as CheckCircleIcon,
  ContentCopy as CopyIcon,
  Refresh as RefreshIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import {
  Alert,
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
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { generateResponse } from '@/store/slices/responses';
import { markMention } from '@/store/slices/mentions';
import { ResponseLanguage, ResponseStyle } from '@/types/response';
import { Mention } from '@/types/mention';

const Responses: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentResponse, loading } = useAppSelector(
    (state) => state.responses
  );
  const [mentionContent, setMentionContent] = useState('');
  const [mentionId, setMentionId] = useState<string | number>('');
  const [mentionData, setMentionData] = useState<Mention | null>(null);
  const [style, setStyle] = useState<ResponseStyle>('friendly');
  const [language, setLanguage] = useState<ResponseLanguage>('en');
  const [customInstructions, setCustomInstructions] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState(
    'Response copied to clipboard!'
  );
  const [showMarkResolvedDialog, setShowMarkResolvedDialog] = useState(false);
  const [markResolvedLoading, setMarkResolvedLoading] = useState(false);
  const [sendResponseLoading, setSendResponseLoading] = useState(false);

  // Check if we have prefilled data from navigation
  useEffect(() => {
    const state = location.state as {
      mention?: Mention;
      prefilledData?: any;
    } | null;
    if (state?.mention) {
      const mention = state.mention;
      setMentionContent(mention.content);
      setMentionId(mention.id);
      setMentionData(mention);
    } else if (state?.prefilledData) {
      // Handle data from Alerts page
      const prefilledData = state.prefilledData;
      setMentionContent(prefilledData.content);
      setMentionId(prefilledData.mentionId);
      setMentionData({
        id: prefilledData.mentionId,
        content: prefilledData.content,
        platform: prefilledData.platform,
        author: {
          name: prefilledData.authorName,
          avatar_url: null,
          profile_url: null,
        },
        sentiment: prefilledData.sentiment,
        intent: 'complaint', // Default intent for alerts
        priority: 'high', // Default priority for alerts
        date: prefilledData.originalDate,
        rating: prefilledData.rating,
        confidence_score: 0.8,
        keywords_matched: [],
        topics: [],
        response_suggested: {
          should_respond: true,
          urgency: 'high',
          recommended_style: 'professional',
          response_type: 'public',
          key_points: [],
        },
        is_marked: false,
        metadata: {
          processed_date: new Date().toISOString(),
          source_url: prefilledData.sourceUrl,
          external_id: String(prefilledData.mentionId),
        },
      });

      // Auto-select style based on sentiment
      if (prefilledData.sentiment === 'negative') {
        setStyle('technical');
      } else if (prefilledData.sentiment === 'positive') {
        setStyle('friendly');
      }

      // Add context to custom instructions
      const contextInstructions = [
        `Platform: ${prefilledData.platform}`,
        `Author: ${prefilledData.authorName}`,
        `Sentiment: ${prefilledData.sentiment}`,
        prefilledData.rating ? `Rating: ${prefilledData.rating}` : '',
      ]
        .filter(Boolean)
        .join('\n');

      setCustomInstructions(contextInstructions);
    }
  }, [location.state]);

  const handleGenerate = () => {
    if (!mentionContent) return;

    dispatch(
      generateResponse({
        mention_id: mentionId ? String(mentionId) : 'demo-mention',
        mention_content: mentionContent,
        style,
        language,
        custom_instructions: customInstructions || undefined,
      })
    );
  };

  const handleSendResponse = () => {
    if (currentResponse && mentionId && !sendResponseLoading) {
      setSendResponseLoading(true);
      // Simulate a brief delay for sending response
      setTimeout(() => {
        setSendResponseLoading(false);
        setShowMarkResolvedDialog(true);
      }, 1000);
    }
  };

  const handleMarkAsResolved = async () => {
    if (mentionId) {
      setMarkResolvedLoading(true);
      try {
        const result = await dispatch(
          markMention({ id: mentionId, isMarked: true })
        );
        if (result.type.endsWith('/fulfilled')) {
          setShowMarkResolvedDialog(false);
          setSuccessMessage('Mention marked as resolved successfully!');
          setShowSuccess(true);

          // Navigate to mentions tab after a short delay to show success message
          setTimeout(() => {
            setShowSuccess(false);
            navigate('/mentions');
          }, 2000);
        }
      } catch (error) {
        console.error('Error marking mention as resolved:', error);
        setSuccessMessage(
          'Failed to mark mention as resolved. Please try again.'
        );
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } finally {
        setMarkResolvedLoading(false);
      }
    }
  };

  const handleCopy = () => {
    if (currentResponse) {
      navigator.clipboard.writeText(currentResponse.content);
      setSuccessMessage('Response copied to clipboard!');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const styleDescriptions = {
    official: 'Formal, professional tone suitable for corporate communications',
    friendly: 'Warm, approachable tone that builds personal connections',
    technical: 'Detailed, solution-focused tone for support scenarios',
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="600">
        AI Response Generator
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Generate personalized responses to brand mentions in multiple styles and
        languages
      </Typography>

      {mentionId && (
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <Typography component="span" fontWeight="bold">
              Prefilled from Mention #{mentionId}
            </Typography>{' '}
            - Content and context have been automatically populated from the
            selected mention.
          </Typography>
        </Alert>
      )}

      {showSuccess && (
        <Alert
          severity="success"
          sx={{ mt: 2 }}
          onClose={() => setShowSuccess(false)}
        >
          {successMessage}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Input Section */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Input
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <TextField
              fullWidth
              multiline
              rows={6}
              label="Mention Content"
              placeholder="Paste the customer mention or review here..."
              value={mentionContent}
              onChange={(e) => setMentionContent(e.target.value)}
              sx={{ mb: 3 }}
            />

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Response Style</InputLabel>
                  <Select
                    value={style}
                    onChange={(e) => setStyle(e.target.value as ResponseStyle)}
                    label="Response Style"
                  >
                    <MenuItem value="official">
                      <Box>
                        <Typography variant="body1">Official</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Formal & Professional
                        </Typography>
                      </Box>
                    </MenuItem>
                    <MenuItem value="friendly">
                      <Box>
                        <Typography variant="body1">Friendly</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Warm & Approachable
                        </Typography>
                      </Box>
                    </MenuItem>
                    <MenuItem value="technical">
                      <Box>
                        <Typography variant="body1">Technical</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Detailed & Solution-Focused
                        </Typography>
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Language</InputLabel>
                  <Select
                    value={language}
                    onChange={(e) =>
                      setLanguage(e.target.value as ResponseLanguage)
                    }
                    label="Language"
                  >
                    <MenuItem value="en">English</MenuItem>
                    <MenuItem value="uk">Українська (Ukrainian)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Custom Instructions (Optional)"
                  placeholder="Add specific points to address or tone adjustments..."
                  value={customInstructions}
                  onChange={(e) => setCustomInstructions(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    {styleDescriptions[style]}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={
                    loading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <AIIcon />
                    )
                  }
                  onClick={handleGenerate}
                  disabled={loading || !mentionContent}
                >
                  {loading ? 'Generating...' : 'Generate Response'}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Output Section */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography variant="h6">Generated Response</Typography>
              {currentResponse && (
                <Box>
                  <IconButton onClick={handleGenerate} size="small">
                    <RefreshIcon />
                  </IconButton>
                  <IconButton onClick={handleCopy} size="small">
                    <CopyIcon />
                  </IconButton>
                </Box>
              )}
            </Box>
            <Divider sx={{ mb: 3 }} />

            {!currentResponse && !loading && (
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
                <AIIcon sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
                <Typography variant="body1">
                  Generated response will appear here
                </Typography>
              </Box>
            )}

            {loading && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '300px',
                }}
              >
                <CircularProgress size={48} sx={{ mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  Generating personalized response...
                </Typography>
              </Box>
            )}

            {currentResponse && !loading && (
              <Box>
                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={currentResponse.style}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label={currentResponse.language.toUpperCase()}
                    size="small"
                  />
                </Box>

                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    mb: 3,
                    bgcolor: '#fafafa',
                    minHeight: '150px',
                  }}
                >
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {currentResponse.content}
                  </Typography>
                </Paper>

                {currentResponse.action_checklist.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      fontWeight="600"
                    >
                      Action Checklist
                    </Typography>
                    <List dense>
                      {currentResponse.action_checklist.map((item, index) => (
                        <ListItem key={index}>
                          <ListItemText primary={`${index + 1}. ${item}`} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                {currentResponse.faq_links.length > 0 && (
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="subtitle2"
                      gutterBottom
                      fontWeight="600"
                    >
                      Related Resources
                    </Typography>
                    <List dense>
                      {currentResponse.faq_links.map((link, index) => (
                        <ListItem key={index}>
                          <ListItemText
                            primary={link.title}
                            secondary={`Relevance: ${(link.relevance_score * 100).toFixed(0)}%`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}

                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  startIcon={
                    sendResponseLoading ? (
                      <CircularProgress size={20} />
                    ) : (
                      <SendIcon />
                    )
                  }
                  onClick={handleSendResponse}
                  disabled={sendResponseLoading}
                >
                  {sendResponseLoading ? 'Sending...' : 'Send Response'}
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Mark as Resolved Dialog */}
      <Dialog
        open={showMarkResolvedDialog}
        onClose={() => setShowMarkResolvedDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircleIcon color="success" />
            <Typography variant="h6" fontWeight="600">
              Mark as Resolved?
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            You're about to mark this mention as resolved. This will indicate
            that you've successfully addressed the customer's concern.
          </Typography>

          {mentionData && (
            <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1, mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Original Mention:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                "{mentionData.content}"
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                <Chip
                  label={`Platform: ${mentionData.platform}`}
                  size="small"
                  variant="outlined"
                />
                <Chip
                  label={`Sentiment: ${mentionData.sentiment}`}
                  size="small"
                  variant="outlined"
                  color={
                    mentionData.sentiment === 'negative'
                      ? 'error'
                      : mentionData.sentiment === 'positive'
                        ? 'success'
                        : 'default'
                  }
                />
                <Chip
                  label={`Priority: ${mentionData.priority}`}
                  size="small"
                  variant="outlined"
                  color={
                    mentionData.priority === 'critical'
                      ? 'error'
                      : mentionData.priority === 'high'
                        ? 'warning'
                        : 'default'
                  }
                />
              </Box>
            </Box>
          )}

          <Typography variant="body2" color="text.secondary">
            This action cannot be undone. Are you sure you want to proceed?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setShowMarkResolvedDialog(false)}
            disabled={markResolvedLoading}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="success"
            startIcon={
              markResolvedLoading ? (
                <CircularProgress size={20} />
              ) : (
                <CheckCircleIcon />
              )
            }
            onClick={handleMarkAsResolved}
            disabled={markResolvedLoading}
          >
            {markResolvedLoading ? 'Marking...' : 'Mark as Resolved'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Responses;
