'use client';

import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Card,
  CardBody,
  Avatar,
  Chip,
  Divider,
  Alert,
  Spinner
} from '@nextui-org/react';
import { colors, typography } from '@/styles/design-system/tokens';
import { 
  TrophyIcon,
  SparklesIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  GiftIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';
import Confetti from 'react-confetti';

interface WinnerAnnouncementProps {
  raffle: {
    _id: string;
    eventId: string;
    rafflePrize: any;
    lotteryTypeEnum: string;
    raffleTypeEnum: string;
    coinType: string;
    perTicketPrice: number;
    ticketsSold: number;
    createdBy: {
      _id: string;
      username: string;
    };
    status: {
      isActive: boolean;
      wonBy?: string;
    };
    winner?: {
      _id: string;
      username: string;
      winningTicketId: string;
      claimedAt?: string;
    };
    raffleEndDate: string;
  };
  isOpen: boolean;
  onClose: () => void;
  currentUserId?: string;
}

const WinnerAnnouncement: React.FC<WinnerAnnouncementProps> = ({
  raffle,
  isOpen,
  onClose,
  currentUserId
}) => {
  const [claiming, setClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [error, setError] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  const isWinner = currentUserId && raffle.winner && currentUserId === raffle.winner._id;
  const isPrizeClaimed = raffle.winner?.claimedAt;

  useEffect(() => {
    if (isOpen && isWinner) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isWinner]);

  const getPrizeDisplay = () => {
    const { rafflePrize, lotteryTypeEnum } = raffle;
    
    if (lotteryTypeEnum === 'TOKEN' && rafflePrize.tokenPrize) {
      return {
        title: `${rafflePrize.tokenPrize.amount} ${rafflePrize.tokenPrize.token.toUpperCase()}`,
        subtitle: 'Token Prize',
        image: `/tokens/${rafflePrize.tokenPrize.token.toLowerCase()}.png`,
        value: `${rafflePrize.tokenPrize.amount} ${rafflePrize.tokenPrize.token.toUpperCase()}`
      };
    } else if (lotteryTypeEnum === 'NFT' && rafflePrize.nftPrize) {
      return {
        title: rafflePrize.nftPrize.name,
        subtitle: 'NFT Prize',
        image: rafflePrize.nftPrize.image,
        value: rafflePrize.nftPrize.name
      };
    } else if (lotteryTypeEnum === 'NAFFLINGS' && rafflePrize.nafflings) {
      return {
        title: `${rafflePrize.nafflings.toLocaleString()} Nafflings`,
        subtitle: 'Points Prize',
        image: '/images/nafflings-icon.png',
        value: `${rafflePrize.nafflings.toLocaleString()} Nafflings`
      };
    }
    
    return {
      title: 'Unknown Prize',
      subtitle: 'Prize',
      image: '/images/default-prize.png',
      value: 'Unknown'
    };
  };

  const handleClaimPrize = async () => {
    if (!isWinner || isPrizeClaimed) return;

    setClaiming(true);
    setError('');

    try {
      const response = await fetch(`/api/raffles/${raffle._id}/claim`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok) {
        setClaimed(true);
        // Update the raffle data to reflect the claim
        setTimeout(() => {
          onClose();
        }, 3000);
      } else {
        setError(result.message || 'Failed to claim prize');
      }
    } catch (error) {
      console.error('Error claiming prize:', error);
      setError('Failed to claim prize. Please try again.');
    } finally {
      setClaiming(false);
    }
  };

  const prizeDisplay = getPrizeDisplay();

  return (
    <>
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
        />
      )}
      
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="2xl"
        classNames={{
          base: "max-h-[90vh]",
          body: "py-6",
        }}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <TrophyIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h2 
                  className="text-2xl font-bold"
                  style={{ 
                    color: colors.gray[900],
                    fontFamily: typography.fontFamily.display.join(', ')
                  }}
                >
                  🎉 Raffle Complete!
                </h2>
                <p className="text-sm font-normal" style={{ color: colors.gray[600] }}>
                  {isWinner ? 'Congratulations! You won!' : 'Winner has been selected'}
                </p>
              </div>
            </div>
          </ModalHeader>

          <ModalBody>
            <div className="space-y-6">
              {/* Winner Card */}
              <Card className={`${isWinner ? 'bg-success-50 border-success-200' : 'bg-gray-50'} border`}>
                <CardBody className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar
                      size="lg"
                      name={raffle.winner?.username}
                      className="w-16 h-16"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-bold" style={{ color: colors.gray[900] }}>
                          {raffle.winner?.username}
                        </h3>
                        {isWinner && (
                          <Chip size="sm" color="success" variant="solid">
                            That's You!
                          </Chip>
                        )}
                      </div>
                      <p className="text-sm" style={{ color: colors.gray[600] }}>
                        Winning Ticket: #{raffle.winner?.winningTicketId}
                      </p>
                    </div>
                    <div className="text-right">
                      <SparklesIcon className="w-8 h-8 text-yellow-500 mb-1" />
                      <div className="text-sm font-medium" style={{ color: colors.gray[700] }}>
                        Winner
                      </div>
                    </div>
                  </div>

                  {isWinner && (
                    <Alert
                      color="success"
                      variant="flat"
                      startContent={<CheckCircleIcon className="w-5 h-5" />}
                    >
                      Congratulations! You are the winner of this raffle!
                    </Alert>
                  )}
                </CardBody>
              </Card>

              {/* Prize Information */}
              <Card>
                <CardBody className="p-6">
                  <h4 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: colors.gray[900] }}>
                    <GiftIcon className="w-5 h-5" />
                    Prize Details
                  </h4>
                  
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
                      <h5 className="text-lg font-semibold mb-1" style={{ color: colors.gray[900] }}>
                        {prizeDisplay.title}
                      </h5>
                      <p className="text-sm mb-2" style={{ color: colors.gray[600] }}>
                        {prizeDisplay.subtitle}
                      </p>
                      <div className="flex gap-2">
                        <Chip size="sm" color="primary" variant="flat">
                          {raffle.lotteryTypeEnum}
                        </Chip>
                        <Chip size="sm" color="secondary" variant="flat">
                          {raffle.raffleTypeEnum}
                        </Chip>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Raffle Statistics */}
              <Card>
                <CardBody className="p-6">
                  <h4 className="text-lg font-semibold mb-4" style={{ color: colors.gray[900] }}>
                    Raffle Statistics
                  </h4>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold mb-1" style={{ color: colors.primary[600] }}>
                        {raffle.ticketsSold.toLocaleString()}
                      </div>
                      <div className="text-sm" style={{ color: colors.gray[600] }}>
                        Tickets Sold
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-2xl font-bold mb-1" style={{ color: colors.secondary[600] }}>
                        {raffle.perTicketPrice}
                      </div>
                      <div className="text-sm" style={{ color: colors.gray[600] }}>
                        Price per Ticket
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-2xl font-bold mb-1" style={{ color: colors.success[600] }}>
                        {(raffle.ticketsSold * raffle.perTicketPrice).toLocaleString()}
                      </div>
                      <div className="text-sm" style={{ color: colors.gray[600] }}>
                        Total Revenue
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-2xl font-bold mb-1" style={{ color: colors.warning[600] }}>
                        {Math.round((1 / raffle.ticketsSold) * 100 * 100) / 100}%
                      </div>
                      <div className="text-sm" style={{ color: colors.gray[600] }}>
                        Winning Odds
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Creator Information */}
              <Card>
                <CardBody className="p-4">
                  <div className="flex items-center gap-3">
                    <UserIcon className="w-5 h-5" style={{ color: colors.gray[500] }} />
                    <div>
                      <span className="text-sm" style={{ color: colors.gray[600] }}>
                        Created by:
                      </span>
                      <div className="flex items-center gap-2">
                        <Avatar
                          size="sm"
                          name={raffle.createdBy.username}
                          className="w-6 h-6"
                        />
                        <span className="font-medium" style={{ color: colors.gray[900] }}>
                          {raffle.createdBy.username}
                        </span>
                      </div>
                    </div>
                    <div className="ml-auto text-right">
                      <div className="text-sm" style={{ color: colors.gray[600] }}>
                        Ended {formatDistanceToNow(new Date(raffle.raffleEndDate), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Claim Status */}
              {isWinner && (
                <Card className={isPrizeClaimed ? 'bg-success-50 border-success-200' : 'bg-warning-50 border-warning-200'}>
                  <CardBody className="p-6">
                    <div className="flex items-center gap-3">
                      {isPrizeClaimed ? (
                        <>
                          <CheckCircleIcon className="w-6 h-6 text-success-600" />
                          <div>
                            <h4 className="font-semibold text-success-700">Prize Claimed!</h4>
                            <p className="text-sm text-success-600">
                              You claimed your prize {formatDistanceToNow(new Date(raffle.winner.claimedAt!), { addSuffix: true })}
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <ExclamationTriangleIcon className="w-6 h-6 text-warning-600" />
                          <div>
                            <h4 className="font-semibold text-warning-700">Prize Ready to Claim</h4>
                            <p className="text-sm text-warning-600">
                              Click the button below to claim your prize
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </CardBody>
                </Card>
              )}

              {/* Error Message */}
              {error && (
                <Alert
                  color="danger"
                  variant="flat"
                  startContent={<ExclamationTriangleIcon className="w-5 h-5" />}
                >
                  {error}
                </Alert>
              )}

              {/* Success Message */}
              {claimed && (
                <Alert
                  color="success"
                  variant="flat"
                  startContent={<CheckCircleIcon className="w-5 h-5" />}
                >
                  Prize claimed successfully! Your {prizeDisplay.value} has been transferred to your account.
                </Alert>
              )}
            </div>
          </ModalBody>

          <ModalFooter>
            <Button
              variant="light"
              onPress={onClose}
              isDisabled={claiming}
            >
              Close
            </Button>
            
            {isWinner && !isPrizeClaimed && !claimed && (
              <Button
                color="success"
                onPress={handleClaimPrize}
                isLoading={claiming}
                startContent={claiming ? <Spinner size="sm" /> : <GiftIcon className="w-5 h-5" />}
                size="lg"
                className="font-semibold"
              >
                {claiming ? 'Claiming Prize...' : 'Claim Prize'}
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default WinnerAnnouncement;