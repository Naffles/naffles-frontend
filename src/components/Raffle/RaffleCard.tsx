'use client';

import React, { useState } from 'react';
import { Card, CardBody, CardFooter, Button, Chip, Progress, Avatar, Tooltip } from '@nextui-org/react';
import { ClockIcon, UserIcon, TicketIcon, TrophyIcon } from '@heroicons/react/24/outline';
import { colors, spacing, typography, shadows } from '@/styles/design-system/tokens';
import { formatDistanceToNow, isAfter } from 'date-fns';
import RaffleParticipationModal from './RaffleParticipationModal';

interface RaffleCardProps {
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
  onRaffleUpdate?: () => void;
}

const RaffleCard: React.FC<RaffleCardProps> = ({ raffle, onRaffleUpdate }) => {
  const [showParticipationModal, setShowParticipationModal] = useState(false);

  const isExpired = isAfter(new Date(), new Date(raffle.raffleEndDate));
  const timeRemaining = isExpired ? 'Expired' : formatDistanceToNow(new Date(raffle.raffleEndDate), { addSuffix: true });
  
  const ticketsSold = raffle.ticketsSold || 0;
  const ticketsAvailable = raffle.ticketsAvailable || 0;
  const progressPercentage = ticketsAvailable > 0 ? (ticketsSold / ticketsAvailable) * 100 : 0;

  const getPrizeDisplay = () => {
    const { rafflePrize } = raffle;
    
    if (rafflePrize.tokenPrize) {
      return {
        title: `${rafflePrize.tokenPrize.amount} ${rafflePrize.tokenPrize.token.toUpperCase()}`,
        subtitle: 'Token Prize',
        image: `/tokens/${rafflePrize.tokenPrize.token.toLowerCase()}.png`,
        type: 'token'
      };
    }
    
    if (rafflePrize.nftPrize) {
      return {
        title: rafflePrize.nftPrize.name,
        subtitle: 'NFT Prize',
        image: rafflePrize.nftPrize.image,
        type: 'nft'
      };
    }
    
    if (rafflePrize.nafflings) {
      return {
        title: `${rafflePrize.nafflings.toLocaleString()} Nafflings`,
        subtitle: 'Points Prize',
        image: '/images/nafflings-icon.png',
        type: 'nafflings'
      };
    }
    
    return {
      title: 'Unknown Prize',
      subtitle: 'Prize',
      image: '/images/default-prize.png',
      type: 'unknown'
    };
  };

  const getRaffleTypeColor = (type: string) => {
    switch (type) {
      case 'RESERVE':
        return 'warning';
      case 'UNLIMITED':
        return 'success';
      case 'UNCONDITIONAL':
        return 'primary';
      default:
        return 'default';
    }
  };

  const getLotteryTypeColor = (type: string) => {
    switch (type) {
      case 'TOKEN':
        return 'secondary';
      case 'NFT':
        return 'primary';
      case 'NAFFLINGS':
        return 'success';
      default:
        return 'default';
    }
  };

  const prizeDisplay = getPrizeDisplay();

  return (
    <>
      <Card 
        className="w-full hover:scale-105 transition-transform duration-200 cursor-pointer"
        isPressable
        onPress={() => setShowParticipationModal(true)}
        style={{ boxShadow: shadows.md }}
      >
        <CardBody className="p-0">
          {/* Prize Image */}
          <div className="relative h-48 w-full overflow-hidden">
            <img
              src={prizeDisplay.image}
              alt={prizeDisplay.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/default-prize.png';
              }}
            />
            
            {/* Status Overlay */}
            <div className="absolute top-3 left-3 flex gap-2">
              <Chip
                size="sm"
                color={getLotteryTypeColor(raffle.lotteryTypeEnum)}
                variant="solid"
                className="text-white font-medium"
              >
                {raffle.lotteryTypeEnum}
              </Chip>
              <Chip
                size="sm"
                color={getRaffleTypeColor(raffle.raffleTypeEnum)}
                variant="solid"
                className="text-white font-medium"
              >
                {raffle.raffleTypeEnum}
              </Chip>
            </div>

            {/* Winner Badge */}
            {!raffle.status.isActive && raffle.status.wonBy && (
              <div className="absolute top-3 right-3">
                <Chip
                  size="sm"
                  color="success"
                  variant="solid"
                  startContent={<TrophyIcon className="w-3 h-3" />}
                  className="text-white font-medium"
                >
                  Won
                </Chip>
              </div>
            )}

            {/* Expired Badge */}
            {isExpired && raffle.status.isActive && (
              <div className="absolute top-3 right-3">
                <Chip
                  size="sm"
                  color="danger"
                  variant="solid"
                  className="text-white font-medium"
                >
                  Expired
                </Chip>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Prize Title */}
            <div className="mb-3">
              <h3 
                className="text-lg font-semibold line-clamp-2 mb-1"
                style={{ 
                  color: colors.gray[900],
                  fontFamily: typography.fontFamily.display.join(', ')
                }}
              >
                {prizeDisplay.title}
              </h3>
              <p 
                className="text-sm"
                style={{ color: colors.gray[600] }}
              >
                {prizeDisplay.subtitle}
              </p>
            </div>

            {/* Raffle Info */}
            <div className="space-y-3">
              {/* Creator */}
              <div className="flex items-center gap-2">
                <Avatar
                  size="sm"
                  name={raffle.createdBy.username}
                  className="w-6 h-6"
                />
                <span 
                  className="text-sm font-medium"
                  style={{ color: colors.gray[700] }}
                >
                  {raffle.createdBy.username}
                </span>
              </div>

              {/* Time Remaining */}
              <div className="flex items-center gap-2">
                <ClockIcon className="w-4 h-4" style={{ color: colors.gray[500] }} />
                <span 
                  className={`text-sm font-medium ${isExpired ? 'text-red-600' : 'text-gray-700'}`}
                >
                  {timeRemaining}
                </span>
              </div>

              {/* Ticket Price */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TicketIcon className="w-4 h-4" style={{ color: colors.gray[500] }} />
                  <span 
                    className="text-sm"
                    style={{ color: colors.gray[600] }}
                  >
                    Ticket Price:
                  </span>
                </div>
                <span 
                  className="text-sm font-semibold"
                  style={{ color: colors.primary[600] }}
                >
                  {raffle.perTicketPrice} {raffle.coinType.toUpperCase()}
                </span>
              </div>

              {/* Progress Bar (for RESERVE raffles) */}
              {raffle.raffleTypeEnum === 'RESERVE' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: colors.gray[600] }}>
                      {ticketsSold} / {ticketsAvailable} sold
                    </span>
                    <span style={{ color: colors.gray[600] }}>
                      {Math.round(progressPercentage)}%
                    </span>
                  </div>
                  <Progress
                    value={progressPercentage}
                    color="primary"
                    size="sm"
                    className="w-full"
                  />
                </div>
              )}

              {/* Unlimited Tickets Sold */}
              {raffle.raffleTypeEnum === 'UNLIMITED' && (
                <div className="flex items-center justify-between">
                  <span 
                    className="text-sm"
                    style={{ color: colors.gray[600] }}
                  >
                    Tickets Sold:
                  </span>
                  <span 
                    className="text-sm font-semibold"
                    style={{ color: colors.primary[600] }}
                  >
                    {ticketsSold.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardBody>

        <CardFooter className="pt-0 px-4 pb-4">
          <Button
            color="primary"
            variant="solid"
            fullWidth
            size="md"
            isDisabled={!raffle.status.isActive || isExpired}
            className="font-semibold"
          >
            {!raffle.status.isActive && raffle.status.wonBy ? 'Raffle Complete' :
             isExpired ? 'Expired' :
             'Enter Raffle'}
          </Button>
        </CardFooter>
      </Card>

      {/* Participation Modal */}
      {showParticipationModal && (
        <RaffleParticipationModal
          raffle={raffle}
          isOpen={showParticipationModal}
          onClose={() => setShowParticipationModal(false)}
          onSuccess={() => {
            setShowParticipationModal(false);
            onRaffleUpdate?.();
          }}
        />
      )}
    </>
  );
};

export default RaffleCard;