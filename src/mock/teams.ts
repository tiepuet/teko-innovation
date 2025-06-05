export interface TeamMember {
  id: string;
  user_id: string;
  user_name: string;
  role: 'leader' | 'member';
  joined_at: string;
}

export interface Team {
  id: string;
  event_id: string;
  name: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  members: TeamMember[];
}

export const mockTeams: Team[] = [
  {
    id: 'team-1',
    event_id: 'event-1',
    name: 'EcoInnovators',
    status: 'approved',
    created_at: '2025-04-10T13:45:00Z',
    members: [
      {
        id: 'member-1',
        user_id: 'user-1',
        user_name: 'Regular User',
        role: 'leader',
        joined_at: '2025-04-10T13:45:00Z',
      },
      {
        id: 'member-2',
        user_id: 'user-google-1',
        user_name: 'Google User',
        role: 'member',
        joined_at: '2025-04-11T10:30:00Z',
      },
    ],
  },
  {
    id: 'team-2',
    event_id: 'event-1',
    name: 'GreenTech Solutions',
    status: 'approved',
    created_at: '2025-04-12T09:15:00Z',
    members: [
      {
        id: 'member-3',
        user_id: 'user-google-1',
        user_name: 'Google User',
        role: 'leader',
        joined_at: '2025-04-12T09:15:00Z',
      },
    ],
  },
  {
    id: 'team-3',
    event_id: 'event-3',
    name: 'StartupWizards',
    status: 'approved',
    created_at: '2025-03-20T14:30:00Z',
    members: [
      {
        id: 'member-4',
        user_id: 'user-1',
        user_name: 'Regular User',
        role: 'leader',
        joined_at: '2025-03-20T14:30:00Z',
      },
    ],
  },
];