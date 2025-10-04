import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Alert, AlertStats, AlertStatus, AlertPagination, AlertType } from '@/types/alert';
import * as alertService from '@/services/alerts';

interface AlertsState {
  alerts: Alert[];
  pagination: AlertPagination | null;
  stats: AlertStats | null;
  selectedAlert: Alert | null;
  currentPage: number;
  pageSize: number;
  selectedAlertType: AlertType | null;
  loading: boolean;
  error: string | null;
}

const initialState: AlertsState = {
  alerts: [],
  pagination: null,
  stats: null,
  selectedAlert: null,
  currentPage: 1,
  pageSize: 20,
  selectedAlertType: null,
  loading: false,
  error: null,
};

export const fetchAlerts = createAsyncThunk(
  'alerts/fetchAlerts',
  async ({
    page = 1,
    pageSize = 20,
    alertType,
  }: {
    page?: number;
    pageSize?: number;
    alertType?: AlertType;
  } = {}) => {
    const response = await alertService.getAlerts(page, pageSize, alertType);
    return response;
  }
);

export const fetchAlertStats = createAsyncThunk('alerts/fetchAlertStats', async () => {
  const response = await alertService.getAlertStats();
  return response;
});

export const markAlert = createAsyncThunk(
  'alerts/markAlert',
  async ({ id, is_marked }: { id: number; is_marked: boolean }) => {
    const response = await alertService.markAlert(id, is_marked);
    return response;
  }
);

export const acknowledgeAlert = createAsyncThunk(
  'alerts/acknowledgeAlert',
  async ({ id, notes }: { id: number; notes?: string }) => {
    const response = await alertService.acknowledgeAlert(id, notes);
    return response;
  }
);

export const resolveAlert = createAsyncThunk(
  'alerts/resolveAlert',
  async ({ id, notes }: { id: number; notes?: string }) => {
    const response = await alertService.resolveAlert(id, notes);
    return response;
  }
);

export const dismissAlert = createAsyncThunk('alerts/dismissAlert', async (id: number) => {
  const response = await alertService.dismissAlert(id);
  return response;
});

const alertsSlice = createSlice({
  name: 'alerts',
  initialState,
  reducers: {
    setSelectedAlert: (state, action: PayloadAction<Alert | null>) => {
      state.selectedAlert = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
      state.currentPage = 1; // Reset to first page when page size changes
    },
    setSelectedAlertType: (state, action: PayloadAction<AlertType | null>) => {
      state.selectedAlertType = action.payload;
      state.currentPage = 1; // Reset to first page when filter changes
    },
    addAlert: (state, action: PayloadAction<Alert>) => {
      state.alerts.unshift(action.payload);
    },
    updateAlert: (state, action: PayloadAction<Alert>) => {
      const index = state.alerts.findIndex((a) => a.id === action.payload.id);
      if (index !== -1) {
        state.alerts[index] = action.payload;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch alerts
      .addCase(fetchAlerts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAlerts.fulfilled, (state, action) => {
        state.loading = false;
        state.alerts = action.payload.alerts;
        state.pagination = action.payload.pagination;
        console.log('Redux: Alerts fetched:', {
          alertsCount: action.payload.alerts.length,
          pagination: action.payload.pagination,
        });
      })
      .addCase(fetchAlerts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch alerts';
        console.error('Redux: Failed to fetch alerts:', action.error);
      })
      // Fetch stats
      .addCase(fetchAlertStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      // Mark alert
      .addCase(markAlert.fulfilled, (state, action) => {
        const index = state.alerts.findIndex((a) => a.id === action.payload.id);
        if (index !== -1) {
          state.alerts[index] = action.payload;
        }
      })
      // Acknowledge alert
      .addCase(acknowledgeAlert.fulfilled, (state, action) => {
        const index = state.alerts.findIndex((a) => a.id === action.payload.id);
        if (index !== -1) {
          state.alerts[index] = action.payload;
        }
      })
      // Resolve alert
      .addCase(resolveAlert.fulfilled, (state, action) => {
        const index = state.alerts.findIndex((a) => a.id === action.payload.id);
        if (index !== -1) {
          state.alerts[index] = action.payload;
        }
      })
      // Dismiss alert
      .addCase(dismissAlert.fulfilled, (state, action) => {
        state.alerts = state.alerts.filter((a) => a.id !== action.payload);
      });
  },
});

export const {
  setSelectedAlert,
  setCurrentPage,
  setPageSize,
  setSelectedAlertType,
  addAlert,
  updateAlert,
  clearError,
} = alertsSlice.actions;
export default alertsSlice.reducer;
