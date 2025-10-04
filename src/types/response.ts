export type ResponseStyle = 'official' | 'friendly' | 'technical';

export type ResponseLanguage = 'en' | 'uk';

export interface GeneratedResponse {
  id: string;
  mention_id: string;
  style: ResponseStyle;
  language: ResponseLanguage;
  content: string;
  action_checklist: string[];
  faq_links: FAQLink[];
  created_at: string;
}

export interface FAQLink {
  title: string;
  url: string;
  relevance_score: number;
}

export interface ResponseTemplate {
  id: string;
  name: string;
  style: ResponseStyle;
  language: ResponseLanguage;
  template: string;
  variables: string[];
  use_count: number;
}

export interface ResponseRequest {
  mention_id: string;
  mention_content: string;
  style: ResponseStyle;
  language: ResponseLanguage;
  custom_instructions?: string;
}

export interface ResponseHistory {
  id: string;
  mention_id: string;
  response_id: string;
  content: string;
  style: ResponseStyle;
  sent_at: string;
  sent_by: string;
  platform_response_id?: string;
}
