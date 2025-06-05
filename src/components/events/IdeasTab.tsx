import { useState } from 'react';
import { Table, Button, Tag, Typography, Modal, Form, Input, notification, Space } from 'antd';
import { Plus, Check, X, AlertCircle } from 'lucide-react';
import { Idea } from '../../mock/ideas';
import { Event } from '../../mock/events';
import { useAuth } from '../../context/AuthContext';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface IdeasTabProps {
  ideas: Idea[];
  isAdmin: boolean;
  event: Event;
}

const IdeasTab: React.FC<IdeasTabProps> = ({ ideas, isAdmin, event }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  const canSubmitIdea = event.status === 'active';

  const handleSubmitIdea = async (values: any) => {
    setSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      notification.success({
        message: 'Idea Submitted',
        description: 'Your idea has been submitted for review.',
      });
      
      setIsModalVisible(false);
      form.resetFields();
      
      // In a real app, we would add the new idea to the list here
    } finally {
      setSubmitting(false);
    }
  };

  const handleApproveIdea = async (id: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    notification.success({
      message: 'Idea Approved',
      description: 'The idea has been approved.',
    });
    
    // In a real app, we would update the idea status here
  };

  const handleRejectIdea = async (id: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    notification.success({
      message: 'Idea Rejected',
      description: 'The idea has been rejected.',
    });
    
    // In a real app, we would update the idea status here
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

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: Idea) => (
        <div>
          <Text strong>{text}</Text>
          <Text type="secondary" className="block text-xs">
            Submitted by {record.user_name}
          </Text>
        </div>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
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
      render: (_, record: Idea) => (
        <Space>
          {record.status === 'pending' && (
            <>
              <Button
                type="text"
                icon={<Check className="text-green-500\" size={16} />}
                onClick={() => handleApproveIdea(record.id)}
              />
              <Button
                type="text"
                icon={<X className="text-red-500\" size={16} />}
                onClick={() => handleRejectIdea(record.id)}
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
        <Title level={4}>Ideas ({ideas.length})</Title>
        
        {canSubmitIdea && (
          <Button 
            type="primary"
            icon={<Plus size={16} />}
            onClick={() => setIsModalVisible(true)}
            className="bg-primary-500 hover:bg-primary-600"
          >
            Submit Idea
          </Button>
        )}
      </div>

      {!canSubmitIdea && !isAdmin && (
        <div className="bg-amber-50 text-amber-800 p-4 rounded-lg mb-6 flex items-start">
          <AlertCircle className="mr-3 flex-shrink-0 mt-1" size={20} />
          <div>
            <Text strong className="text-amber-800">
              Idea submission is not available
            </Text>
            <Text className="block text-amber-700">
              {event.status === 'draft' 
                ? 'This event is still in draft mode. Idea submission will open once the event is active.' 
                : 'This event is closed. Idea submission is no longer available.'}
            </Text>
          </div>
        </div>
      )}

      <Table 
        dataSource={ideas} 
        columns={columns} 
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title="Submit New Idea"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmitIdea}
        >
          <Form.Item
            name="title"
            label="Idea Title"
            rules={[{ required: true, message: 'Please enter a title for your idea' }]}
          >
            <Input placeholder="Enter a concise, descriptive title" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please describe your idea' }]}
          >
            <TextArea 
              rows={6} 
              placeholder="Describe your idea in detail. What problem does it solve? How will it be implemented? What makes it innovative?"
            />
          </Form.Item>
          
          <Form.Item className="mb-0 flex justify-end">
            <Button onClick={() => setIsModalVisible(false)} className="mr-2">
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={submitting}>
              Submit Idea
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default IdeasTab;