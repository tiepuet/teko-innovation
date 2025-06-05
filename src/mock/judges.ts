export interface Judge {
  id: string;
  event_id: string;
  user_id: string;
  user_name: string;
  user_email: string;
}

export const mockJudges: Judge[] = [
  {
    id: 'judge-1',
    event_id: 'event-1',
    user_id: 'admin-1',
    user_name: 'Admin User',
    user_email: 'admin@tekoinnovation.com',
  },
  {
    id: 'judge-2',
    event_id: 'event-3',
    user_id: 'admin-1',
    user_name: 'Admin User',
    user_email: 'admin@tekoinnovation.com',
  },
];