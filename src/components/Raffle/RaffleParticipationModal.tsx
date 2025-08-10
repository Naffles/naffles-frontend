'use client';

import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Card,
  CardBody,
  Chip,
  Progress,
  Avatar,
  Divider,
  Spinner,
  Alert
} from '@nextui-org/react';
import { 
  ClockIcon, 
  TicketIcon, 
  UserIcon, 
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { colors, spacing, typography } from '@/styles/design-system/tokens';
import { formatDistanceToNow, isAfter } from 'date-fns';

interface RaffleParticipationModalProps {
  raffle: {
    _id: string;
    eventId: string;
    rafflePrize: {
      _id: string;
      tokenPrize?: {
        token: string;
        amount: string;
      };
      nftPrize?: {
        name: string;
        image: string;
        contractAddress: string;
      };
      nafflings?: number;
    };
    lotteryTypeEnum: 'TOKEN' | 'NFT' | 'NAFFLINGS';
    raffleTypeEnum: 'RESERVE' | 'UNLIMITED' | 'UNCONDITIONAL';
    coinType: string;
    perTicketPrice: number;
    ticketsAvailable: number;
    ticketsSold: number;
    raffleEndDate: string;
    createdBy: {
      _id: string;
      username: string;
    };
    status: {
      isActive: boolean;
      wonBy?: string;
    };
  };
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const RaffleParticipationModal: React.FC<RaffleParticipationModalProps> = ({
  raffle,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [userBalance, setUserBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const isExpired = isAfter(new Date(), new Date(raffle.raffleEndDate));
  const timeRemaining = isExpired ? 'Expired' : formatDistanceToNow(new Date(raffle.raffleEndDate), { addSuffix: true });
  
  const ticketsSold = raffle.ticketsSold || 0;
  const ticketsAvailable = raffle.ticketsAvailable || 0;
  const progressPercentage = ticketsAvailable > 0 ? (ticketsSold / ticketsAvailable) * 100 : 0;
  
  const totalCost = ticketQuantity * raffle.perTicketPrice;
  const canAfford = userBalance >= totalCost;
  const maxTickets = raffle.raffleTypeEnum === 'RESERVE' 
    ? Math.min(ticketsAvailable - ticketsSold, Math.floor(userBalance / raffle.perTicketPrice))
    : Math.floor(userBalance / raffle.perTicketPrice);

  // Fetch user balance
  useEffect(() => {
    if (isOpen) {
      fetchUserBalance();
    }
  }, [isOpen, raffle.coinType]);

  const fetchUserBalance = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/user/balance?token=${raffle.coinType}`);
      if (response.ok) {
        const data = await response.json();
        setUserBalance(data.balance || 0);
      }
    } catch (error) {
      console.error('Error fetching user balance:', error);
      setError('Failed to fetch balance');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchaseTickets = async () => {
    if (!canAfford) {
      setError('Insufficient balance');
      return;
    }

    if (ticketQuantity <= 0) {
      setError('Please select at least 1 ticket');
      return;
    }

    if (raffle.raffleTypeEnum === 'RESERVE' && ticketQuantity > (ticketsAvailable - ticketsSold)) {
      setError('Not enough tickets available');
      return;
    }

    try {
      setPurchasing(true);
      setError('');
      
      const response = await fetch(`/api/raffles/${raffle._id}/ticket-purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quantity: ticketQuantity,
          eventId: raffle.eventId
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(`Successfully purchased ${ticketQuantity} ticket${ticketQuantity > 1 ? 's' : ''}!`);
        setTimeout(() => {
          onSuccess();
        }, 2000);
      } else {
        setError(data.message || 'Failed to purchase tickets');
      }
    } catch (error) {
      console.error('Error purchasing tickets:', error);
      setError('Failed to purchase tickets');
    } finally {
      setPurchasing(false);
    }
  };

  const getPrizeDisplay = () => {
    const { rafflePrize } = raffle;
    
    if (rafflePrize.tokenPrize) {
      return {
        title: `${rafflePrize.tokenPrize.amount} ${rafflePrize.tokenPrize.token.toUpperCase()}`,
        subtitle: 'Token Prize',
        image: `/tokens/${rafflePrize.tokenPrize.token.toLowerCase()}.png`,
      };
    }
    
    if (rafflePrize.nftPrize) {
      return {
        title: rafflePrize.nftPrize.name,
        subtitle: 'NFT Prize',
        image: rafflePrize.nftPrize.image,
      };
    }
    
    if (rafflePrize.nafflings) {
      return {
        title: `${rafflePrize.nafflings.toLocaleString()} Nafflings`,
        subtitle: 'Points Prize',
        image: '/images/nafflings-icon.png',
      };
    }
    
    return {
      title: 'Unknown Prize',
      subtitle: 'Prize',
      image: '/images/default-prize.png',
    };
  };

  const prizeDisplay = getPrizeDisplay();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      scrollBehavior="inside"
      classNames={{
        base: "max-h-[90vh]",
        body: "py-6",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 
            className="text-2xl font-bold"
            style={{ 
              color: colors.gray[900],
              fontFamily: typography.fontFamily.display.join(', ')
            }}
          >
            Enter Raffle
          </h2>
          <p className="text-sm font-normal" style={{ color: colors.gray[600] }}>
            Purchase tickets for this raffle
          </p>
        </ModalHeader>

        <ModalBody>
          {loading ? (
            <div className="flex justify-center py-8">
              <Spinner size="lg" color="primary" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Prize Information */}
              <Card>
                <CardBody className="p-4">
                  <div className="flex gap-4">
                    <img
                      src={prizeDisplay.image}
                      alt={prizeDisplay.title}
                      className="w-20 h-20 rounded-lg object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/default-prize.png';
                      }}
                    />
                    <div className="flex-1">
                      <h3 
                        className="text-lg font-semibold mb-1"
                        style={{ color: colors.gray[900] }}
                      >
                        {prizeDisplay.title}
                      </h3>
                      <p 
                        className="text-sm mb-2"
                        style={{ color: colors.gray[600] }}
                      >
                        {prizeDisplay.subtitle}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <UserIcon className="w-4 h-4" style={{ color: colors.gray[500] }} />
                          <span style={{ color: colors.gray[600] }}>
                            by {raffle.createdBy.username}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ClockIcon className="w-4 h-4" style={{ color: colors.gray[500] }} />
                          <span 
                            className={isExpired ? 'text-red-600' : ''}
                            style={{ color: isExpired ? colors.error[600] : colors.gray[600] }}
                          >
                            {timeRemaining}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Raffle Statistics */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardBody className="p-4 text-center">
                    <div className="text-2xl font-bold mb-1" style={{ color: colors.primary[600] }}>
                      {raffle.perTicketPrice}
                    </div>
                    <div className="text-sm" style={{ color: colors.gray[600] }}>
                      {raffle.coinType.toUpperCase()} per ticket
                    </div>
                  </CardBody>
                </Card>

                <Card>
                  <CardBody className="p-4 text-center">
                    <div className="text-2xl font-bold mb-1" style={{ color: colors.success[600] }}>
                      {ticketsSold.toLocaleString()}
                    </div>
                    <div className="text-sm" style={{ color: colors.gray[600] }}>
                      Tickets sold
                    </div>
                  </CardBody>
                </Card>
              </div>

              {/* Progress Bar (for RESERVE raffles) */}
              {raffle.raffleTypeEnum === 'RESERVE' && (
                <Card>
                  <CardBody className="p-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span style={{ color: colors.gray[600] }}>
                        Progress: {ticketsSold} / {ticketsAvailable} sold
                      </span>
                      <span style={{ color: colors.gray[600] }}>
                        {Math.round(progressPercentage)}%
                      </span>
                    </div>
                    <Progress
                      value={progressPercentage}
                      color="primary"
                      size="md"
                      className="w-full"
                    />
                  </CardBody>
                </Card>
              )}

              <Divider />

              {/* Ticket Purchase Section */}
              <div className="space-y-4">
                <h3 
                  className="text-lg font-semibold"
                  style={{ color: colors.gray[900] }}
                >
                  Purchase Tickets
                </h3>

                {/* Balance Display */}
                <Card className="bg-gray-50">
                  <CardBody className="p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm" style={{ color: colors.gray[600] }}>
                        Your Balance:
                      </span>
                      <span 
                        className="text-lg font-semibold"
                        style={{ color: colors.primary[600] }}
                      >
                        {userBalance.toLocaleString()} {raffle.coinType.toUpperCase()}
                      </span>
                    </div>
                  </CardBody>
                </Card>

                {/* Quantity Input */}
                <div className="space-y-2">
                  <label 
                    className="text-sm font-medium"
                    style={{ color: colors.gray[700] }}
                  >
                    Number of Tickets
                  </label>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="bordered"
                      onPress={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                      isDisabled={ticketQuantity <= 1}
                    >
                      -
                    </Button>
                    <Input
                      type="number"
                      value={ticketQuantity.toString()}
                      onChange={(e) => {
                        const value = Math.max(1, parseInt(e.target.value) || 1);
                        setTicketQuantity(Math.min(value, maxTickets));
                      }}
                      min={1}
                      max={maxTickets}
                      className="flex-1"
                      classNames={{
                        input: "text-center"
                      }}
                    />
                    <Button
                      size="sm"
                      variant="bordered"
                      onPress={() => setTicketQuantity(Math.min(maxTickets, ticketQuantity + 1))}
                      isDisabled={ticketQuantity >= maxTickets}
                    >
                      +
                    </Button>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: colors.gray[600] }}>
                      Max affordable: {maxTickets}
                    </span>
                    {raffle.raffleTypeEnum === 'RESERVE' && (
                      <span style={{ color: colors.gray[600] }}>
                        Available: {ticketsAvailable - ticketsSold}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quick Select Buttons */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="bordered"
                    onPress={() => setTicketQuantity(1)}
                    className={ticketQuantity === 1 ? 'border-primary-500' : ''}
                  >
                    1
                  </Button>
                  {maxTickets >= 5 && (
                    <Button
                      size="sm"
                      variant="bordered"
                      onPress={() => setTicketQuantity(5)}
                      className={ticketQuantity === 5 ? 'border-primary-500' : ''}
                    >
                      5
                    </Button>
                  )}
                  {maxTickets >= 10 && (
                    <Button
                      size="sm"
                      variant="bordered"
                      onPress={() => setTicketQuantity(10)}
                      className={ticketQuantity === 10 ? 'border-primary-500' : ''}
                    >
                      10
                    </Button>
                  )}
                  {maxTickets > 10 && (
                    <Button
                      size="sm"
                      variant="bordered"
                      onPress={() => setTicketQuantity(maxTickets)}
                      className={ticketQuantity === maxTickets ? 'border-primary-500' : ''}
                    >
                      Max
                    </Button>
                  )}
                </div>

                {/* Total Cost */}
                <Card className="bg-primary-50 border border-primary-200">
                  <CardBody className="p-4">
                    <div className="flex justify-between items-center">
                      <span 
                        className="text-lg font-medium"
                        style={{ color: colors.primary[700] }}
                      >
                        Total Cost:
                      </span>
                      <span 
                        className="text-xl font-bold"
                        style={{ color: colors.primary[700] }}
                      >
                        {totalCost.toLocaleString()} {raffle.coinType.toUpperCase()}
                      </span>
                    </div>
                  </CardBody>
                </Card>

                {/* Error/Success Messages */}
                {error && (
                  <Alert
                    color="danger"
                    variant="flat"
                    startContent={<ExclamationTriangleIcon className="w-5 h-5" />}
                  >
                    {error}
                  </Alert>
                )}

                {success && (
                  <Alert
                    color="success"
                    variant="flat"
                    startContent={<CheckCircleIcon className="w-5 h-5" />}
                  >
                    {success}
                  </Alert>
                )}
              </div>
            </div>
          )}
        </ModalBody>

        <ModalFooter>
          <Button
            variant="light"
            onPress={onClose}
            isDisabled={purchasing}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={handlePurchaseTickets}
            isLoading={purchasing}
            isDisabled={!canAfford || isExpired || !raffle.status.isActive || loading}
            startContent={!purchasing ? <TicketIcon className="w-5 h-5" /> : null}
          >
            {purchasing ? 'Purchasing...' : `Purchase ${ticketQuantity} Ticket${ticketQuantity > 1 ? 's' : ''}`}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default RaffleParticipationModal;