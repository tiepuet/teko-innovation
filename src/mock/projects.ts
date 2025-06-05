export interface Project {
  id: string;
  event_id: string;
  team_id: string;
  team_name: string;
  idea_id: string;
  idea_title: string;
  presentation_time: string | null;
  code_url: string | null;
  slide_url: string | null;
  demo_url: string | null;
  scores?: {
    criterion_id: string;
    criterion_name: string;
    judge_id: string;
    judge_name: string;
    score: number;
  }[];
  average_score?: number;
}

export const mockProjects: Project[] = [
  {
    id: 'project-1',
    event_id: 'event-1',
    team_id: 'team-1',
    team_name: 'EcoInnovators',
    idea_id: 'idea-1',
    idea_title: 'Smart Urban Farming',
    presentation_time: '2025-06-16T14:00:00Z',
    code_url: 'https://github.com/example/smart-urban-farming',
    slide_url: 'https://slides.example.com/smart-urban-farming',
    demo_url: 'https://demo.example.com/smart-urban-farming',
    scores: [
      {
        criterion_id: 'criterion-1',
        criterion_name: 'Innovation',
        judge_id: 'judge-1',
        judge_name: 'Judge One',
        score: 8.5,
      },
      {
        criterion_id: 'criterion-2',
        criterion_name: 'Feasibility',
        judge_id: 'judge-1',
        judge_name: 'Judge One',
        score: 7.8,
      },
      {
        criterion_id: 'criterion-3',
        criterion_name: 'Impact',
        judge_id: 'judge-1',
        judge_name: 'Judge One',
        score: 9.2,
      },
    ],
    average_score: 8.5,
  },
  {
    id: 'project-2',
    event_id: 'event-1',
    team_id: 'team-2',
    team_name: 'GreenTech Solutions',
    idea_id: 'idea-2',
    idea_title: 'Community Carbon Tracker',
    presentation_time: '2025-06-16T15:30:00Z',
    code_url: 'https://github.com/example/carbon-tracker',
    slide_url: 'https://slides.example.com/carbon-tracker',
    demo_url: null,
    scores: [
      {
        criterion_id: 'criterion-1',
        criterion_name: 'Innovation',
        judge_id: 'judge-1',
        judge_name: 'Judge One',
        score: 9.0,
      },
      {
        criterion_id: 'criterion-2',
        criterion_name: 'Feasibility',
        judge_id: 'judge-1',
        judge_name: 'Judge One',
        score: 7.5,
      },
      {
        criterion_id: 'criterion-3',
        criterion_name: 'Impact',
        judge_id: 'judge-1',
        judge_name: 'Judge One',
        score: 8.8,
      },
    ],
    average_score: 8.4,
  },
  {
    id: 'project-3',
    event_id: 'event-3',
    team_id: 'team-3',
    team_name: 'StartupWizards',
    idea_id: 'idea-4',
    idea_title: 'Skill Exchange Platform',
    presentation_time: '2025-05-02T16:00:00Z',
    code_url: null,
    slide_url: null,
    demo_url: null,
    scores: [],
    average_score: 0,
  },
];