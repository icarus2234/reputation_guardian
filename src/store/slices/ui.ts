import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  sidebarOpen: boolean;
  darkMode: boolean;
  notification: {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  };
}

const initialState: UIState = {
  sidebarOpen: true,
  darkMode: false,
  notification: {
    open: false,
    message: '',
    severity: 'info',
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    showNotification: (
      state,
      action: PayloadAction<{ message: string; severity: 'success' | 'error' | 'warning' | 'info' }>
    ) => {
      state.notification = {
        open: true,
        message: action.payload.message,
        severity: action.payload.severity,
      };
    },
    hideNotification: (state) => {
      state.notification.open = false;
    },
  },
});

export const { toggleSidebar, setSidebarOpen, toggleDarkMode, showNotification, hideNotification } =
  uiSlice.actions;
export default uiSlice.reducer;
