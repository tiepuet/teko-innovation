import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, Typography, Spin, Tag, Button, Avatar, notification, Empty } from 'antd';
import { Calendar, Clock, User, Users, Lightbulb, Award, Edit, Plus } from 'lucide-react';
import { mockEvents, Event } from '../../mock/events';
import { mockIdeas, Idea } from '../../mock/ideas';
import { mockTeams, Team } from '../../mock/teams';
import { mockProjects, Project } from '../../mock/projects';
import { mockCriteria, ScoringCriterion } from '../../mock/criteria';
import EventInfoSection from '../../components/events/EventInfoSection';
import IdeasTab from '../../components/events/IdeasTab';
import TeamsTab from '../../components/events/TeamsTab';
import ProjectsTab from '../../components/events/ProjectsTab';
import CriteriaTab from '../../components/events/CriteriaTab';
import { useAuth } from '../../context/AuthContext';

const { Title } = Typography;
const { TabPane } = Tabs;

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [criteria, setCriteria] = useState<ScoringCriterion[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchEventDetails = async () => {
      setLoading(true);
      try {
        // In a real app, these would be API calls
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const eventData = mockEvents.find(e => e.id === id);
        
        if (eventData) {
          setEvent(eventData);
          setIdeas(mockIdeas.filter(idea => idea.event_id === id));
          setTeams(mockTeams.filter(team => team.event_id === id));
          setProjects(mockProjects.filter(project => project.event_id === id));
          setCriteria(mockCriteria.filter(criterion => criterion.event_id === id));
        }
      } catch (error) {
        notification.error({
          message: 'Error',
          description: 'Failed to load event details',
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEventDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-16">
        <Empty
          description="Event not found"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
        <Button type="primary" href="/events" className="mt-4">
          Back to Events
        </Button>
      </div>
    );
  }

  const isAdmin = user?.role === 'admin';

  return (
    <div className="max-w-7xl mx-auto">
      <div className="relative rounded-xl overflow-hidden mb-8">
        <div className="h-64 md:h-96 w-full relative">
          <img
            src={event.image_url}
            alt={event.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-70"></div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
          <div className="flex flex-col md:flex-row md:items-end justify-between">
            <div>
              <Tag color={event.status === 'active' ? 'green' : event.status === 'draft' ? 'blue' : 'red'} className="mb-3">
                {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </Tag>
              <Title level={1} className="text-white mb-2">{event.name}</Title>
              <p className="text-white text-opacity-90 text-lg italic">{event.slogan}</p>
            </div>
            {isAdmin && (
              <Button
                type="primary"
                icon={<Edit size={16} />}
                className="mt-4 md:mt-0"
              >
                Edit Event
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Event details section */}
      <EventInfoSection event={event} />

      {/* Tabs for Ideas, Teams, Projects, and Criteria */}
      <div className="bg-white rounded-xl shadow-sm mt-8 p-6">
        <Tabs defaultActiveKey="info" size="large">
          <TabPane 
            tab={
              <span className="flex items-center">
                <Lightbulb size={18} className="mr-2" />
                Ideas
              </span>
            } 
            key="ideas"
          >
            <IdeasTab ideas={ideas} isAdmin={isAdmin} event={event} />
          </TabPane>
          
          <TabPane 
            tab={
              <span className="flex items-center">
                <Users size={18} className="mr-2" />
                Teams
              </span>
            } 
            key="teams"
          >
            <TeamsTab teams={teams} isAdmin={isAdmin} event={event} />
          </TabPane>
          
          <TabPane 
            tab={
              <span className="flex items-center">
                <Award size={18} className="mr-2" />
                Projects
              </span>
            } 
            key="projects"
          >
            <ProjectsTab projects={projects} isAdmin={isAdmin} event={event} ideas={ideas} teams={teams} />
          </TabPane>
          
          <TabPane 
            tab={
              <span className="flex items-center">
                <Award size={18} className="mr-2" />
                Scoring Criteria
              </span>
            } 
            key="criteria"
          >
            <CriteriaTab criteria={criteria} isAdmin={isAdmin} event={event} />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default EventDetailPage;