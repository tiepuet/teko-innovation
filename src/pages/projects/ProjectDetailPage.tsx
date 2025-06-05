import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Typography, Spin, Tag, Button, Card, Descriptions, Divider, Empty, Tabs, Table, Form, Input, Modal, InputNumber, notification } from 'antd';
import { ArrowLeft, Users, Lightbulb, Link as LinkIcon, PresentationIcon, Star, Award, ExternalLink, User } from 'lucide-react';
import { mockProjects, Project } from '../../mock/projects';
import { mockCriteria, ScoringCriterion } from '../../mock/criteria';
import { mockEvents } from '../../mock/events';
import { mockTeams } from '../../mock/teams';
import { mockIdeas } from '../../mock/ideas';
import { useAuth } from '../../context/AuthContext';
import { mockJudges } from '../../mock/judges';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [criteria, setCriteria] = useState<ScoringCriterion[]>([]);
  const [loading, setLoading] = useState(true);
  const [isScoreModalVisible, setIsScoreModalVisible] = useState(false);
  const [isSubmitModalVisible, setIsSubmitModalVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();
  const [submitForm] = Form.useForm();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProjectDetails = async () => {
      setLoading(true);
      try {
        // In a real app, these would be API calls
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const projectData = mockProjects.find(p => p.id === id);
        
        if (projectData) {
          setProject(projectData);
          setCriteria(mockCriteria.filter(criterion => criterion.event_id === projectData.event_id));
        }
      } catch (error) {
        notification.error({
          message: 'Error',
          description: 'Failed to load project details',
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProjectDetails();
    }
  }, [id]);

  const handleSubmitScores = async (values: any) => {
    setSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      notification.success({
        message: 'Scores Submitted',
        description: 'Your scores have been submitted successfully.',
      });
      
      setIsScoreModalVisible(false);
      form.resetFields();
      
      // In a real app, we would update the project scores here
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitResults = async (values: any) => {
    setSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      notification.success({
        message: 'Project Results Submitted',
        description: 'Your project results have been submitted successfully.',
      });
      
      setIsSubmitModalVisible(false);
      submitForm.resetFields();
      
      // In a real app, we would update the project here
    } finally {
      setSubmitting(false);
    }
  };

  const isJudge = mockJudges.some(judge => 
    judge.event_id === project?.event_id && judge.user_id === user?.id
  );

  const isTeamMember = project && mockTeams
    .find(team => team.id === project.team_id)?.members
    .some(member => member.user_id === user?.id);

  const event = project ? mockEvents.find(e => e.id === project.event_id) : null;
  const team = project ? mockTeams.find(t => t.id === project.team_id) : null;
  const idea = project ? mockIdeas.find(i => i.id === project.idea_id) : null;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (!project || !event || !team || !idea) {
    return (
      <div className="text-center py-16">
        <Empty
          description="Project not found"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
        <Button type="primary" href="/events" className="mt-4">
          Back to Events
        </Button>
      </div>
    );
  }

  const scoringColumns = [
    {
      title: 'Criterion',
      dataIndex: 'criterion_name',
      key: 'criterion_name',
    },
    {
      title: 'Judge',
      dataIndex: 'judge_name',
      key: 'judge_name',
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      render: (score: number) => (
        <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md font-medium text-center">
          {score.toFixed(1)}
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Back Button */}
      <Link to={`/events/${project.event_id}`} className="inline-flex items-center mb-6 text-gray-600 hover:text-gray-900">
        <ArrowLeft size={16} className="mr-2" />
        Back to Event
      </Link>

      {/* Project Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
          <div>
            <div className="flex items-center">
              <Title level={2} className="m-0">{idea.title}</Title>
              {project.average_score > 0 && (
                <div className="ml-4 flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-lg">
                  <Star size={18} className="mr-1" />
                  <Text strong>{project.average_score.toFixed(1)}</Text>
                </div>
              )}
            </div>
            <Text type="secondary" className="text-lg">Team: {team.name}</Text>
          </div>

          <div className="mt-4 md:mt-0 space-y-2 md:space-y-0 md:space-x-2 md:flex">
            {isJudge && (
              <Button 
                type="primary" 
                icon={<Star size={16} />}
                onClick={() => setIsScoreModalVisible(true)}
              >
                Score Project
              </Button>
            )}
            
            {isTeamMember && (
              <Button 
                type="default" 
                icon={<LinkIcon size={16} />}
                onClick={() => setIsSubmitModalVisible(true)}
              >
                Submit Results
              </Button>
            )}
          </div>
        </div>

        <Descriptions bordered column={{ xs: 1, sm: 2 }} className="mt-6">
          <Descriptions.Item label="Event">
            <Link to={`/events/${event.id}`}>{event.name}</Link>
          </Descriptions.Item>
          <Descriptions.Item label="Team">
            {team.name} ({team.members.length} members)
          </Descriptions.Item>
          <Descriptions.Item label="Presentation Time">
            {project.presentation_time 
              ? new Date(project.presentation_time).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Not scheduled yet'}
          </Descriptions.Item>
          <Descriptions.Item label="Average Score">
            {project.average_score 
              ? <span className="font-semibold">{project.average_score.toFixed(1)} / 10</span> 
              : 'Not scored yet'}
          </Descriptions.Item>
        </Descriptions>

        {/* Project Submissions */}
        <div className="mt-8">
          <Title level={4}>Project Submissions</Title>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <Card className={`border ${project.code_url ? 'border-green-200' : 'border-gray-200'}`}>
              <div className="flex items-start">
                <div className={`p-3 rounded-lg ${project.code_url ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'} mr-4`}>
                  <Code size={24} />
                </div>
                <div>
                  <Title level={5} className="m-0">Source Code</Title>
                  {project.code_url ? (
                    <a href={project.code_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 flex items-center mt-2">
                      View Code <ExternalLink size={14} className="ml-1" />
                    </a>
                  ) : (
                    <Text type="secondary">Not submitted yet</Text>
                  )}
                </div>
              </div>
            </Card>
            
            <Card className={`border ${project.slide_url ? 'border-blue-200' : 'border-gray-200'}`}>
              <div className="flex items-start">
                <div className={`p-3 rounded-lg ${project.slide_url ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'} mr-4`}>
                  <PresentationIcon size={24} />
                </div>
                <div>
                  <Title level={5} className="m-0">Presentation</Title>
                  {project.slide_url ? (
                    <a href={project.slide_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 flex items-center mt-2">
                      View Slides <ExternalLink size={14} className="ml-1" />
                    </a>
                  ) : (
                    <Text type="secondary">Not submitted yet</Text>
                  )}
                </div>
              </div>
            </Card>
            
            <Card className={`border ${project.demo_url ? 'border-purple-200' : 'border-gray-200'}`}>
              <div className="flex items-start">
                <div className={`p-3 rounded-lg ${project.demo_url ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'} mr-4`}>
                  <PlayCircle size={24} />
                </div>
                <div>
                  <Title level={5} className="m-0">Demo</Title>
                  {project.demo_url ? (
                    <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 flex items-center mt-2">
                      View Demo <ExternalLink size={14} className="ml-1" />
                    </a>
                  ) : (
                    <Text type="secondary">Not submitted yet</Text>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Project Content */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <Tabs defaultActiveKey="details">
          <TabPane tab="Project Details" key="details">
            <div className="mb-8">
              <Title level={4}>Idea Description</Title>
              <Paragraph className="text-gray-700 whitespace-pre-wrap">
                {idea.description}
              </Paragraph>
            </div>
            
            <Divider />
            
            <div>
              <Title level={4}>Team Members</Title>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {team.members.map(member => (
                  <Card key={member.id} size="small" className="border border-gray-200">
                    <div className="flex items-center">
                      <Avatar
                        size={40}
                        icon={<User size={24} />}
                        className="bg-primary-100 text-primary-600"
                      />
                      <div className="ml-3">
                        <Text strong className="block">{member.user_name}</Text>
                        <Text type="secondary" className="text-xs">
                          {member.role === 'leader' ? 'Team Leader' : 'Team Member'}
                        </Text>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabPane>
          
          <TabPane tab="Scores & Feedback" key="scores">
            {project.scores && project.scores.length > 0 ? (
              <Table 
                dataSource={project.scores} 
                columns={scoringColumns}
                rowKey={(record) => `${record.criterion_id}-${record.judge_id}`}
                pagination={false}
              />
            ) : (
              <div className="text-center py-8">
                <Empty description="No scores available yet" />
              </div>
            )}
          </TabPane>
        </Tabs>
      </div>

      {/* Score Modal */}
      <Modal
        title="Score Project"
        open={isScoreModalVisible}
        onCancel={() => setIsScoreModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmitScores}
        >
          {criteria.map(criterion => (
            <Form.Item
              key={criterion.id}
              name={['scores', criterion.id]}
              label={`${criterion.name} (Weight: ${(criterion.weight * 100).toFixed(0)}%, Max: ${criterion.max_score})`}
              rules={[{ required: true, message: 'Please enter a score' }]}
            >
              <InputNumber 
                min={0} 
                max={criterion.max_score} 
                step={0.1}
                className="w-full"
              />
            </Form.Item>
          ))}
          
          <Form.Item
            name="feedback"
            label="General Feedback (Optional)"
          >
            <TextArea rows={4} placeholder="Provide general feedback for the team" />
          </Form.Item>
          
          <Form.Item className="mb-0 flex justify-end">
            <Button onClick={() => setIsScoreModalVisible(false)} className="mr-2">
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={submitting}>
              Submit Scores
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Submit Results Modal */}
      <Modal
        title="Submit Project Results"
        open={isSubmitModalVisible}
        onCancel={() => setIsSubmitModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={submitForm}
          layout="vertical"
          onFinish={handleSubmitResults}
          initialValues={{
            code_url: project.code_url || '',
            slide_url: project.slide_url || '',
            demo_url: project.demo_url || '',
          }}
        >
          <Form.Item
            name="code_url"
            label="Source Code URL"
            rules={[
              { required: false },
              { type: 'url', message: 'Please enter a valid URL' }
            ]}
          >
            <Input placeholder="e.g., https://github.com/yourusername/project-repo" />
          </Form.Item>
          
          <Form.Item
            name="slide_url"
            label="Presentation Slides URL"
            rules={[
              { required: false },
              { type: 'url', message: 'Please enter a valid URL' }
            ]}
          >
            <Input placeholder="e.g., https://slides.com/yourusername/presentation" />
          </Form.Item>
          
          <Form.Item
            name="demo_url"
            label="Demo URL"
            rules={[
              { required: false },
              { type: 'url', message: 'Please enter a valid URL' }
            ]}
          >
            <Input placeholder="e.g., https://yourdemo.netlify.app" />
          </Form.Item>
          
          <Form.Item className="mb-0 flex justify-end">
            <Button onClick={() => setIsSubmitModalVisible(false)} className="mr-2">
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={submitting}>
              Submit Results
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

// These components aren't imported from lucide-react
const Code = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="16 18 22 12 16 6"></polyline>
    <polyline points="8 6 2 12 8 18"></polyline>
  </svg>
);

const PlayCircle = ({ size = 24, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10"></circle>
    <polygon points="10 8 16 12 10 16 10 8"></polygon>
  </svg>
);

const Avatar = ({ size, icon, className }: { size: number, icon: React.ReactNode, className?: string }) => (
  <div
    className={`flex items-center justify-center rounded-full overflow-hidden ${className}`}
    style={{ width: size, height: size }}
  >
    {icon}
  </div>
);

export default ProjectDetailPage;