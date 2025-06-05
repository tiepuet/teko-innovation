import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Row, Col, Typography, Tag, Button, Input, Empty, Spin } from 'antd';
import { Search, Calendar, Users, Plus } from 'lucide-react';
import { mockEvents, Event } from '../../mock/events';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '../../context/AuthContext';

const { Title, Text } = Typography;

const EventListPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    // Simulate API fetch
    const fetchEvents = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Filter events based on visibility and user role
        const visibleEvents = mockEvents.filter(event => 
          event.visibility === 'public' || user?.role === 'admin'
        );
        
        setEvents(visibleEvents);
        setFilteredEvents(visibleEvents);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredEvents(events);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredEvents(
        events.filter(
          event => 
            event.name.toLowerCase().includes(query) || 
            event.description.toLowerCase().includes(query) ||
            event.slogan.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, events]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'draft':
        return 'blue';
      case 'closed':
        return 'red';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <Title level={2} className="mb-1">Events</Title>
          <Text className="text-gray-500">Discover and join innovation events</Text>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Search events..."
            prefix={<Search size={16} />}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full sm:w-64"
          />
          
          {user?.role === 'admin' && (
            <Button 
              type="primary" 
              icon={<Plus size={16} />}
              className="bg-primary-500 hover:bg-primary-600"
            >
              Create Event
            </Button>
          )}
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <Empty 
          description="No events found" 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          className="my-16"
        />
      ) : (
        <Row gutter={[24, 24]}>
          {filteredEvents.map(event => (
            <Col xs={24} md={12} xl={8} key={event.id}>
              <Link to={`/events/${event.id}`} className="block h-full">
                <Card 
                  hoverable 
                  className="h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg"
                  cover={
                    <div className="h-48 overflow-hidden">
                      <img
                        alt={event.name}
                        src={event.image_url}
                        className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-110"
                      />
                    </div>
                  }
                >
                  <div className="flex justify-between items-start">
                    <Title level={4} className="mb-2 line-clamp-1">{event.name}</Title>
                    <Tag color={getStatusColor(event.status)} className="ml-2">
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </Tag>
                  </div>
                  
                  <Text className="text-gray-500 italic block mb-4">{event.slogan}</Text>
                  
                  <Text className="line-clamp-3 text-gray-600 mb-4">{event.description}</Text>
                  
                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <div className="flex items-center text-gray-500 text-sm mb-2">
                      <Calendar size={16} className="mr-2" />
                      <Text>
                        {new Date(event.start_time).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </Text>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Text className="text-gray-500 text-sm">
                        {event.status === 'active' 
                          ? `Starts ${formatDistanceToNow(new Date(event.start_time), { addSuffix: true })}`
                          : event.status === 'closed'
                          ? 'Event ended'
                          : 'Coming soon'}
                      </Text>
                      
                      <div className="flex items-center text-gray-500 text-sm">
                        <Users size={16} className="mr-1" />
                        <Text>
                          {Math.floor(Math.random() * 50) + 10} participants
                        </Text>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default EventListPage;