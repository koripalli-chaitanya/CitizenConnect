
export enum ProjectStatus {
  APPROVED = 'APPROVED',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
  PITCH = 'PITCH',
  PROPOSED = 'PROPOSED'
}

export interface BudgetBreakdown {
  category: string;
  amount: number;
}

export interface Contractor {
  name: string;
  rating: number;
  pastProjects: number;
  reputationSummary?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  location: string;
  status: ProjectStatus;
  budget: number;
  allocatedDate: string;
  deadline: string;
  contractor: Contractor;
  tags: string[];
  votes: number;
  upvotes: number;
  downvotes: number;
  budgetBreakdown: BudgetBreakdown[];
  timeline: { phase: string; status: string; date: string }[];
}

export interface AIAnalysisResult {
  costVetting: string;
  contractorBackground: string;
  timelineFeasibility: string;
  redFlags: string[];
  suggestions: string[];
  confidenceScore: number;
  sources?: { title: string; uri: string }[];
}

export interface UserPitch {
  id: string;
  userId: string;
  userName: string;
  title: string;
  location: string;
  problem: string;
  proposedSolution: string;
  estimatedBudget: number;
  timestamp: string;
  supportCount: number;
}
