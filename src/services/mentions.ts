import axios from 'axios';
import {
  Mention,
  MentionFilter,
  MentionStats,
  MentionApiResponse,
} from '@/types/mention';

const API_BASE_URL = 'https://maryland-managerial-pamala.ngrok-free.dev';

export const getMentions = async (
  filter: MentionFilter,
  page: number = 1,
  pageSize: number = 10
): Promise<{ mentions: Mention[]; total: number }> => {
  try {
    const params = new URLSearchParams();

    // Add filters as query parameters
    if (filter.product_id)
      params.append('product_id', filter.product_id.toString());

    // Handle multiple platforms
    if (filter.platforms && filter.platforms.length > 0) {
      filter.platforms.forEach((platform) => {
        params.append('platform', platform);
      });
    } else if (filter.platform) {
      params.append('platform', filter.platform);
    }

    if (filter.sentiment) params.append('sentiment', filter.sentiment);
    if (filter.intent) params.append('intent', filter.intent);
    if (filter.priority) params.append('priority', filter.priority);
    if (filter.from_date) params.append('from_date', filter.from_date);
    if (filter.to_date) params.append('to_date', filter.to_date);

    // Add pagination
    params.append('page', page.toString());
    params.append('page_size', pageSize.toString());

    const url = `${API_BASE_URL}/mentions?${params.toString()}`;

    const response = await axios.get<MentionApiResponse>(url, {
      headers: {
        'ngrok-skip-browser-warning': 'true', // Skip ngrok browser warning
      },
    });

    return {
      mentions: response.data.mentions,
      total: response.data.pagination.total_items,
    };
  } catch (error) {
    console.error('Error fetching mentions:', error);
    // Return empty state instead of throwing to prevent app crashes
    return {
      mentions: [],
      total: 0,
    };
  }
};

export const getMentionById = async (
  id: string | number
): Promise<Mention | null> => {
  try {
    const response = await axios.get<Mention>(
      `${API_BASE_URL}/mentions/${id}`,
      {
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching mention ${id}:`, error);
    // Return null for individual mention fetch errors
    return null;
  }
};

export const getMentionStats = async (
  filter: MentionFilter
): Promise<MentionStats | null> => {
  try {
    const response = await axios.post<MentionStats>(
      `${API_BASE_URL}/mentions/stats`,
      filter,
      {
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching mention stats:', error);
    // Return null for stats fetch errors
    return null;
  }
};

export const markMentionAsRead = async (id: string | number): Promise<void> => {
  try {
    await axios.patch(
      `${API_BASE_URL}/mentions/${id}/read`,
      {},
      {
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
      }
    );
  } catch (error) {
    console.error(`Error marking mention ${id} as read:`, error);
    // Silent failure for read status - not critical for UX
  }
};

export const markMention = async (
  id: string | number,
  isMarked: boolean = true
): Promise<void | null> => {
  try {
    const params = new URLSearchParams();
    params.append('is_marked', isMarked.toString());

    const url = `${API_BASE_URL}/mentions/${id}/mark?${params.toString()}`;

    await axios.patch(
      url,
      {},
      {
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
      }
    );

    console.log(
      `Mention ${id} marked as ${isMarked ? 'resolved' : 'unresolved'}`
    );
  } catch (error) {
    console.error(`Error marking mention ${id}:`, error);
    // Return null instead of throwing to prevent app crashes
    return null;
  }
};
