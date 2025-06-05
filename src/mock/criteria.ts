export interface ScoringCriterion {
  id: string;
  event_id: string;
  name: string;
  weight: number;
  max_score: number;
}

export const mockCriteria: ScoringCriterion[] = [
  {
    id: 'criterion-1',
    event_id: 'event-1',
    name: 'Innovation',
    weight: 0.35,
    max_score: 10,
  },
  {
    id: 'criterion-2',
    event_id: 'event-1',
    name: 'Feasibility',
    weight: 0.25,
    max_score: 10,
  },
  {
    id: 'criterion-3',
    event_id: 'event-1',
    name: 'Impact',
    weight: 0.3,
    max_score: 10,
  },
  {
    id: 'criterion-4',
    event_id: 'event-1',
    name: 'Presentation',
    weight: 0.1,
    max_score: 10,
  },
  {
    id: 'criterion-5',
    event_id: 'event-3',
    name: 'Business Model',
    weight: 0.4,
    max_score: 10,
  },
  {
    id: 'criterion-6',
    event_id: 'event-3',
    name: 'Market Potential',
    weight: 0.3,
    max_score: 10,
  },
  {
    id: 'criterion-7',
    event_id: 'event-3',
    name: 'Execution Plan',
    weight: 0.3,
    max_score: 10,
  },
];