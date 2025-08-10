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
  Tab,
  Avatar
} from '@nextui-org/react';
import { 
  Plus, 
  Minus,
  Star, 
  TrendingUp, 
  Users, 
  Award,
  Settings,
  Upload,
  Download,
  History,
  Target,
  Gift,
  Coins,
  BarChart3
} from 'lucide-react';

interface PointsTransaction {
  id: string;
  userId: string;
  username: string;
  type: 'earned' | 'spent' | 'admin_credit' | 'admin_debit' | 'bonus' | 'refund';
  amount: number;
  description: string;
  source: string;
  timestamp: string;
  adminId?: string;
  adminUsername?: string;
}

interface PointsBalance {
  userId: string;
  username: string;
  walletAddress: string;
  balance: number;
  totalEarned: number;
  totalSpent: number;
  rank: number;
  lastActivity: string;
}

interface ActivityPointsConfig {
  [key: string]: number;
}

interface CommunityPointsStats {
  totalPointsIssued: number;
  totalPointsSpent: number;
  totalPointsInCirculation: number;
  activeMembers: number;
  topEarners: PointsBalance[];
  recentTransactions: PointsTransaction[];
}

interface CommunityPointsManagementProps {
  communityId: string;
  pointsName: string;
  pointsSymbol: string;
}

