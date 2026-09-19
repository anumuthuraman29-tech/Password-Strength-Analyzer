export interface AuditLog {
  id: string;
  time: string;
  score: number;
  strength: 'Strong' | 'Medium' | 'Weak';
  category: string;
  status: string;
}

export interface SecurityStats {
  total: number;
  strong: number;
  medium: number;
  weak: number;
  percentages: {
    strong: number;
    medium: number;
    weak: number;
  };
  scoreDistribution: number[];
}

export interface PasswordAnalysisResult {
  score: number;
  strength: 'Strong' | 'Medium' | 'Weak';
  statusClass: 'strong' | 'medium' | 'weak';
  category: string;
  status: string;
  recommendation: string;
  conditions: {
    hasLength: boolean;
    hasUpper: boolean;
    hasLower: boolean;
    hasNumber: boolean;
    hasSpecial: boolean;
  };
}

export type PageView = 
  | 'landing'
  | 'login'
  | 'dashboard'
  | 'analyze'
  | 'generator'
  | 'history'
  | 'statistics'
  | 'settings'
  | 'logout'
  | 'code_viewer'
  | 'not_found';
