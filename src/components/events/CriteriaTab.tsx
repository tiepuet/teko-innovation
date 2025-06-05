import { useState } from 'react';
import { Table, Button, Typography, Modal, Form, Input, InputNumber, notification, Space } from 'antd';
import { Plus, Edit, Trash2, AlertCircle } from 'lucide-react';
import { ScoringCriterion } from '../../mock/criteria';
import { Event } from '../../mock/events';

const { Title, Text } = Typography;

interface CriteriaTabProps {
  criteria: ScoringCriterion[];
  isAdmin: boolean;
  event: Event;
}

const CriteriaTab: React.FC<CriteriaTabProps> = ({ criteria, isAdmin, event }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCriterion, setEditingCriterion] = useState<ScoringCriterion | null>(null);
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const showModal = (criterion?: ScoringCriterion) => {
    if (criterion) {
      setEditingCriterion(criterion);
      form.setFieldsValue({
        name: criterion.name,
        weight: criterion.weight,
        max_score: criterion.max_score,
      });
    } else {
      setEditingCriterion(null);
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleSubmit = async (values: any) => {
    setSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      notification.success({
        message: editingCriterion ? 'Criterion Updated' : 'Criterion Created',
        description: editingCriterion 
          ? 'The scoring criterion has been updated successfully.' 
          : 'A new scoring criterion has been created.',
      });
      
      setIsModalVisible(false);
      form.resetFields();
      
      // In a real app, we would update the criteria list here
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this criterion?',
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        notification.success({
          message: 'Criterion Deleted',
          description: 'The scoring criterion has been deleted successfully.',
        });
        
        // In a real app, we would remove the criterion from the list here
      },
    });
  };

  const columns = [
    {
      title: 'Criterion Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Weight',
      dataIndex: 'weight',
      key: 'weight',
      render: (weight: number) => `${(weight * 100).toFixed(0)}%`,
    },
    {
      title: 'Maximum Score',
      dataIndex: 'max_score',
      key: 'max_score',
    },
  ];

  if (isAdmin) {
    columns.push({
      title: 'Actions',
      key: 'actions',
      render: (_, record: ScoringCriterion) => (
        <Space>
          <Button
            type="text"
            icon={<Edit className="text-blue-500\" size={16} />}
            onClick={() => showModal(record)}
          />
          <Button
            type="text"
            icon={<Trash2 className="text-red-500\" size={16} />}
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    });
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Title level={4}>Scoring Criteria ({criteria.length})</Title>
        
        {isAdmin && (
          <Button 
            type="primary"
            icon={<Plus size={16} />}
            onClick={() => showModal()}
            className="bg-primary-500 hover:bg-primary-600"
          >
            Add Criterion
          </Button>
        )}
      </div>

      {criteria.length === 0 && (
        <div className="bg-amber-50 text-amber-800 p-4 rounded-lg mb-6 flex items-start">
          <AlertCircle className="mr-3 flex-shrink-0 mt-1" size={20} />
          <div>
            <Text strong className="text-amber-800">
              No scoring criteria defined
            </Text>
            <Text className="block text-amber-700">
              {isAdmin 
                ? 'Click the "Add Criterion" button to create scoring criteria for this event.' 
                : 'The event organizer has not defined any scoring criteria yet.'}
            </Text>
          </div>
        </div>
      )}

      <Table 
        dataSource={criteria} 
        columns={columns} 
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={editingCriterion ? 'Edit Scoring Criterion' : 'Add Scoring Criterion'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="Criterion Name"
            rules={[{ required: true, message: 'Please enter a name' }]}
          >
            <Input placeholder="E.g., Innovation, Feasibility, Impact" />
          </Form.Item>
          
          <Form.Item
            name="weight"
            label="Weight (%)"
            rules={[{ required: true, message: 'Please enter a weight' }]}
          >
            <InputNumber 
              min={1} 
              max={100} 
              formatter={value => `${value}%`}
              parser={value => value!.replace('%', '')}
              className="w-full"
            />
          </Form.Item>
          
          <Form.Item
            name="max_score"
            label="Maximum Score"
            rules={[{ required: true, message: 'Please enter a maximum score' }]}
            initialValue={10}
          >
            <InputNumber min={1} max={100} className="w-full" />
          </Form.Item>
          
          <Form.Item className="mb-0 flex justify-end">
            <Button onClick={() => setIsModalVisible(false)} className="mr-2">
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={submitting}>
              {editingCriterion ? 'Update' : 'Create'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CriteriaTab;