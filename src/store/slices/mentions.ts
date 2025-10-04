import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Mention, MentionFilter, MentionStats } from '@/types/mention';
import * as mentionService from '@/services/mentions';

interface MentionsState {
  mentions: Mention[];
  selectedMention: Mention | null;
  filter: MentionFilter;
  stats: MentionStats | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
}

const initialState: MentionsState = {
  mentions: [],
  selectedMention: null,
  filter: {},
  stats: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    pageSize: 10,
    total: 0,
  },
};

export const fetchMentions = createAsyncThunk(
  'mentions/fetchMentions',
  async ({
    filter,
    page,
    pageSize,
  }: {
    filter: MentionFilter;
    page: number;
    pageSize: number;
  }) => {
    const response = await mentionService.getMentions(filter, page, pageSize);
    return response;
  }
);

export const fetchMentionById = createAsyncThunk(
  'mentions/fetchMentionById',
  async (id: string | number) => {
    const response = await mentionService.getMentionById(id);
    return response;
  }
);

export const fetchMentionStats = createAsyncThunk(
  'mentions/fetchMentionStats',
  async (filter: MentionFilter) => {
    const response = await mentionService.getMentionStats(filter);
    return response;
  }
);

export const markAsRead = createAsyncThunk(
  'mentions/markAsRead',
  async (id: string | number) => {
    await mentionService.markMentionAsRead(id);
    return id;
  }
);

export const markMention = createAsyncThunk(
  'mentions/markMention',
  async ({ id, isMarked }: { id: string | number; isMarked: boolean }) => {
    const result = await mentionService.markMention(id, isMarked);
    if (result === null) {
      throw new Error('Failed to mark mention');
    }
    return { id, isMarked };
  }
);

const mentionsSlice = createSlice({
  name: 'mentions',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<MentionFilter>) => {
      state.filter = action.payload;
      state.pagination.page = 1; // Reset to first page when filter changes
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pagination.pageSize = action.payload;
      state.pagination.page = 1; // Reset to first page
    },
    setSelectedMention: (state, action: PayloadAction<Mention | null>) => {
      state.selectedMention = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch mentions
      .addCase(fetchMentions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMentions.fulfilled, (state, action) => {
        state.loading = false;
        state.mentions = action.payload.mentions;
        state.pagination.total = action.payload.total;
      })
      .addCase(fetchMentions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch mentions';
      })
      // Fetch mention by ID
      .addCase(fetchMentionById.fulfilled, (state, action) => {
        state.selectedMention = action.payload;
      })
      // Fetch stats
      .addCase(fetchMentionStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      // Mark as read
      .addCase(markAsRead.fulfilled, (state, action) => {
        // API marks as read on backend
        // Could refresh data here if needed
      })
      // Mark mention
      .addCase(markMention.fulfilled, (state, action) => {
        const { id, isMarked } = action.payload;
        const mention = state.mentions.find((m) => m.id === id);
        if (mention) {
          mention.is_marked = isMarked;
        }
        if (state.selectedMention && state.selectedMention.id === id) {
          state.selectedMention.is_marked = isMarked;
        }
      })
      .addCase(markMention.rejected, (state, action) => {
        console.error('Failed to mark mention:', action.error.message);
        state.error = action.error.message || 'Failed to mark mention';
      });
  },
});

export const {
  setFilter,
  setPage,
  setPageSize,
  setSelectedMention,
  clearError,
} = mentionsSlice.actions;
export default mentionsSlice.reducer;
