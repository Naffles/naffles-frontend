'use client';

import React, { useState } from 'react';
import { 
  Card, 
  CardBody, 
  Button, 
  Input, 
  Select, 
  SelectItem,
  Slider,
  Switch,
  Alert
} from '@nextui-org/react';
import { colors, typography } from '@/styles/design-system/tokens';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface RaffleSettingsProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const RaffleSettings: React.FC<RaffleSettingsProps> = ({
  data,
  onUpdate,
  onNext,
  onPrevious
}) => {
  const [ticketPrice, setTicketPrice] = useState(data.ticketPrice || 0);
  const [coinType, setCoinType] = useState(data.coinType || '');
  const [duration, setDuration] = useState(data.duration || 7);
  const [ticketsAvailable, setTicketsAvailable] = useState(data.ticketsAvailable || 100);
  const [discountCode, setDiscountCode] = useState(data.discountCode || '');
  const [enableDiscount, setEnableDiscount] = useState(!!data.discountCode);
  const [error, setError] = useState('');

  const paymentTokens = [
    { value: 'eth', label: 'Ethereum (ETH)', symbol: 'ETH' },
    { value: 'sol', label: 'Solana (SOL)', symbol: 'SOL' },
    { value: 'matic', label: 'Polygon (MATIC)', symbol: 'MATIC' },
    { value: 'usdc', label: 'USD Coin (USDC)', symbol: 'USDC' },
    { value: 'usdt', label: 'Tether (USDT)', symbol: 'USDT' },
    { value: 'nafflings', label: 'Nafflings', symbol: 'NAFFLINGS' }
  ];

  const durationOptions = [
    { value: 1, label: '1 Day' },
    { value: 3, label: '3 Days' },
    { value: 7, label: '1 Week' },
    { value: 14, label: '2 Weeks' },
    { value: 30, label: '1 Month' }
  ];

  const handleNext = () => {
    setError('');

    // Validation
    if (!coinType) {
      setError('Please select a payment token');
      return;
    }

    if (ticketPrice <= 0) {
      setError('Ticket price must be greater than 0');
      return;
    }

    if (data.raffleType === 'RESERVE' && ticketsAvailable <= 0) {
      setError('Number of tickets must be greater than 0 for reserve raffles');
      return;
    }

    if (duration < 1 || duration > 30) {
      setError('Duration must be between 1 and 30 days');
      return;
    }

    const settingsData = {
      ticketPrice,
      coinType,
      duration,
      ticketsAvailable: data.raffleType === 'RESERVE' ? ticketsAvailable : 0,
      discountCode: enableDiscount ? discountCode : ''
    };

    onUpdate(settingsData);
    onNext();
  };

  const estimatedRevenue = data.raffleType === 'RESERVE' 
    ? ticketsAvailable * ticketPrice 
    : 'Variable (depends on participation)';

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
          Raffle Settings
        </h3>
        <p className="text-sm" style={{ color: colors.gray[600] }}>
          Configure ticket pricing, duration, and other settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Basic Settings */}
        <div className="space-y-6">
          <Card>
            <CardBody className="p-6">
              <h4 className="text-lg font-semibold mb-4" style={{ color: colors.gray[900] }}>
                Ticket Configuration
              </h4>
              
              <div className="space-y-4">
                <Select
                  label="Payment Token"
                  placeholder="Select payment token"
                  selectedKeys={coinType ? [coinType] : []}
                  onSelectionChange={(keys) => setCoinType(Array.from(keys)[0] as string)}
                  isRequired
                >
                  {paymentTokens.map((token) => (
                    <SelectItem key={token.value} value={token.value}>
                      {token.label}
                    </SelectItem>
                  ))}
                </Select>

                <Input
                  type="number"
                  label="Ticket Price"
                  placeholder="Enter price per ticket"
                  value={ticketPrice.toString()}
                  onChange={(e) => setTicketPrice(parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.000001"
                  isRequired
                  endContent={
                    coinType && (
                      <span className="text-sm text-gray-500">
                        {paymentTokens.find(t => t.value === coinType)?.symbol}
                      </span>
                    )
                  }
                />

                {data.raffleType === 'RESERVE' && (
                  <Input
                    type="number"
                    label="Number of Tickets"
                    placeholder="Total tickets available"
                    value={ticketsAvailable.toString()}
                    onChange={(e) => setTicketsAvailable(parseInt(e.target.value) || 0)}
                    min="1"
                    max="10000"
                    isRequired
                    description="Maximum number of tickets that can be sold"
                  />
                )}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="p-6">
              <h4 className="text-lg font-semibold mb-4" style={{ color: colors.gray[900] }}>
                Duration Settings
              </h4>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block" style={{ color: colors.gray[700] }}>
                    Raffle Duration: {duration} day{duration !== 1 ? 's' : ''}
                  </label>
                  <Slider
                    size="md"
                    step={1}
                    minValue={1}
                    maxValue={30}
                    value={duration}
                    onChange={(value) => setDuration(Array.isArray(value) ? value[0] : value)}
                    className="max-w-md"
                    marks={[
                      { value: 1, label: '1d' },
                      { value: 7, label: '1w' },
                      { value: 14, label: '2w' },
                      { value: 30, label: '1m' }
                    ]}
                  />
                </div>

                <Select
                  label="Quick Duration"
                  placeholder="Or select preset"
                  selectedKeys={durationOptions.find(d => d.value === duration) ? [duration.toString()] : []}
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0] as string;
                    if (value) setDuration(parseInt(value));
                  }}
                >
                  {durationOptions.map((option) => (
                    <SelectItem key={option.value.toString()} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Right Column - Advanced Settings & Summary */}
        <div className="space-y-6">
          <Card>
            <CardBody className="p-6">
              <h4 className="text-lg font-semibold mb-4" style={{ color: colors.gray[900] }}>
                Advanced Options
              </h4>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium" style={{ color: colors.gray[900] }}>
                      Enable Discount Code
                    </p>
                    <p className="text-sm" style={{ color: colors.gray[600] }}>
                      Allow users to apply discount codes
                    </p>
                  </div>
                  <Switch
                    isSelected={enableDiscount}
                    onValueChange={setEnableDiscount}
                  />
                </div>

                {enableDiscount && (
                  <Input
                    label="Discount Code"
                    placeholder="Enter discount code"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    description="Users can apply this code for discounts"
                  />
                )}
              </div>
            </CardBody>
          </Card>

          <Card className="bg-primary-50 border border-primary-200">
            <CardBody className="p-6">
              <h4 className="text-lg font-semibold mb-4" style={{ color: colors.primary[700] }}>
                Raffle Summary
              </h4>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: colors.gray[600] }}>Raffle Type:</span>
                  <span className="font-medium" style={{ color: colors.gray[900] }}>
                    {data.raffleType} {data.lotteryType}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span style={{ color: colors.gray[600] }}>Ticket Price:</span>
                  <span className="font-medium" style={{ color: colors.gray[900] }}>
                    {ticketPrice} {paymentTokens.find(t => t.value === coinType)?.symbol || ''}
                  </span>
                </div>
                
                {data.raffleType === 'RESERVE' && (
                  <div className="flex justify-between">
                    <span style={{ color: colors.gray[600] }}>Total Tickets:</span>
                    <span className="font-medium" style={{ color: colors.gray[900] }}>
                      {ticketsAvailable.toLocaleString()}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span style={{ color: colors.gray[600] }}>Duration:</span>
                  <span className="font-medium" style={{ color: colors.gray[900] }}>
                    {duration} day{duration !== 1 ? 's' : ''}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span style={{ color: colors.gray[600] }}>Est. Revenue:</span>
                  <span className="font-medium" style={{ color: colors.gray[900] }}>
                    {typeof estimatedRevenue === 'number' 
                      ? `${estimatedRevenue.toLocaleString()} ${paymentTokens.find(t => t.value === coinType)?.symbol || ''}`
                      : estimatedRevenue
                    }
                  </span>
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
          className="px-8"
        >
          Previous
        </Button>
        <Button
          color="primary"
          size="lg"
          onPress={handleNext}
          className="px-8"
        >
          Review & Create
        </Button>
      </div>
    </div>
  );
};

export default RaffleSettings;