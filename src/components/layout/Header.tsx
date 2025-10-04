import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Shield as ShieldIcon,
} from '@mui/icons-material';
import { AppBar, Badge, Box, IconButton, Toolbar, Tooltip, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleSidebar } from '@/store/slices/ui';

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const alertStats = useAppSelector((state) => state.alerts.stats);

  const handleMenuClick = () => {
    dispatch(toggleSidebar());
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="toggle drawer"
          onClick={handleMenuClick}
          edge="start"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        <ShieldIcon sx={{ mr: 1 }} />
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
          Reputation BlackBox
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Tooltip title="Alerts">
            <IconButton color="inherit" onClick={() => navigate('/alerts')}>
              <Badge badgeContent={alertStats?.total_active || 0} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
          Uber
          </Typography>
          <Box
            component="img"
            src="/uberLogo.png"
            alt="Uber Logo"
            sx={{
              height: 40,
              width: 'auto',
              ml: 2,
              cursor: 'pointer',
            }}
            onClick={() => navigate('/')}
          />
   
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
