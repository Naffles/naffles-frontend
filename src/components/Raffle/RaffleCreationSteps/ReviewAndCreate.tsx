'use client';

import React, { useState } from 'react';
import { 
  Card, 
  CardBody, 
  Button, 
  Divider,
  Chip,
  Image,
  Alert,
  Spinner
} from '@nextui-org/react';
import { colors, typography } from '@/styles/design-system/tokens';
import { 
  CheckCircleIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  ClockIcon,
  TicketIcon
} from '@heroicons/react/24/outline';

interface ReviewAndCreateProps {
  data: any;
  onPrevious: () => void;
  onSuccess: () => void;
  onClose: () => void;
}

const ReviewAndCreate: React.FC<ReviewAndCreateProps> = ({
  data,
  onPrevious,
  onSuccess,
  onClose
}) => {
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const handleCreateRaffle = async () => {
    setCreating(true);
    setError('');

    try {
      const rafflePayload = {
        lotteryTypeEnum: data.lotteryType,
        raffleTypeEnum: data.raffleType,
        coinType: data.coinType,
        perTicketPrice: data.ticketPrice,
        raffleDurationDays: data.duration,
        ticketsAvailable: data.raffleType === 'RESERVE' ? data.ticketsAvailable : 0,
        discountCode: data.discountCode || null,
        rafflePrize: {}
      };

      // Add prize data based on lottery type
      if (data.lotteryType === 'TOKEN') {
        rafflePayload.rafflePrize = {
          tokenPrize: {
            token: data.tokenPrize.token,
            amount: data.tokenPrize.amount
          }
        };
      } else if (data.lotteryType === 'NFT') {
        rafflePayload.rafflePrize = {
          nftPrize: {
            contractAddress: data.nftPrize.contractAddress,
            tokenId: data.nftPrize.tokenId,
            name: data.nftPrize.name,
            image: data.nftPrize.image
          }
        };
      } else if (data.lotteryType === 'NAFFLINGS') {
        rafflePayload.rafflePrize = {
          nafflings: data.nafflingsPrize.amount
        };
      }

      const response = await fetch('/api/raffles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rafflePayload),
      });

      const result = await response.json();

      if (response.ok) {
        onSuccess();
      } else {
        setError(result.message || 'Failed to create raffle');
      }
    } catch (error) {
      console.error('Error creating raffle:', error);
      setError('Failed to create raffle. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const getPrizeDisplay = () => {
    if (data.lotteryType === 'TOKEN') {
      return {
        title: `${data.tokenPrize.amount} ${data.tokenPrize.token.toUpperCase()}`,
        subtitle: 'Token Prize',
        image: `/tokens/${data.tokenPrize.token.toLowerCase()}.png`
      };
    } else if (data.lotteryType === 'NFT') {
      return {
        title: data.nftPrize.name,
        subtitle: 'NFT Prize',
        image: data.nftPrize.image
      };
    } else if (data.lotteryType === 'NAFFLINGS') {
      return {
        title: `${data.nafflingsPrize.amount.toLocaleString()} Nafflings`,
        subtitle: 'Points Prize',
        image: '/images/nafflings-icon.png'
      };
    }
    return { title: '', subtitle: '', image: '' };
  };

  const prizeDisplay = getPrizeDisplay();
  const estimatedRevenue = data.raffleType === 'RESERVE' 
    ? data.ticketsAvailable * data.ticketPrice 
    : 'Variable';

  return (
    <div className="space-y-6">
      <div>
        <h3 
          className="text-xl font-semibold mb-2"
          style={{ 
            color: colors.gray[900],
            fontFamily: typography.fontFamily.display.join(', ')
          }}
        >
          Review Your Raffle
        </h3>
        <p className="text-sm" style={{ color: colors.gray[600] }}>
          Please review all details before creating your raffle
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Prize & Type */}
        <div className="space-y-6">
          <Card>
            <CardBody className="p-6">
              <h4 className="text-lg font-semibold mb-4" style={{ color: colors.gray[900] }}>
                Prize Information
              </h4>
              
              <div className="flex gap-4 mb-4">
                <Image
                  src={prizeDisplay.image}
                  alt={prizeDisplay.title}
                  width={80}
                  height={80}
                  className="rounded-lg object-cover"
                  fallbackSrc="/images/default-prize.png"
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
                      {data.lotteryType}
                    </Chip>
                    <Chip size="sm" color="secondary" variant="flat">
                      {data.raffleType}
                    </Chip>
                  </div>
                </div>
              </div>

              {data.lotteryType === 'NFT' && (
                <div className="text-xs space-y-1" style={{ color: colors.gray[600] }}>
                  <div>Contract: {data.nftPrize.contractAddress}</div>
                  <div>Token ID: {data.nftPrize.tokenId}</div>
                </div>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <h4 className="text-lg font-semibold mb-4" style={{ color: colors.gray[900] }}>
                Raffle Configuration
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CurrencyDollarIcon className="w-5 h-5" style={{ color: colors.primary[500] }} />
                  <div>
                    <div className="font-medium" style={{ color: colors.gray[900] }}>
                      {data.ticketPrice} {data.coinType.toUpperCase()}
                    </div>
                    <div className="text-sm" style={{ color: colors.gray[600] }}>
                      Price per ticket
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <ClockIcon className="w-5 h-5" style={{ color: colors.primary[500] }} />
                  <div>
                    <div className="font-medium" style={{ color: colors.gray[900] }}>
                      {data.duration} day{data.duration !== 1 ? 's' : ''}
                    </div>
                    <div className="text-sm" style={{ color: colors.gray[600] }}>
                      Raffle duration
                    </div>
                  </div>
                </div>

                {data.raffleType === 'RESERVE' && (
                  <div className="flex items-center gap-3">
                    <TicketIcon className="w-5 h-5" style={{ color: colors.primary[500] }} />
                    <div>
                      <div className="font-medium" style={{ color: colors.gray[900] }}>
                        {data.ticketsAvailable.toLocaleString()} tickets
                      </div>
                      <div className="text-sm" style={{ color: colors.gray[600] }}>
                        Maximum tickets available
                      </div>
                    </div>
                  </div>
                )}

                {data.discountCode && (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircleIcon className="w-3 h-3 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium" style={{ color: colors.gray[900] }}>
                        {data.discountCode}
                      </div>
                      <div className="text-sm" style={{ color: colors.gray[600] }}>
                        Discount code enabled
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right Column - Summary & Warnings */}
        <div className="space-y-6">
          <Card className="bg-primary-50 border border-primary-200">
            <CardBody className="p-6">
              <h4 className="text-lg font-semibold mb-4" style={{ color: colors.primary[700] }}>
                Financial Summary
              </h4>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span style={{ color: colors.gray[600] }}>Ticket Price:</span>
                  <span className="font-medium" style={{ color: colors.gray[900] }}>
                    {data.ticketPrice} {data.coinType.toUpperCase()}
                  </span>
                </div>
                
                {data.raffleType === 'RESERVE' && (
                  <>
                    <div className="flex justify-between">
                      <span style={{ color: colors.gray[600] }}>Max Tickets:</span>
                      <span className="font-medium" style={{ color: colors.gray[900] }}>
                        {data.ticketsAvailable.toLocaleString()}
                      </span>
                    </div>
                    
                    <Divider />
                    
                    <div className="flex justify-between">
                      <span style={{ color: colors.gray[600] }}>Potential Revenue:</span>
                      <span className="font-semibold text-lg" style={{ color: colors.primary[700] }}>
                        {estimatedRevenue.toLocaleString()} {data.coinType.toUpperCase()}
                      </span>
                    </div>
                  </>
                )}
                
                <div className="text-xs mt-4 p-3 bg-white rounded-lg" style={{ color: colors.gray[600] }}>
                  Platform fees and gas costs will be deducted from your earnings.
                  You will receive the prize amount back if the raffle is cancelled.
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-yellow-50 border border-yellow-200">
            <CardBody className="p-6">
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: colors.warning[700] }}>
                <ExclamationTriangleIcon className="w-5 h-5" />
                Important Notes
              </h4>
              
              <div className="space-y-3 text-sm" style={{ color: colors.warning[700] }}>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2 flex-shrink-0" />
                  <div>
                    Your prize will be locked in escrow until the raffle completes
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2 flex-shrink-0" />
                  <div>
                    {data.raffleType === 'RESERVE' 
                      ? 'Reserve raffles can be cancelled if not sold out by the end date'
                      : data.raffleType === 'UNLIMITED'
                      ? 'Unlimited raffles will execute after the duration regardless of ticket sales'
                      : 'Unconditional raffles cannot be cancelled and will always execute'
                    }
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2 flex-shrink-0" />
                  <div>
                    Winners are selected using verifiable random functions (VRF) for fairness
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

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

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        <Button
          variant="bordered"
          size="lg"
          onPress={onPrevious}
          isDisabled={creating}
          className="px-8"
        >
          Previous
        </Button>
        <Button
          color="primary"
          size="lg"
          onPress={handleCreateRaffle}
          isLoading={creating}
          className="px-8"
          startContent={creating ? <Spinner size="sm" /> : <CheckCircleIcon className="w-5 h-5" />}
        >
          {creating ? 'Creating Raffle...' : 'Create Raffle'}
        </Button>
      </div>
    </div>
  );
};

export default ReviewAndCreate;