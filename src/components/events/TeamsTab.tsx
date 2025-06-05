import { useState } from 'react';
import { Table, Button, Tag, Typography, Modal, Form, Input, notification, Space, List, Avatar } from 'antd';
import { Plus, Check, X, AlertCircle, User, Users } from 'lucide-react';
import { Team } from '../../mock/teams';
import { Event } from '../../mock/events';
import { useAuth } from '../../context/AuthContext';

const { Title, Text } = Typography;

interface TeamsTabProps {
  teams: Team[];
  isAdmin: boolean;
  event: Event;
}

const TeamsTab: React.FC<TeamsTabProps> = ({ teams, isAdmin, event }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  const canSubmitTeam = event.status === 'active';

  const handleSubmitTeam = async (values: any) => {
    setSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      notification.success({
        message: 'Team Created',
        description: 'Your team has been created and submitted for review.',
      });
      
      setIsModalVisible(false);
      form.resetFields();
      
      // In a real app, we would add the new team to the list here
    } finally {
      setSubmitting(false);
    }
  };

  const handleApproveTeam = async (id: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    notification.success({
      message: 'Team Approved',
      description: 'The team has been approved.',
    });
    
    // In a real app, we would update the team status here
  };

  const handleRejectTeam = async (id: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    notification.success({
      message: 'Team Rejected',
      description: 'The team has been rejected.',
    });
    
    // In a real app, we would update the team status here
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'green';
      case 'rejected':
        return 'red';
      default:
        return 'gold';
    }
  };

  const expandedRowRender = (record: Team) => {
    return (
      <List
        size="small"
        header={<Text strong>Team Members</Text>}
        dataSource={record.members}
        renderItem={member => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar icon={<User size={16} />} />}
              title={
                <div className="flex items-center">
                  {member.user_name}
                  {member.role === 'leader' && (
                    <Tag color="blue\" className="ml-2">Leader</Tag>
                  )}
                </div>
              }
              description={`Joined ${new Date(member.joined_at).toLocaleDateString()}`}
            />
          </List.Item>
        )}
      />
    );
  };

  const columns = [
    {
      title: 'Team Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Team) => (
        <Text strong>{text} ({record.members.length} members)</Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Tag>
      ),
    },
    {
      title: 'Created',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => (
        new Date(date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })
      ),
    },
  ];

  if (isAdmin) {
    columns.push({
      title: 'Actions',
      key: 'actions',
      render: (_, record: Team) => (
        <Space>
          {record.status === 'pending' && (
            <>
              <Button
                type="text"
                icon={<Check className="text-green-500\" size={16} />}
                onClick={() => handleApproveTeam(record.id)}
              />
              <Button
                type="text"
                icon={<X className="text-red-500\" size={16} />}
                onClick={() => handleRejectTeam(record.id)}
              />
            </>
          )}
        </Space>
      ),
    });
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title level={4}>Teams ({teams.length})</Title>
        
        {canSubmitTeam && (
          <Button 
            type="primary"
            icon={<Plus size={16} />}
            onClick={() => setIsModalVisible(true)}
            className="bg-primary-500 hover:bg-primary-600"
          >
            Create Team
          </Button>
        )}
      </div>

      {!canSubmitTeam && !isAdmin && (
        <div className="bg-amber-50 text-amber-800 p-4 rounded-lg mb-6 flex items-start">
          <AlertCircle className="mr-3 flex-shrink-0 mt-1" size={20} />
          <div>
            <Text strong className="text-amber-800">
              Team creation is not available
            </Text>
            <Text className="block text-amber-700">
              {event.status === 'draft' 
                ? 'This event is still in draft mode. Team creation will open once the event is active.' 
                : 'This event is closed. Team creation is no longer available.'}
            </Text>
          </div>
        </div>
      )}

      <Table 
        dataSource={teams} 
        columns={columns} 
        rowKey="id"
        expandable={{ expandedRowRender }}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title="Create New Team"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmitTeam}
        >
          <Form.Item
            name="teamName"
            label="Team Name"
            rules={[{ required: true, message: 'Please enter a team name' }]}
          >
            <Input 
              prefix={<Users size={16} className="text-gray-400 mr-2" />} 
              placeholder="Enter your team name" 
            />
          </Form.Item>
          
          <Form.Item className="mb-0 flex justify-end">
            <Button onClick={() => setIsModalVisible(false)} className="mr-2">
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={submitting}>
              Create Team
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TeamsTab;