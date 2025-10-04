import axios from 'axios';
import apiClient from './api';
import { Alert, AlertStats, AlertStatus, AlertsApiResponse, AlertType } from '@/types/alert';

const API_BASE_URL = 'https://maryland-managerial-pamala.ngrok-free.dev';

export const getAlerts = async (
  page: number = 1,
  pageSize: number = 20,
  alertType?: AlertType
): Promise<AlertsApiResponse> => {
  try {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('page_size', pageSize.toString());
    if (alertType) params.append('alert_type', alertType);

    const url = `${API_BASE_URL}/alerts?${params.toString()}`;

    console.log('Fetching alerts from:', url);

    const response = await axios.get<AlertsApiResponse>(url, {
      headers: {
        'ngrok-skip-browser-warning': 'true',
      },
    });

    console.log('Alerts API Response:', response.data);

    return response.data;
  } catch (error) {
    console.error('Error fetching alerts:', error);
    throw error;
  }
};

export const getAlertStats = async (): Promise<AlertStats> => {
  try {
    // Fetch first page to get stats
    const response = await getAlerts(1, 100);
    const alerts = response.alerts;

    const stats: AlertStats = {
      total_active: alerts.filter((a) => !a.is_marked).length,
      by_severity: {
        critical: alerts.filter((a) => a.priority === 'critical').length,
        high: alerts.filter((a) => a.priority === 'high').length,
        medium: alerts.filter((a) => a.priority === 'medium').length,
        low: alerts.filter((a) => a.priority === 'low').length,
      },
      by_type: {
        critical: alerts.filter((a) => a.alert_type === 'critical').length,
        high_priority: alerts.filter((a) => a.alert_type === 'high_priority').length,
        active: alerts.filter((a) => a.alert_type === 'active').length,
        resolved: alerts.filter((a) => a.alert_type === 'resolved').length,
      } as Record<AlertType, number>,
      resolved_today: alerts.filter((a) => a.is_marked).length,
    };

    return stats;
  } catch (error) {
    console.error('Error fetching alert stats:', error);
    throw error;
  }
};

export const markAlert = async (id: number, is_marked: boolean): Promise<Alert> => {
  try {
    const url = `${API_BASE_URL}/alerts/${id}/mark`;
    const response = await axios.post<Alert>(
      url,
      { is_marked },
      {
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error marking alert:', error);
    throw error;
  }
};

export const acknowledgeAlert = async (id: number, notes?: string): Promise<Alert> => {
  // Mark as resolved
  return markAlert(id, true);
};

export const resolveAlert = async (id: number, notes?: string): Promise<Alert> => {
  return markAlert(id, true);
};

export const dismissAlert = async (id: number): Promise<number> => {
  return id; // Just return the ID for now
};
