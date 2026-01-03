
import { Project, ProjectStatus } from './types';

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'gov-001',
    title: 'Smart City Road Widening - MG Road',
    description: 'Expanding the existing 4-lane road to a 6-lane highway with integrated smart lighting and drainage systems.',
    location: 'Bengaluru, Karnataka',
    status: ProjectStatus.ONGOING,
    budget: 45000000,
    allocatedDate: '2023-10-15',
    deadline: '2024-12-30',
    contractor: {
      name: 'InfraBuild South Ltd.',
      rating: 4.2,
      pastProjects: 15
    },
    tags: ['Infrastructure', 'Urban Planning', 'Smart City'],
    votes: 1240,
    upvotes: 890,
    downvotes: 350,
    budgetBreakdown: [
      { category: 'Material', amount: 25000000 },
      { category: 'Labor', amount: 10000000 },
      { category: 'Technology', amount: 5000000 },
      { category: 'Logistics', amount: 5000000 }
    ],
    timeline: [
      { phase: 'Land Acquisition', status: 'Completed', date: '2023-09-01' },
      { phase: 'Excavation', status: 'In Progress', date: '2024-02-15' },
      { phase: 'Paving', status: 'Pending', date: '2024-08-01' }
    ]
  },
  {
    id: 'gov-002',
    title: 'Purified Water Plant Installation',
    description: 'Setting up 10 automated community water purification units to provide RO water at nominal costs.',
    location: 'Nagpur, Maharashtra',
    status: ProjectStatus.APPROVED,
    budget: 8500000,
    allocatedDate: '2024-01-10',
    deadline: '2024-06-15',
    contractor: {
      name: 'AquaPure Solutions',
      rating: 3.8,
      pastProjects: 5
    },
    tags: ['Sanitation', 'Public Health', 'Utility'],
    votes: 560,
    upvotes: 520,
    downvotes: 40,
    budgetBreakdown: [
      { category: 'Equipment', amount: 6000000 },
      { category: 'Civil Works', amount: 1500000 },
      { category: 'Operation Setup', amount: 1000000 }
    ],
    timeline: [
      { phase: 'Site Survey', status: 'Completed', date: '2024-01-20' },
      { phase: 'Equipment Procurement', status: 'In Progress', date: '2024-03-01' }
    ]
  }
];
