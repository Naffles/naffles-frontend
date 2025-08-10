'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardBody, 
  CardHeader,
  Button,
  Input,
  Select,
  SelectItem,
  Textarea,
  Switch,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Progress,
  Tabs,
  Tab
} from '@nextui-org/react';
import { 
  Plus, 
  Twitter, 
  MessageCircle, 
  Send, 
  Link, 
  Calendar,
  Users,
  Target,
  TrendingUp,
  Edit,
  Trash2,
  Play,
  Pause,
  CheckCircle
} from 'lucide-react';

interface SocialTask {
  id: string;
  title: string;
  description: string;
  type: 'twitter_follow' | 'twitter_retweet' | 'twitter_like' | 'discord_join' | 'telegram_join' | 'custom_url';
  targetUrl: string;
  pointsReward: number;
  maxCompletions: number;
  currentCompletions: number;
  status: 'active' | 'paused' | 'completed' | 'expired';
  createdAt: string;
  expiresAt?: string;
  requirements?: {
    minFollowers?: number;
    accountAge?: number;
    verificationRequired?: boolean;
  };
}

interface SocialTaskFormData {
  title: string;
  description: string;
  type: string;
  targetUrl: string;
  pointsReward: number;
  maxCompletions: number;
  expiresAt?: string;
  requirements: {
    minFollowers: number;
    accountAge: number;
    verificationRequired: boolean;
  };
}

interface SocialTaskManagementProps {
  communityId: string;
}

