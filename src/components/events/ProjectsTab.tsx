import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Typography, Modal, Form, Select, DatePicker, TimePicker, notification, Space, Tag } from 'antd';
import { Plus, ExternalLink } from 'lucide-react';
import { Project } from '../../mock/projects';
import { Team } from '../../mock/teams';
import { Idea } from '../../mock/ideas';
import { Event } from '../../mock/events';

const { Title, Text } = Typography;
const { Option } = Select;

interface ProjectsTabProps {
  projects: Project[];
  isAdmin: boolean;
  event: Event;
  teams: Team[];
  ideas: Idea[];
}

const ProjectsTab: React.FC<ProjectsTabProps> = ({ projects, isAdmin, event, teams, ideas }) => {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const approvedTeams = teams.filter(team => team.status === 'approved');
  const approvedIdeas = ideas.filter(idea => idea.status === 'approved');

  const handleCreateProject = async (values: any) => {
    setSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      notification.success({
        message: 'Project Created',
        description: 'The project has been created successfully.',
      });
      
      setIsModalVisible(false);
      form.resetFields();
      
      // In a real app, we would add the new project to the list here
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      title: 'Project',
      key: 'project',
      render: (_, record: Project) => (
        <div>
          <Text strong>{record.idea_title}</Text>
          <Text type="secondary" className="block text-xs">
            By Team: {record.team_name}
          </Text>
        </div>
      ),
    },
    {
      title: 'Presentation Time',
      dataIndex: 'presentation_time',
      key: 'presentation_time',
      render: (time: string | null) => (
        time ? new Date(time).toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }) : <Tag color="red">Not scheduled</Tag>
      ),
    },
    {
      title: 'Submission Status',
      key: 'submission_status',
      render: (_, record: Project) => {
        const hasAllSubmissions = record.code_url && record.slide_url && record.demo_url;
        const hasPartialSubmissions = record.code_url || record.slide_url || record.demo_url;
        
        return hasAllSubmissions ? (
          <Tag color="green">Complete</Tag>
        ) : hasPartialSubmissions ? (
          <Tag color="orange">Partial</Tag>
        ) : (
          <Tag color="red">Not Submitted</Tag>
        );
      },
    },
    {
      title: 'Average Score',
      dataIndex: 'average_score',
      key: 'average_score',
      render: (score: number) => {
        return score > 0 ? (
          <div className="flex items-center">
            <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md font-medium">
              {score.toFixed(1)}
            </div>
          </div>
        ) : (
          <Tag color="gray">Not scored</Tag>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: Project) => (
        <Space>
          <Button 
            type="primary" 
            icon={<ExternalLink size={16} />}
            onClick={() => navigate(`/projects/${record.id}`)}
          >
            View Details
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title level={4}>Projects ({projects.length})</Title>
        
        {isAdmin && (
          <Button 
            type="primary"
            icon={<Plus size={16} />}
            onClick={() => setIsModalVisible(true)}
            disabled={approvedTeams.length === 0 || approvedIdeas.length === 0}
            className="bg-primary-500 hover:bg-primary-600"
          >
            Create Project
          </Button>
        )}
      </div>

      <Table 
        dataSource={projects} 
        columns={columns} 
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title="Create New Project"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateProject}
        >
          <Form.Item
            name="team_id"
            label="Team"
            rules={[{ required: true, message: 'Please select a team' }]}
          >
            <Select placeholder="Select a team">
              {approvedTeams.map(team => (
                <Option key={team.id} value={team.id}>
                  {team.name} ({team.members.length} members)
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="idea_id"
            label="Idea"
            rules={[{ required: true, message: 'Please select an idea' }]}
          >
            <Select placeholder="Select an idea">
              {approvedIdeas.map(idea => (
                <Option key={idea.id} value={idea.id}>
                  {idea.title}
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="presentation_time"
            label="Presentation Date & Time"
            rules={[{ required: true, message: 'Please select a presentation time' }]}
          >
            <DatePicker 
              showTime 
              format="YYYY-MM-DD HH:mm" 
              className="w-full"
              disabledDate={current => {
                const startDate = new Date(event.start_time);
                const endDate = new Date(event.end_time);
                return current && (current.valueOf() < startDate.valueOf() || current.valueOf() > endDate.valueOf());
              }}
            />
          </Form.Item>
          
          <Form.Item className="mb-0 flex justify-end">
            <Button onClick={() => setIsModalVisible(false)} className="mr-2">
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={submitting}>
              Create Project
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProjectsTab;