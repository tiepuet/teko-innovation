import { Typography, Card, Row, Col, Descriptions } from 'antd';
import { Calendar, Clock, User } from 'lucide-react';
import { Event } from '../../mock/events';

const { Title, Text } = Typography;

interface EventInfoSectionProps {
  event: Event;
}

const EventInfoSection: React.FC<EventInfoSectionProps> = ({ event }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <Title level={3} className="mb-6">Event Details</Title>
      
      <Descriptions bordered column={{ xs: 1, sm: 2, md: 3 }}>
        <Descriptions.Item label="Status">
          <span className={`
            px-2 py-1 rounded-full text-sm font-medium
            ${event.status === 'active' ? 'bg-green-100 text-green-800' : 
              event.status === 'draft' ? 'bg-blue-100 text-blue-800' : 
              'bg-red-100 text-red-800'}
          `}>
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </span>
        </Descriptions.Item>
        
        <Descriptions.Item label="Visibility">
          <span className={`
            px-2 py-1 rounded-full text-sm font-medium
            ${event.visibility === 'public' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
          `}>
            {event.visibility.charAt(0).toUpperCase() + event.visibility.slice(1)}
          </span>
        </Descriptions.Item>
        
        <Descriptions.Item label="Created">
          {new Date(event.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </Descriptions.Item>
      </Descriptions>
      
      <div className="mt-8">
        <Title level={4}>About This Event</Title>
        <Text className="block mb-8">
          {event.description}
        </Text>
        
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <Card className="h-full bg-primary-50 border-primary-100 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-start">
                <Calendar size={24} className="text-primary-500 mr-4 mt-1" />
                <div>
                  <Title level={5}>Event Date</Title>
                  <Text className="block">
                    {new Date(event.start_time).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Text>
                  <Text className="block text-gray-500">
                    to {new Date(event.end_time).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Text>
                </div>
              </div>
            </Card>
          </Col>
          
          <Col xs={24} md={8}>
            <Card className="h-full bg-secondary-50 border-secondary-100 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-start">
                <Clock size={24} className="text-secondary-500 mr-4 mt-1" />
                <div>
                  <Title level={5}>Event Time</Title>
                  <Text className="block">
                    {new Date(event.start_time).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                  <Text className="block text-gray-500">
                    to {new Date(event.end_time).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>
                </div>
              </div>
            </Card>
          </Col>
          
          <Col xs={24} md={8}>
            <Card className="h-full bg-accent-50 border-accent-100 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-start">
                <User size={24} className="text-accent-500 mr-4 mt-1" />
                <div>
                  <Title level={5}>Organizer</Title>
                  <Text className="block">Teko Innovation Team</Text>
                  <Text className="block text-gray-500">support@tekoinnovation.com</Text>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default EventInfoSection;