const CommunityPointsManagement: React.FC<CommunityPointsManagementProps> = ({
  communityId,
  pointsName,
  pointsSymbol
}) => {
  const [stats, setStats] = useState<CommunityPointsStats | null>(null);
  const [balances, setBalances] = useState<PointsBalance[]>([]);
  const [transactions, setTransactions] = useState<PointsTransaction[]>([]);
  const [activityConfig, setActivityConfig] = useState<ActivityPointsConfig>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  const { isOpen: isCreditModalOpen, onOpen: onCreditModalOpen, onClose: onCreditModalClose } = useDisclosure();
  const { isOpen: isDebitModalOpen, onOpen: onDebitModalOpen, onClose: onDebitModalClose } = useDisclosure();
  const { isOpen: isConfigModalOpen, onOpen: onConfigModalOpen, onClose: onConfigModalClose } = useDisclosure();
  const { isOpen: isBulkModalOpen, onOpen: onBulkModalOpen, onClose: onBulkModalClose } = useDisclosure();

  const [creditForm, setCreditForm] = useState({
    userId: '',
    amount: 0,
    description: ''
  });

  const [debitForm, setDebitForm] = useState({
    userId: '',
    amount: 0,
    description: ''
  });

  const [bulkCreditFile, setBulkCreditFile] = useState<File | null>(null);

  useEffect(() => {
    fetchPointsData();
  }, [communityId]);

  const fetchPointsData = async () => {
    try {
      setIsLoading(true);
      
      // TODO: Replace with actual API calls
      const mockStats: CommunityPointsStats = {
        totalPointsIssued: 125000,
        totalPointsSpent: 89500,
        totalPointsInCirculation: 35500,
        activeMembers: 892,
        topEarners: [
          {
            userId: '1',
            username: 'CryptoTrader123',
            walletAddress: '0x1234...5678',
            balance: 5420,
            totalEarned: 8900,
            totalSpent: 3480,
            rank: 1,
            lastActivity: '2024-01-20T10:30:00Z'
          },
          {
            userId: '2',
            username: 'BlockchainFan',
            walletAddress: '0x2345...6789',
            balance: 4850,
            totalEarned: 7200,
            totalSpent: 2350,
            rank: 2,
            lastActivity: '2024-01-20T09:15:00Z'
          },
          {
            userId: '3',
            username: 'NFTCollector',
            walletAddress: '0x3456...7890',
            balance: 4200,
            totalEarned: 6800,
            totalSpent: 2600,
            rank: 3,
            lastActivity: '2024-01-19T16:45:00Z'
          }
        ],
        recentTransactions: [
          {
            id: '1',
            userId: '1',
            username: 'CryptoTrader123',
            type: 'earned',
            amount: 25,
            description: 'Completed Twitter follow task',
            source: 'social_task',
            timestamp: '2024-01-20T10:30:00Z'
          },
          {
            id: '2',
            userId: '2',
            username: 'BlockchainFan',
            type: 'spent',
            amount: -150,
            description: 'Purchased community wallpaper pack',
            source: 'marketplace',
            timestamp: '2024-01-20T09:15:00Z'
          },
          {
            id: '3',
            userId: '3',
            username: 'NFTCollector',
            type: 'admin_credit',
            amount: 500,
            description: 'Welcome bonus for new member',
            source: 'admin',
            timestamp: '2024-01-19T16:45:00Z',
            adminId: 'admin1',
            adminUsername: 'CommunityAdmin'
          }
        ]
      };

      const mockActivityConfig: ActivityPointsConfig = {
        raffle_creation: 50,
        raffle_ticket_purchase: 1,
        gaming_blackjack: 5,
        gaming_coin_toss: 3,
        gaming_rock_paper_scissors: 3,
        gaming_crypto_slots: 8,
        community_task: 15,
        daily_login: 5,
        social_share: 10,
        referral_signup: 100
      };

      setStats(mockStats);
      setBalances(mockStats.topEarners);
      setTransactions(mockStats.recentTransactions);
      setActivityConfig(mockActivityConfig);
    } catch (error) {
      console.error('Error fetching points data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'earned':
        return <Plus className="w-4 h-4 text-green-600" />;
      case 'spent':
        return <Minus className="w-4 h-4 text-red-600" />;
      case 'admin_credit':
        return <Gift className="w-4 h-4 text-blue-600" />;
      case 'admin_debit':
        return <Minus className="w-4 h-4 text-orange-600" />;
      case 'bonus':
        return <Star className="w-4 h-4 text-yellow-600" />;
      case 'refund':
        return <Plus className="w-4 h-4 text-purple-600" />;
      default:
        return <Coins className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'earned':
      case 'refund':
        return 'success';
      case 'spent':
        return 'danger';
      case 'admin_credit':
        return 'primary';
      case 'admin_debit':
        return 'warning';
      case 'bonus':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const handleCreditPoints = async () => {
    try {
      // TODO: API call to credit points
      console.log('Crediting points:', creditForm);
      
      const newTransaction: PointsTransaction = {
        id: Date.now().toString(),
        ...creditForm,
        type: 'admin_credit',
        source: 'admin',
        timestamp: new Date().toISOString(),
        adminId: 'current_admin',
        adminUsername: 'Current Admin'
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      setCreditForm({ userId: '', amount: 0, description: '' });
      onCreditModalClose();
    } catch (error) {
      console.error('Error crediting points:', error);
    }
  };

  const handleDebitPoints = async () => {
    try {
      // TODO: API call to debit points
      console.log('Debiting points:', debitForm);
      
      const newTransaction: PointsTransaction = {
        id: Date.now().toString(),
        ...debitForm,
        type: 'admin_debit',
        amount: -debitForm.amount,
        source: 'admin',
        timestamp: new Date().toISOString(),
        adminId: 'current_admin',
        adminUsername: 'Current Admin'
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      setDebitForm({ userId: '', amount: 0, description: '' });
      onDebitModalClose();
    } catch (error) {
      console.error('Error debiting points:', error);
    }
  };

  const handleUpdateActivityConfig = async () => {
    try {
      // TODO: API call to update activity configuration
      console.log('Updating activity config:', activityConfig);
      onConfigModalClose();
    } catch (error) {
      console.error('Error updating activity config:', error);
    }
  };

  const handleBulkCredit = async () => {
    if (!bulkCreditFile) return;
    
    try {
      // TODO: Process CSV file and credit points in bulk
      console.log('Processing bulk credit file:', bulkCreditFile.name);
      
      // Mock processing
      const mockTransactions = [
        {
          id: Date.now().toString(),
          userId: 'bulk1',
          username: 'BulkUser1',
          type: 'admin_credit' as const,
          amount: 100,
          description: 'Bulk credit from CSV upload',
          source: 'admin',
          timestamp: new Date().toISOString(),
          adminId: 'current_admin',
          adminUsername: 'Current Admin'
        }
      ];
      
      setTransactions(prev => [...mockTransactions, ...prev]);
      setBulkCreditFile(null);
      onBulkModalClose();
    } catch (error) {
      console.error('Error processing bulk credit:', error);
    }
  };

  const filteredBalances = balances.filter(balance =>
    balance.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    balance.walletAddress.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Issued</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.totalPointsIssued.toLocaleString()}
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Coins className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {pointsSymbol} issued to members
            </p>
          </CardBody>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.totalPointsSpent.toLocaleString()}
                </p>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {pointsSymbol} spent by members
            </p>
          </CardBody>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Circulation</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.totalPointsInCirculation.toLocaleString()}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Star className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Available {pointsSymbol} balance
            </p>
          </CardBody>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Members</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.activeMembers.toLocaleString()}
                </p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Members with {pointsSymbol}
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Quick Actions</h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="bordered"
              startContent={<Plus className="w-4 h-4" />}
              onClick={onCreditModalOpen}
              className="h-auto py-4 flex-col"
            >
              <span className="mt-1">Credit Points</span>
            </Button>
            
            <Button
              variant="bordered"
              startContent={<Minus className="w-4 h-4" />}
              onClick={onDebitModalOpen}
              className="h-auto py-4 flex-col"
            >
              <span className="mt-1">Debit Points</span>
            </Button>
            
            <Button
              variant="bordered"
              startContent={<Upload className="w-4 h-4" />}
              onClick={onBulkModalOpen}
              className="h-auto py-4 flex-col"
            >
              <span className="mt-1">Bulk Credit</span>
            </Button>
            
            <Button
              variant="bordered"
              startContent={<Settings className="w-4 h-4" />}
              onClick={onConfigModalOpen}
              className="h-auto py-4 flex-col"
            >
              <span className="mt-1">Configure</span>
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Top Earners */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Top Earners</h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {stats?.topEarners.map((earner, index) => (
              <div key={earner.userId} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-center w-8 h-8 bg-yellow-100 rounded-full">
                  <span className="text-sm font-bold text-yellow-600">#{earner.rank}</span>
                </div>
                <Avatar name={earner.username} size="sm" />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{earner.username}</p>
                  <p className="text-xs text-gray-500">
                    {earner.walletAddress.slice(0, 6)}...{earner.walletAddress.slice(-4)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {earner.balance.toLocaleString()} {pointsSymbol}
                  </p>
                  <p className="text-xs text-gray-500">
                    Earned {earner.totalEarned.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Recent Transactions</h3>
        </CardHeader>
        <CardBody>
          <div className="space-y-3">
            {stats?.recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="p-2 rounded-full bg-gray-100">
                  {getTransactionIcon(transaction.type)}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{transaction.description}</p>
                  <p className="text-sm text-gray-500">
                    {transaction.username} • {new Date(transaction.timestamp).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <Chip
                    color={getTransactionColor(transaction.type)}
                    variant="flat"
                    size="sm"
                  >
                    {transaction.amount > 0 ? '+' : ''}{transaction.amount} {pointsSymbol}
                  </Chip>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );

  const renderBalances = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search members..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-xs"
          startContent={<Users className="w-4 h-4 text-gray-400" />}
        />
        <Button
          startContent={<Download className="w-4 h-4" />}
          variant="bordered"
        >
          Export CSV
        </Button>
      </div>

      <Table aria-label="Member balances table">
        <TableHeader>
          <TableColumn>MEMBER</TableColumn>
          <TableColumn>BALANCE</TableColumn>
          <TableColumn>TOTAL EARNED</TableColumn>
          <TableColumn>TOTAL SPENT</TableColumn>
          <TableColumn>RANK</TableColumn>
          <TableColumn>LAST ACTIVITY</TableColumn>
        </TableHeader>
        <TableBody>
          {filteredBalances.map((balance) => (
            <TableRow key={balance.userId}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar name={balance.username} size="sm" />
                  <div>
                    <p className="font-medium text-gray-900">{balance.username}</p>
                    <p className="text-xs text-gray-500">
                      {balance.walletAddress.slice(0, 6)}...{balance.walletAddress.slice(-4)}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <p className="font-semibold text-gray-900">
                  {balance.balance.toLocaleString()} {pointsSymbol}
                </p>
              </TableCell>
              <TableCell>
                <p className="text-green-600 font-medium">
                  +{balance.totalEarned.toLocaleString()}
                </p>
              </TableCell>
              <TableCell>
                <p className="text-red-600 font-medium">
                  -{balance.totalSpent.toLocaleString()}
                </p>
              </TableCell>
              <TableCell>
                <Chip color="warning" variant="flat" size="sm">
                  #{balance.rank}
                </Chip>
              </TableCell>
              <TableCell>
                <p className="text-sm text-gray-500">
                  {new Date(balance.lastActivity).toLocaleDateString()}
                </p>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  const renderTransactions = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">All Transactions</h3>
        <Button
          startContent={<Download className="w-4 h-4" />}
          variant="bordered"
        >
          Export CSV
        </Button>
      </div>

      <Table aria-label="Transactions table">
        <TableHeader>
          <TableColumn>TYPE</TableColumn>
          <TableColumn>MEMBER</TableColumn>
          <TableColumn>AMOUNT</TableColumn>
          <TableColumn>DESCRIPTION</TableColumn>
          <TableColumn>SOURCE</TableColumn>
          <TableColumn>DATE</TableColumn>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>
                <Chip
                  startContent={getTransactionIcon(transaction.type)}
                  color={getTransactionColor(transaction.type)}
                  variant="flat"
                  size="sm"
                >
                  {transaction.type.replace('_', ' ').charAt(0).toUpperCase() + transaction.type.slice(1).replace('_', ' ')}
                </Chip>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar name={transaction.username} size="sm" />
                  <span className="font-medium">{transaction.username}</span>
                </div>
              </TableCell>
              <TableCell>
                <span className={`font-semibold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {transaction.amount > 0 ? '+' : ''}{transaction.amount} {pointsSymbol}
                </span>
              </TableCell>
              <TableCell>
                <p className="text-sm">{transaction.description}</p>
              </TableCell>
              <TableCell>
                <p className="text-sm text-gray-500">{transaction.source}</p>
              </TableCell>
              <TableCell>
                <p className="text-sm text-gray-500">
                  {new Date(transaction.timestamp).toLocaleDateString()}
                </p>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
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
              <h2 className="text-2xl font-bold text-gray-900">{pointsName} Management</h2>
              <p className="text-gray-600">Manage community points, balances, and rewards</p>
            </div>
          </div>
        </CardHeader>

        <CardBody>
          <Tabs
            selectedKey={selectedTab}
            onSelectionChange={(key) => setSelectedTab(key as string)}
            className="mb-6"
          >
            <Tab key="overview" title="Overview">
              {renderOverview()}
            </Tab>
            <Tab key="balances" title="Member Balances">
              {renderBalances()}
            </Tab>
            <Tab key="transactions" title="Transactions">
              {renderTransactions()}
            </Tab>
          </Tabs>
        </CardBody>
      </Card>

      {/* Credit Points Modal */}
      <Modal isOpen={isCreditModalOpen} onClose={onCreditModalClose}>
        <ModalContent>
          <ModalHeader>
            <h3 className="text-xl font-semibold">Credit {pointsName}</h3>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Member Username or Wallet"
                placeholder="Enter username or wallet address"
                value={creditForm.userId}
                onChange={(e) => setCreditForm(prev => ({ ...prev, userId: e.target.value }))}
                required
              />
              
              <Input
                type="number"
                label={`Amount (${pointsSymbol})`}
                placeholder="Enter amount to credit"
                value={creditForm.amount.toString()}
                onChange={(e) => setCreditForm(prev => ({ ...prev, amount: parseInt(e.target.value) || 0 }))}
                min={1}
                required
              />
              
              <Textarea
                label="Description"
                placeholder="Reason for crediting points"
                value={creditForm.description}
                onChange={(e) => setCreditForm(prev => ({ ...prev, description: e.target.value }))}
                required
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onCreditModalClose}>
              Cancel
            </Button>
            <Button color="primary" onPress={handleCreditPoints}>
              Credit Points
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Debit Points Modal */}
      <Modal isOpen={isDebitModalOpen} onClose={onDebitModalClose}>
        <ModalContent>
          <ModalHeader>
            <h3 className="text-xl font-semibold">Debit {pointsName}</h3>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Member Username or Wallet"
                placeholder="Enter username or wallet address"
                value={debitForm.userId}
                onChange={(e) => setDebitForm(prev => ({ ...prev, userId: e.target.value }))}
                required
              />
              
              <Input
                type="number"
                label={`Amount (${pointsSymbol})`}
                placeholder="Enter amount to debit"
                value={debitForm.amount.toString()}
                onChange={(e) => setDebitForm(prev => ({ ...prev, amount: parseInt(e.target.value) || 0 }))}
                min={1}
                required
              />
              
              <Textarea
                label="Description"
                placeholder="Reason for debiting points"
                value={debitForm.description}
                onChange={(e) => setDebitForm(prev => ({ ...prev, description: e.target.value }))}
                required
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onDebitModalClose}>
              Cancel
            </Button>
            <Button color="danger" onPress={handleDebitPoints}>
              Debit Points
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Activity Configuration Modal */}
      <Modal isOpen={isConfigModalOpen} onClose={onConfigModalClose} size="2xl" scrollBehavior="inside">
        <ModalContent>
          <ModalHeader>
            <h3 className="text-xl font-semibold">Activity Points Configuration</h3>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <p className="text-gray-600">
                Configure how many {pointsSymbol} members earn for different activities.
              </p>
              
              {Object.entries(activityConfig).map(([activity, points]) => (
                <div key={activity} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">
                      {activity.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </p>
                    <p className="text-sm text-gray-500">
                      Points earned when members complete this activity
                    </p>
                  </div>
                  <Input
                    type="number"
                    value={points.toString()}
                    onChange={(e) => setActivityConfig(prev => ({
                      ...prev,
                      [activity]: parseInt(e.target.value) || 0
                    }))}
                    min={0}
                    className="w-24"
                    size="sm"
                  />
                </div>
              ))}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onConfigModalClose}>
              Cancel
            </Button>
            <Button color="primary" onPress={handleUpdateActivityConfig}>
              Save Configuration
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Bulk Credit Modal */}
      <Modal isOpen={isBulkModalOpen} onClose={onBulkModalClose}>
        <ModalContent>
          <ModalHeader>
            <h3 className="text-xl font-semibold">Bulk Credit {pointsName}</h3>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <p className="text-gray-600">
                Upload a CSV file to credit points to multiple members at once.
              </p>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900 mb-2">CSV Format:</p>
                <p className="text-xs text-gray-600 mb-2">
                  wallet_address,username,points,description
                </p>
                <p className="text-xs text-gray-500">
                  Example: 0x1234...5678,CryptoTrader,100,Welcome bonus
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload CSV File
                </label>
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => setBulkCreditFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onBulkModalClose}>
              Cancel
            </Button>
            <Button 
              color="primary" 
              onPress={handleBulkCredit}
              isDisabled={!bulkCreditFile}
            >
              Process Bulk Credit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CommunityPointsManagement;