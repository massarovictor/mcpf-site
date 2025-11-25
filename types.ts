export enum Theme {
  LIGHT = 'light',
  DARK = 'dark'
}

export interface NavItem {
  label: string;
  path: string;
}

export interface Course {
  id: string;
  title: string;
  category: 'Tecnologia' | 'Humanas' | 'Ciências' | 'Artes' | 'Gestão e Negócios' | 'Recursos Naturais' | 'Informação e Comunicação';
  description: string;
  duration: string;
  level: string;
  image: string;
  modules?: string[];
  opportunities?: string[];
}

export interface FacultyMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  specialty: string;
}

export interface TimelineEvent {
  date: string;
  title: string;
  description?: string;
  url?: string;
}

export interface Attachment {
  name: string;
  url: string;
  type: 'pdf' | 'link' | 'other';
}

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  summary: string;
  category: string;
  image: string;
  featured?: boolean;
  type?: 'news' | 'edital';
  content?: string;
  timeline?: TimelineEvent[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}
