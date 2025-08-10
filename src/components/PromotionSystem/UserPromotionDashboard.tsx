import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Progress,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Alert,
  Divider
} from '@nextui-org/react';
import {
  GiftIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface UserPromotion {
  _id: string;
  promotionId: {
    _id: string;
    name: string;
    type: 'fee_discount' | 'deposit_bonus' | 'free_tokens';
    description: string;
  };
  usageCount: number;
  totalSavings: number;
  totalBonusReceived: number;
  expiresAt?: string;
  status: string;
}

interface BonusCreditsBalance {
  totalBalance: number;
  hasCredits: boolean;
  balances: Array<{
    tokenSymbol: string;
    blockchain: string;
    balance: number;
    totalAwarded: number;
    totalUsed: number;
  }>;
  expiringCredits: Array<{
    tokenSymbol: string;
    blockchain: string;
    totalAmount: number;
    earliestExpiry: string;
  }>;
}

interface PromotionNotification {
  type: string;
  priority: 'low' | 'medium' | 'high';
  title: string;
  message: string;
  actionRequired: boolean;
  data?: any;
}

const UserPromotionDashboard: React.FC = () => {
  const [activePromotions, setActivePromotions] = useState<UserPromotion[]>([]);
  const [bonusCredits, setBonusCredits] = useState<BonusCreditsBalance | null>(null);
  const [notifications, setNotifications] = useState<PromotionNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPromotion, setSelectedPromotion] = useState<UserPromotion | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    fetchUserPromotionData();
  }, []);

  const fetchUserPromotionData = async () => {
    try {
      setLoading(true);
      
      // Fetch user's active promotions
      const promotionsResponse = await fetch('/api/user/promotions', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        }
      });
      
      if (promotionsResponse.ok) {
        const promotionsData = await promotionsResponse.json();
        setActivePromotions(promotionsData.data || []);
      }
      
      // Fetch bonus credits balance
      const bonusResponse = await fetch('/api/user/bonus-credits', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        }
      });
      
      if (bonusResponse.ok) {
        const bonusData = await bonusResponse.json();
        setBonusCredits(bonusData.data);
      }
      
      // Fetch promotion notifications
      const notificationsResponse = await fetch('/api/user/promotion-notifications', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        }
      });
      
      if (notificationsResponse.ok) {
        const notificationsData = await notificationsResponse.json();
        setNotifications(notificationsData.data.notifications || []);
      }
    } catch (error) {
      console.error('Error fetching user promotion data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPromotionTypeLabel = (type: string) => {
    switch (type) {
      case 'fee_discount': return 'Fee Discount';
      case 'deposit_bonus': return 'Deposit Bonus';
      case 'free_tokens': return 'Free Tokens';
      default: return type;
    }
  };

  const getPromotionTypeColor = (type: string) => {
    switch (type) {
      case 'fee_discount': return 'primary';
      case 'deposit_bonus': return 'success';
      case 'free_tokens': return 'secondary';
      default: return 'default';
    }
  };

  const getNotificationColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'primary';
      default: return 'default';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Promotions</h1>
        <p className="text-gray-600">Manage your active promotions and bonus credits</p>
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="space-y-3">
          {notifications.map((notification, index) => (
            <Alert
              key={index}
              color={getNotificationColor(notification.priority)}
              variant="flat"
              title={notification.title}
              description={notification.message}
              startContent={
                notification.priority === 'high' ? (
                  <ExclamationTriangleIcon className="w-5 h-5" />
                ) : notification.priority === 'medium' ? (
                  <ClockIcon className="w-5 h-5" />
                ) : (
                  <GiftIcon className="w-5 h-5" />
                )
              }
            />
          ))}
        </div>
      )}

      {/* Bonus Credits Overview */}
      {bonusCredits && bonusCredits.hasCredits && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CurrencyDollarIcon className="w-5 h-5 text-green-600" />
              <h2 className="text-lg font-semibold">Bonus Credits</h2>
            </div>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {bonusCredits.totalBalance.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">Total Balance</p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">By Token:</p>
                {bonusCredits.balances.map((balance, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{balance.tokenSymbol} ({balance.blockchain})</span>
                    <span className="font-medium">{balance.balance.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Usage Stats:</p>
                {bonusCredits.balances.map((balance, index) => (
                  <div key={index} className="text-sm">
                    <div className="flex justify-between">
                      <span>Awarded:</span>
                      <span>{balance.totalAwarded.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Used:</span>
                      <span>{balance.totalUsed.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {bonusCredits.expiringCredits.length > 0 && (
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm font-medium text-yellow-800 mb-2">
                  Credits Expiring Soon:
                </p>
                {bonusCredits.expiringCredits.map((expiring, index) => (
                  <div key={index} className="text-sm text-yellow-700">
                    {expiring.totalAmount.toFixed(2)} {expiring.tokenSymbol} expires on{' '}
                    {formatDate(expiring.earliestExpiry)}
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      )}

      {/* Active Promotions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <GiftIcon className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold">Active Promotions</h2>
            </div>
            <Chip size="sm" variant="flat">
              {activePromotions.length} Active
            </Chip>
          </div>
        </CardHeader>
        <CardBody>
          {activePromotions.length === 0 ? (
            <div className="text-center py-8">
              <GiftIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No active promotions</p>
              <p className="text-sm text-gray-400">
                Check back later for new promotional offers
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {activePromotions.map((promotion) => (
                <div
                  key={promotion._id}
                  className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => {
                    setSelectedPromotion(promotion);
                    onOpen();
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {promotion.promotionId.name}
                        </h3>
                        <Chip
                          size="sm"
                          color={getPromotionTypeColor(promotion.promotionId.type)}
                          variant="flat"
                        >
                          {getPromotionTypeLabel(promotion.promotionId.type)}
                        </Chip>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">
                        {promotion.promotionId.description}
                      </p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Times Used</p>
                          <p className="font-medium">{promotion.usageCount}</p>
                        </div>
                        
                        {promotion.totalSavings > 0 && (
                          <div>
                            <p className="text-gray-500">Total Savings</p>
                            <p className="font-medium text-green-600">
                              {formatCurrency(promotion.totalSavings)}
                            </p>
                          </div>
                        )}
                        
                        {promotion.totalBonusReceived > 0 && (
                          <div>
                            <p className="text-gray-500">Bonus Received</p>
                            <p className="font-medium text-blue-600">
                              {formatCurrency(promotion.totalBonusReceived)}
                            </p>
                          </div>
                        )}
                        
                        {promotion.expiresAt && (
                          <div>
                            <p className="text-gray-500">Expires</p>
                            <p className={`font-medium ${
                              getDaysUntilExpiry(promotion.expiresAt) <= 7 
                                ? 'text-red-600' 
                                : 'text-gray-900'
                            }`}>
                              {getDaysUntilExpiry(promotion.expiresAt) > 0
                                ? `${getDaysUntilExpiry(promotion.expiresAt)} days`
                                : 'Expired'
                              }
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="ml-4">
                      <CheckCircleIcon className="w-5 h-5 text-green-500" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Promotion Details Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalContent>
          {selectedPromotion && (
            <>
              <ModalHeader>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold">
                    {selectedPromotion.promotionId.name}
                  </h2>
                  <Chip
                    size="sm"
                    color={getPromotionTypeColor(selectedPromotion.promotionId.type)}
                    variant="flat"
                  >
                    {getPromotionTypeLabel(selectedPromotion.promotionId.type)}
                  </Chip>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <p className="text-gray-600">
                    {selectedPromotion.promotionId.description}
                  </p>
                  
                  <Divider />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">
                        {selectedPromotion.usageCount}
                      </p>
                      <p className="text-sm text-gray-600">Times Used</p>
                    </div>
                    
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">
                        {formatCurrency(selectedPromotion.totalSavings + selectedPromotion.totalBonusReceived)}
                      </p>
                      <p className="text-sm text-gray-600">Total Value</p>
                    </div>
                  </div>
                  
                  {selectedPromotion.expiresAt && (
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <ClockIcon className="w-5 h-5 text-yellow-600" />
                        <p className="font-medium text-yellow-800">
                          Expires in {getDaysUntilExpiry(selectedPromotion.expiresAt)} days
                        </p>
                      </div>
                      <p className="text-sm text-yellow-700 mt-1">
                        Make sure to use this promotion before {formatDate(selectedPromotion.expiresAt)}
                      </p>
                    </div>
                  )}
                  
                  <div className="text-sm text-gray-500">
                    <p>Promotion ID: {selectedPromotion.promotionId._id}</p>
                    <p>Status: {selectedPromotion.status}</p>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default UserPromotionDashboard;