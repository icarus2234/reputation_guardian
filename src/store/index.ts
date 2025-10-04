import { configureStore } from '@reduxjs/toolkit';

import alertsReducer from './slices/alerts';
import analyticsReducer from './slices/analytics';
import mentionsReducer from './slices/mentions';
import responsesReducer from './slices/responses';
import uiReducer from './slices/ui';

export const store = configureStore({
  reducer: {
    mentions: mentionsReducer,
    analytics: analyticsReducer,
    alerts: alertsReducer,
    responses: responsesReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['ui/setDateRange'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
