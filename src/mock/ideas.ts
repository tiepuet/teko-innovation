export interface Idea {
  id: string;
  event_id: string;
  user_id: string;
  user_name: string;
  title: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export const mockIdeas: Idea[] = [
  {
    id: 'idea-1',
    event_id: 'event-1',
    user_id: 'user-1',
    user_name: 'Regular User',
    title: 'Smart Urban Farming',
    description: 'An IoT-based system that optimizes urban farming using sensors, automation, and AI to maximize yield while minimizing water and energy usage.',
    status: 'approved',
    created_at: '2025-04-02T10:15:00Z',
  },
  {
    id: 'idea-2',
    event_id: 'event-1',
    user_id: 'user-google-1',
    user_name: 'Google User',
    title: 'Community Carbon Tracker',
    description: 'A platform that helps communities track and reduce their carbon footprint through gamification and social challenges.',
    status: 'approved',
    created_at: '2025-04-05T14:30:00Z',
  },
  {
    id: 'idea-3',
    event_id: 'event-1',
    user_id: 'user-1',
    user_name: 'Regular User',
    title: 'Waste-to-Energy Converter',
    description: 'A small-scale device that converts organic household waste into usable energy for charging devices or powering small appliances.',
    status: 'pending',
    created_at: '2025-04-08T09:45:00Z',
  },
  {
    id: 'idea-4',
    event_id: 'event-3',
    user_id: 'user-google-1',
    user_name: 'Google User',
    title: 'Skill Exchange Platform',
    description: 'A marketplace where people can exchange skills and services without money, promoting community cooperation and resource efficiency.',
    status: 'approved',
    created_at: '2025-03-15T11:20:00Z',
  },
];