const SocialTaskManagement: React.FC<SocialTaskManagementProps> = ({
  communityId
}) => {
  const [tasks, setTasks] = useState<SocialTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('active');
  const [selectedTask, setSelectedTask] = useState<SocialTask | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const { isOpen: isCreateModalOpen, onOpen: onCreateModalOpen, onClose: onCreateModalClose } = useDisclosure();
  const { isOpen: isEditModalOpen, onOpen: onEditModalOpen, onClose: onEditModalClose } = useDisclosure();
  const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure();

  const [formData, setFormData] = useState<SocialTaskFormData>({
    title: '',
    description: '',
    type: 'twitter_follow',
    targetUrl: '',
    pointsReward: 10,
    maxCompletions: 100,
    requirements: {
      minFollowers: 0,
      accountAge: 0,
      verificationRequired: false
    }
  });

  useEffect(() => {
    fetchTasks();
  }, [communityId]);

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      const mockTasks: SocialTask[] = [
        {
          id: '1',
          title: 'Follow our Twitter',
          description: 'Follow @CryptoEnthusiasts on Twitter to stay updated',
          type: 'twitter_follow',
          targetUrl: 'https://twitter.com/CryptoEnthusiasts',
          pointsReward: 25,
          maxCompletions: 1000,
          currentCompletions: 342,
          status: 'active',
          createdAt: '2024-01-15T00:00:00Z',
          requirements: {
            minFollowers: 10,
            accountAge: 30,
            verificationRequired: false
          }
        },
        {
          id: '2',
          title: 'Retweet our announcement',
          description: 'Retweet our latest community announcement',
          type: 'twitter_retweet',
          targetUrl: 'https://twitter.com/CryptoEnthusiasts/status/123456789',
          pointsReward: 15,
          maxCompletions: 500,
          currentCompletions: 187,
          status: 'active',
          createdAt: '2024-01-18T00:00:00Z',
          expiresAt: '2024-02-18T00:00:00Z'
        },
        {
          id: '3',
          title: 'Join our Discord',
          description: 'Join our Discord server and introduce yourself',
          type: 'discord_join',
          targetUrl: 'https://discord.gg/cryptoenthusiasts',
          pointsReward: 50,
          maxCompletions: 2000,
          currentCompletions: 756,
          status: 'active',
          createdAt: '2024-01-10T00:00:00Z'
        },
        {
          id: '4',
          title: 'Join Telegram group',
          description: 'Join our Telegram group for daily updates',
          type: 'telegram_join',
          targetUrl: 'https://t.me/cryptoenthusiasts',
          pointsReward: 30,
          maxCompletions: 1500,
          currentCompletions: 1500,
          status: 'completed',
          createdAt: '2024-01-05T00:00:00Z'
        }
      ];
      
      setTasks(mockTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'twitter_follow':
      case 'twitter_retweet':
      case 'twitter_like':
        return <Twitter className="w-4 h-4" />;
      case 'discord_join':
        return <MessageCircle className="w-4 h-4" />;
      case 'telegram_join':
        return <Send className="w-4 h-4" />;
      case 'custom_url':
        return <Link className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  const getTaskTypeLabel = (type: string) => {
    switch (type) {
      case 'twitter_follow':
        return 'Twitter Follow';
      case 'twitter_retweet':
        return 'Twitter Retweet';
      case 'twitter_like':
        return 'Twitter Like';
      case 'discord_join':
        return 'Discord Join';
      case 'telegram_join':
        return 'Telegram Join';
      case 'custom_url':
        return 'Custom URL';
      default:
        return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'paused':
        return 'warning';
      case 'completed':
        return 'primary';
      case 'expired':
        return 'danger';
      default:
        return 'default';
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (selectedTab === 'all') return true;
    return task.status === selectedTab;
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'twitter_follow',
      targetUrl: '',
      pointsReward: 10,
      maxCompletions: 100,
      requirements: {
        minFollowers: 0,
        accountAge: 0,
        verificationRequired: false
      }
    });
  };

  const handleCreateTask = async () => {
    try {
      // TODO: API call to create task
      console.log('Creating task:', formData);
      
      const newTask: SocialTask = {
        id: Date.now().toString(),
        ...formData,
        currentCompletions: 0,
        status: 'active',
        createdAt: new Date().toISOString()
      };
      
      setTasks(prev => [newTask, ...prev]);
      resetForm();
      onCreateModalClose();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleEditTask = (task: SocialTask) => {
    setSelectedTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      type: task.type,
      targetUrl: task.targetUrl,
      pointsReward: task.pointsReward,
      maxCompletions: task.maxCompletions,
      expiresAt: task.expiresAt?.split('T')[0],
      requirements: task.requirements || {
        minFollowers: 0,
        accountAge: 0,
        verificationRequired: false
      }
    });
    setIsEditing(true);
    onEditModalOpen();
  };

  const handleUpdateTask = async () => {
    if (!selectedTask) return;
    
    try {
      // TODO: API call to update task
      console.log('Updating task:', formData);
      
      setTasks(prev => prev.map(task =>
        task.id === selectedTask.id
          ? { ...task, ...formData }
          : task
      ));
      
      resetForm();
      setIsEditing(false);
      onEditModalClose();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async () => {
    if (!selectedTask) return;
    
    try {
      // TODO: API call to delete task
      console.log('Deleting task:', selectedTask.id);
      
      setTasks(prev => prev.filter(task => task.id !== selectedTask.id));
      onDeleteModalClose();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleToggleTaskStatus = async (task: SocialTask) => {
    try {
      const newStatus = task.status === 'active' ? 'paused' : 'active';
      
      setTasks(prev => prev.map(t =>
        t.id === task.id
          ? { ...t, status: newStatus }
          : t
      ));
    } catch (error) {
      console.error('Error toggling task status:', error);
    }
  };

  const renderTaskForm = () => (
    <div className="space-y-4">
      <Input
        label="Task Title"
        placeholder="Enter task title"
        value={formData.title}
        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
        required
      />

      <Textarea
        label="Description"
        placeholder="Describe what users need to do"
        value={formData.description}
        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
        minRows={2}
        maxRows={4}
      />

      <Select
        label="Task Type"
        selectedKeys={[formData.type]}
        onSelectionChange={(keys) => setFormData(prev => ({ ...prev, type: Array.from(keys)[0] as string }))}
      >
        <SelectItem key="twitter_follow">Twitter Follow</SelectItem>
        <SelectItem key="twitter_retweet">Twitter Retweet</SelectItem>
        <SelectItem key="twitter_like">Twitter Like</SelectItem>
        <SelectItem key="discord_join">Discord Join</SelectItem>
        <SelectItem key="telegram_join">Telegram Join</SelectItem>
        <SelectItem key="custom_url">Custom URL</SelectItem>
      </Select>

      <Input
        label="Target URL"
        placeholder="https://twitter.com/username or https://discord.gg/invite"
        value={formData.targetUrl}
        onChange={(e) => setFormData(prev => ({ ...prev, targetUrl: e.target.value }))}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          type="number"
          label="Points Reward"
          value={formData.pointsReward.toString()}
          onChange={(e) => setFormData(prev => ({ ...prev, pointsReward: parseInt(e.target.value) || 0 }))}
          min={1}
          required
        />

        <Input
          type="number"
          label="Max Completions"
          value={formData.maxCompletions.toString()}
          onChange={(e) => setFormData(prev => ({ ...prev, maxCompletions: parseInt(e.target.value) || 0 }))}
          min={1}
          required
        />
      </div>

      <Input
        type="date"
        label="Expiration Date (Optional)"
        value={formData.expiresAt || ''}
        onChange={(e) => setFormData(prev => ({ ...prev, expiresAt: e.target.value }))}
      />

      <Card>
        <CardHeader>
          <h4 className="text-sm font-semibold">Requirements (Optional)</h4>
        </CardHeader>
        <CardBody className="space-y-4">
          <Input
            type="number"
            label="Minimum Followers"
            value={formData.requirements.minFollowers.toString()}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              requirements: {
                ...prev.requirements,
                minFollowers: parseInt(e.target.value) || 0
              }
            }))}
            min={0}
          />

          <Input
            type="number"
            label="Account Age (days)"
            value={formData.requirements.accountAge.toString()}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              requirements: {
                ...prev.requirements,
                accountAge: parseInt(e.target.value) || 0
              }
            }))}
            min={0}
          />

          <Switch
            isSelected={formData.requirements.verificationRequired}
            onValueChange={(value) => setFormData(prev => ({
              ...prev,
              requirements: {
                ...prev.requirements,
                verificationRequired: value
              }
            }))}
          >
            Require Account Verification
          </Switch>
        </CardBody>
      </Card>
    </div>
  );

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Social Tasks</h2>
              <p className="text-gray-600">Create and manage social media engagement tasks</p>
            </div>
            
            <Button
              color="primary"
              startContent={<Plus className="w-4 h-4" />}
              onPress={onCreateModalOpen}
            >
              Create Task
            </Button>
          </div>
        </CardHeader>

        <CardBody>
          <Tabs
            selectedKey={selectedTab}
            onSelectionChange={(key) => setSelectedTab(key as string)}
            className="mb-6"
          >
            <Tab key="active" title="Active" />
            <Tab key="paused" title="Paused" />
            <Tab key="completed" title="Completed" />
            <Tab key="expired" title="Expired" />
            <Tab key="all" title="All" />
          </Tabs>

          <Table aria-label="Social tasks table">
            <TableHeader>
              <TableColumn>TASK</TableColumn>
              <TableColumn>TYPE</TableColumn>
              <TableColumn>PROGRESS</TableColumn>
              <TableColumn>REWARD</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody>
              {filteredTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900">{task.title}</p>
                      <p className="text-sm text-gray-500">{task.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip
                      startContent={getTaskIcon(task.type)}
                      variant="flat"
                      size="sm"
                    >
                      {getTaskTypeLabel(task.type)}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{task.currentCompletions}</span>
                        <span>{task.maxCompletions}</span>
                      </div>
                      <Progress
                        value={(task.currentCompletions / task.maxCompletions) * 100}
                        className="max-w-md"
                        size="sm"
                        color={task.status === 'completed' ? 'success' : 'primary'}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium">{task.pointsReward} points</p>
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={getStatusColor(task.status)}
                      variant="flat"
                      size="sm"
                    >
                      {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {task.status !== 'completed' && task.status !== 'expired' && (
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          onPress={() => handleToggleTaskStatus(task)}
                        >
                          {task.status === 'active' ? (
                            <Pause className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </Button>
                      )}
                      
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        onPress={() => handleEditTask(task)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="danger"
                        onPress={() => {
                          setSelectedTask(task);
                          onDeleteModalOpen();
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredTasks.length === 0 && (
            <div className="text-center py-12">
              <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
              <p className="text-gray-500 mb-4">
                {selectedTab === 'all' 
                  ? 'Create your first social task to engage your community'
                  : `No ${selectedTab} tasks at the moment`
                }
              </p>
              {selectedTab === 'all' && (
                <Button
                  color="primary"
                  startContent={<Plus className="w-4 h-4" />}
                  onPress={onCreateModalOpen}
                >
                  Create Task
                </Button>
              )}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Create Task Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={onCreateModalClose} size="2xl" scrollBehavior="inside">
        <ModalContent>
          <ModalHeader>
            <h3 className="text-xl font-semibold">Create Social Task</h3>
          </ModalHeader>
          <ModalBody>
            {renderTaskForm()}
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onCreateModalClose}>
              Cancel
            </Button>
            <Button color="primary" onPress={handleCreateTask}>
              Create Task
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Task Modal */}
      <Modal isOpen={isEditModalOpen} onClose={onEditModalClose} size="2xl" scrollBehavior="inside">
        <ModalContent>
          <ModalHeader>
            <h3 className="text-xl font-semibold">Edit Social Task</h3>
          </ModalHeader>
          <ModalBody>
            {renderTaskForm()}
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onEditModalClose}>
              Cancel
            </Button>
            <Button color="primary" onPress={handleUpdateTask}>
              Update Task
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Task Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={onDeleteModalClose}>
        <ModalContent>
          <ModalHeader>
            <h3 className="text-xl font-semibold">Delete Task</h3>
          </ModalHeader>
          <ModalBody>
            {selectedTask && (
              <p>
                Are you sure you want to delete the task <strong>"{selectedTask.title}"</strong>?
                This action cannot be undone.
              </p>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onDeleteModalClose}>
              Cancel
            </Button>
            <Button color="danger" onPress={handleDeleteTask}>
              Delete Task
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default SocialTaskManagement;