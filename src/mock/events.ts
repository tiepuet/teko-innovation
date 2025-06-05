export interface Event {
  id: string;
  name: string;
  slogan: string;
  description: string;
  image_url: string;
  start_time: string;
  end_time: string;
  status: 'draft' | 'active' | 'closed';
  visibility: 'public' | 'private';
  created_by: string;
  created_at: string;
}

export const mockEvents: Event[] = [
  {
    id: 'event-1',
    name: 'Innovation Challenge 2025',
    slogan: 'Transform Tomorrow, Today',
    description: 'A 48-hour hackathon focused on creating innovative solutions for climate change issues. Join us for an exciting event where teams collaborate, innovate, and compete for valuable prizes.',
    image_url: 'https://images.pexels.com/photos/7103/writing-notes-idea-conference.jpg',
    start_time: '2025-06-15T09:00:00Z',
    end_time: '2025-06-17T09:00:00Z',
    status: 'active',
    visibility: 'public',
    created_by: 'admin-1',
    created_at: '2025-03-10T14:30:00Z',
  },
  {
    id: 'event-2',
    name: 'AI Summit 2025',
    slogan: 'Intelligence Unleashed',
    description: 'Explore the future of artificial intelligence with industry experts. This event brings together researchers, engineers, and entrepreneurs to showcase cutting-edge AI technologies.',
    image_url: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg',
    start_time: '2025-08-20T10:00:00Z',
    end_time: '2025-08-22T18:00:00Z',
    status: 'draft',
    visibility: 'private',
    created_by: 'admin-1',
    created_at: '2025-04-05T11:15:00Z',
  },
  {
    id: 'event-3',
    name: 'Startup Weekend',
    slogan: 'Launch Your Dream in 54 Hours',
    description: 'An intensive 54-hour event where entrepreneurs, developers, designers, and business experts come together to build and launch startups in just one weekend.',
    image_url: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg',
    start_time: '2025-05-01T17:00:00Z',
    end_time: '2025-05-03T21:00:00Z',
    status: 'active',
    visibility: 'public',
    created_by: 'admin-1',
    created_at: '2025-02-18T09:45:00Z',
  },
  {
    id: 'event-4',
    name: 'Tech for Good',
    slogan: 'Innovation with Impact',
    description: 'A hackathon dedicated to solving social and environmental challenges using technology. Join forces with like-minded individuals to create solutions that make a difference.',
    image_url: 'https://images.pexels.com/photos/3182812/pexels-photo-3182812.jpeg',
    start_time: '2025-09-10T09:00:00Z',
    end_time: '2025-09-12T18:00:00Z',
    status: 'active',
    visibility: 'public',
    created_by: 'admin-1',
    created_at: '2025-05-22T13:20:00Z',
  },
];