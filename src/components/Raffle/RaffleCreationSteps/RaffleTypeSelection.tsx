'use client';

import React, { useState } from 'react';
import { Card, CardBody, Button, RadioGroup, Radio } from '@nextui-org/react';
import { colors, typography } from '@/styles/design-system/tokens';
import { 
  CurrencyDollarIcon, 
  PhotoIcon, 
  StarIcon,
  ClockIcon,
  InfinityIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

interface RaffleTypeSelectionProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
}

const RaffleTypeSelection: React.FC<RaffleTypeSelectionProps> = ({
  data,
  onUpdate,
  onNext
}) => {
  const [selectedLotteryType, setSelectedLotteryType] = useState(data.lotteryType || '');
  const [selectedRaffleType, setSelectedRaffleType] = useState(data.raffleType || '');

  const lotteryTypes = [
    {
      value: 'TOKEN',
      title: 'Token Raffle',
      description: 'Raffle cryptocurrency tokens',
      icon: CurrencyDollarIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      value: 'NFT',
      title: 'NFT Raffle',
      description: 'Raffle digital collectibles',
      icon: PhotoIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      value: 'NAFFLINGS',
      title: 'Nafflings Raffle',
      description: 'Raffle platform points',
      icon: StarIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    }
  ];

  const raffleTypes = [
    {
      value: 'RESERVE',
      title: 'Reserve Raffle',
      description: 'Limited tickets, guaranteed winner when sold out',
      icon: ShieldCheckIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      features: ['Fixed ticket limit', 'Guaranteed execution', 'Refund if not sold out']
    },
    {
      value: 'UNLIMITED',
      title: 'Unlimited Raffle',
      description: 'No ticket limit, runs for set duration',
      icon: InfinityIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      features: ['No ticket limit', 'Time-based execution', 'More participants possible']
    },
    {
      value: 'UNCONDITIONAL',
      title: 'Unconditional Raffle',
      description: 'Always executes regardless of ticket sales',
      icon: ClockIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      features: ['Always executes', 'No minimum sales', 'Cannot be cancelled']
    }
  ];

  const handleNext = () => {
    if (selectedLotteryType && selectedRaffleType) {
      onUpdate({
        lotteryType: selectedLotteryType,
        raffleType: selectedRaffleType
      });
      onNext();
    }
  };

  const isValid = selectedLotteryType && selectedRaffleType;

  return (
    <div className="space-y-8">
      {/* Lottery Type Selection */}
      <div>
        <h3 
          className="text-xl font-semibold mb-4"
          style={{ 
            color: colors.gray[900],
            fontFamily: typography.fontFamily.display.join(', ')
          }}
        >
          What type of prize are you raffling?
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {lotteryTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedLotteryType === type.value;
            
            return (
              <Card
                key={type.value}
                isPressable
                onPress={() => setSelectedLotteryType(type.value)}
                className={`cursor-pointer transition-all duration-200 ${
                  isSelected 
                    ? 'ring-2 ring-primary-500 border-primary-500' 
                    : 'hover:scale-105'
                }`}
              >
                <CardBody className="p-6 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${type.bgColor} flex items-center justify-center`}>
                    <Icon className={`w-8 h-8 ${type.color}`} />
                  </div>
                  <h4 className="text-lg font-semibold mb-2" style={{ color: colors.gray[900] }}>
                    {type.title}
                  </h4>
                  <p className="text-sm" style={{ color: colors.gray[600] }}>
                    {type.description}
                  </p>
                </CardBody>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Raffle Type Selection */}
      <div>
        <h3 
          className="text-xl font-semibold mb-4"
          style={{ 
            color: colors.gray[900],
            fontFamily: typography.fontFamily.display.join(', ')
          }}
        >
          Choose your raffle format
        </h3>
        
        <div className="space-y-4">
          {raffleTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedRaffleType === type.value;
            
            return (
              <Card
                key={type.value}
                isPressable
                onPress={() => setSelectedRaffleType(type.value)}
                className={`cursor-pointer transition-all duration-200 ${
                  isSelected 
                    ? 'ring-2 ring-primary-500 border-primary-500' 
                    : 'hover:shadow-md'
                }`}
              >
                <CardBody className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-full ${type.bgColor} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-6 h-6 ${type.color}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold mb-2" style={{ color: colors.gray[900] }}>
                        {type.title}
                      </h4>
                      <p className="text-sm mb-3" style={{ color: colors.gray[600] }}>
                        {type.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {type.features.map((feature, index) => (
                          <span
                            key={index}
                            className="text-xs px-2 py-1 rounded-full bg-gray-100"
                            style={{ color: colors.gray[700] }}
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <div className={`w-6 h-6 rounded-full border-2 ${
                        isSelected 
                          ? 'bg-primary-500 border-primary-500' 
                          : 'border-gray-300'
                      } flex items-center justify-center`}>
                        {isSelected && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Next Button */}
      <div className="flex justify-end pt-4">
        <Button
          color="primary"
          size="lg"
          onPress={handleNext}
          isDisabled={!isValid}
          className="px-8"
        >
          Continue to Prize Setup
        </Button>
      </div>
    </div>
  );
};

export default RaffleTypeSelection;