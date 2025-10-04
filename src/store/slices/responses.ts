import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import * as responseService from '@/services/responses';
import { GeneratedResponse, ResponseHistory, ResponseRequest } from '@/types/response';

interface ResponsesState {
  currentResponse: GeneratedResponse | null;
  history: ResponseHistory[];
  loading: boolean;
  error: string | null;
}

const initialState: ResponsesState = {
  currentResponse: null,
  history: [],
  loading: false,
  error: null,
};

export const generateResponse = createAsyncThunk(
  'responses/generateResponse',
  async (request: ResponseRequest) => {
    const response = await responseService.generateResponse(request);
    return response;
  }
);

export const fetchResponseHistory = createAsyncThunk(
  'responses/fetchResponseHistory',
  async (mentionId: string) => {
    const response = await responseService.getResponseHistory(mentionId);
    return response;
  }
);

export const sendResponse = createAsyncThunk(
  'responses/sendResponse',
  async ({ responseId, content }: { responseId: string; content: string }) => {
    const response = await responseService.sendResponse(responseId, content);
    return response;
  }
);

const responsesSlice = createSlice({
  name: 'responses',
  initialState,
  reducers: {
    setCurrentResponse: (state, action: PayloadAction<GeneratedResponse | null>) => {
      state.currentResponse = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Generate response
      .addCase(generateResponse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateResponse.fulfilled, (state, action) => {
        state.loading = false;
        state.currentResponse = action.payload;
      })
      .addCase(generateResponse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to generate response';
      })
      // Fetch history
      .addCase(fetchResponseHistory.fulfilled, (state, action) => {
        state.history = action.payload;
      })
      // Send response
      .addCase(sendResponse.fulfilled, (state, action) => {
        state.history.unshift(action.payload);
      });
  },
});

export const { setCurrentResponse, clearError } = responsesSlice.actions;
export default responsesSlice.reducer;
