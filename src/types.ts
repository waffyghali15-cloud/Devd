export interface RepoFile {
  path: string;
  name: string;
  category: 'workflow' | 'config' | 'source' | 'resource' | 'doc';
  language: string;
  content: string;
  description: string;
}

export interface CalculationHistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: string;
}

export type ProjectType = 'kotlin' | 'flutter';

export interface ThemeConfig {
  id: string;
  name: string;
  nameAr: string;
  primary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  surface: string;
  surfaceVariant: string;
  onSurface: string;
  outline: string;
  accent: string;
  isDark: boolean;
}
