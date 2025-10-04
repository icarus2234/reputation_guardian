import { Save as SaveIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  Chip,
  Divider,
  FormControlLabel,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';

const Settings: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="600">
        Settings
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Configure your reputation monitoring preferences
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Brand Keywords */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Brand Keywords
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Keywords to monitor across all platforms
            </Typography>
            <Divider sx={{ my: 2 }} />

            <TextField
              fullWidth
              placeholder="Add keywords (comma-separated)"
              helperText="Example: YourBrand, YourBrand app, @yourbrand"
              sx={{ mb: 2 }}
            />

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip label="YourBrand" onDelete={() => {}} />
              <Chip label="YourBrand app" onDelete={() => {}} />
              <Chip label="@yourbrand" onDelete={() => {}} />
            </Box>
          </Paper>
        </Grid>

        {/* Platform Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Active Platforms
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Enable or disable monitoring for each platform
            </Typography>
            <Divider sx={{ my: 2 }} />

            <List>
              {[
                'Google SERP',
                'App Store',
                'Google Play',
                'TrustPilot',
                'Facebook',
                'Instagram',
                'Reddit',
                'Quora',
              ].map((platform) => (
                <ListItem key={platform}>
                  <ListItemText primary={platform} />
                  <FormControlLabel control={<Switch defaultChecked />} label="" />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Alert Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Alert Thresholds
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Configure when to receive alerts
            </Typography>
            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="number"
                  label="Negative Spike Threshold"
                  helperText="Number of negative mentions to trigger alert"
                  defaultValue={5}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="number"
                  label="Crisis Threshold"
                  helperText="Number of critical mentions to trigger crisis alert"
                  defaultValue={10}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Alert Email"
                  type="email"
                  defaultValue="alerts@yourcompany.com"
                  helperText="Email address for alert notifications"
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Collection Intervals */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Data Collection Intervals
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              How often to collect data from each source
            </Typography>
            <Divider sx={{ my: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="number"
                  label="SERP Collection (hours)"
                  defaultValue={6}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField fullWidth type="number" label="App Reviews (hours)" defaultValue={2} />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="number"
                  label="Social Media (minutes)"
                  defaultValue={30}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField fullWidth type="number" label="Review Sites (hours)" defaultValue={1} />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Notification Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Notifications
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Choose how to receive notifications
            </Typography>
            <Divider sx={{ my: 2 }} />

            <List>
              <ListItem>
                <ListItemText primary="Email Notifications" secondary="Receive alerts via email" />
                <FormControlLabel control={<Switch defaultChecked />} label="" />
              </ListItem>

              <ListItem>
                <ListItemText
                  primary="Slack Integration"
                  secondary="Send alerts to Slack channel"
                />
                <FormControlLabel control={<Switch />} label="" />
              </ListItem>

              <ListItem>
                <ListItemText
                  primary="Webhook Notifications"
                  secondary="Send alerts to custom webhook"
                />
                <FormControlLabel control={<Switch />} label="" />
              </ListItem>

              <ListItem>
                <ListItemText
                  primary="In-App Notifications"
                  secondary="Show notifications in the application"
                />
                <FormControlLabel control={<Switch defaultChecked />} label="" />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Save Button */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" size="large">
              Reset to Defaults
            </Button>
            <Button variant="contained" size="large" startIcon={<SaveIcon />}>
              Save Settings
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings;
