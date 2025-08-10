'use client';

import React from 'react';
import { Select, SelectItem, Button, Divider } from '@nextui-org/react';
import { colors, spacing, typography } from '@/styles/design-system/tokens';

interface RaffleFiltersProps {
  filters: {
    lotteryType: string;
    raffleType: string;
    priceRange: string;
    status: string;
  };
  onFiltersChange: (filters: any) => void;
  onClearFilters: () => void;
}

const RaffleFilters: React.FC<RaffleFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters
}) => {
  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 
          className="text-lg font-semibold"
          style={{ 
            color: colors.gray[900],
            fontFamily: typography.fontFamily.display.join(', ')
          }}
        >
          Filter Raffles
        </h3>
        <Button
          size="sm"
          variant="light"
          color="danger"
          onPress={onClearFilters}
        >
          Clear All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Lottery Type Filter */}
        <div className="space-y-2">
          <label 
            className="text-sm font-medium block"
            style={{ color: colors.gray[700] }}
          >
            Prize Type
          </label>
          <Select
            placeholder="All Types"
            selectedKeys={filters.lotteryType !== 'all' ? [filters.lotteryType] : []}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0] as string || 'all';
              handleFilterChange('lotteryType', value);
            }}
            classNames={{
              trigger: "h-10"
            }}
          >
            <SelectItem key="all">All Types</SelectItem>
            <SelectItem key="token">Token Prizes</SelectItem>
            <SelectItem key="nft">NFT Prizes</SelectItem>
            <SelectItem key="nafflings">Nafflings Prizes</SelectItem>
          </Select>
        </div>

        {/* Raffle Type Filter */}
        <div className="space-y-2">
          <label 
            className="text-sm font-medium block"
            style={{ color: colors.gray[700] }}
          >
            Raffle Format
          </label>
          <Select
            placeholder="All Formats"
            selectedKeys={filters.raffleType !== 'all' ? [filters.raffleType] : []}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0] as string || 'all';
              handleFilterChange('raffleType', value);
            }}
            classNames={{
              trigger: "h-10"
            }}
          >
            <SelectItem key="all">All Formats</SelectItem>
            <SelectItem key="reserve">Reserve (Limited)</SelectItem>
            <SelectItem key="unlimited">Unlimited</SelectItem>
            <SelectItem key="unconditional">Unconditional</SelectItem>
          </Select>
        </div>

        {/* Price Range Filter */}
        <div className="space-y-2">
          <label 
            className="text-sm font-medium block"
            style={{ color: colors.gray[700] }}
          >
            Ticket Price Range
          </label>
          <Select
            placeholder="All Prices"
            selectedKeys={filters.priceRange !== 'all' ? [filters.priceRange] : []}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0] as string || 'all';
              handleFilterChange('priceRange', value);
            }}
            classNames={{
              trigger: "h-10"
            }}
          >
            <SelectItem key="all">All Prices</SelectItem>
            <SelectItem key="0-1">0 - 1</SelectItem>
            <SelectItem key="1-10">1 - 10</SelectItem>
            <SelectItem key="10-50">10 - 50</SelectItem>
            <SelectItem key="50-100">50 - 100</SelectItem>
            <SelectItem key="100-500">100 - 500</SelectItem>
            <SelectItem key="500">500+</SelectItem>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <label 
            className="text-sm font-medium block"
            style={{ color: colors.gray[700] }}
          >
            Status
          </label>
          <Select
            placeholder="Active"
            selectedKeys={[filters.status]}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0] as string || 'active';
              handleFilterChange('status', value);
            }}
            classNames={{
              trigger: "h-10"
            }}
          >
            <SelectItem key="active">Active Only</SelectItem>
            <SelectItem key="completed">Completed Only</SelectItem>
            <SelectItem key="all">All Status</SelectItem>
          </Select>
        </div>
      </div>

      <Divider />

      {/* Quick Filter Buttons */}
      <div className="space-y-3">
        <h4 
          className="text-sm font-medium"
          style={{ color: colors.gray[700] }}
        >
          Quick Filters
        </h4>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={filters.lotteryType === 'nft' ? 'solid' : 'bordered'}
            color="primary"
            onPress={() => handleFilterChange('lotteryType', filters.lotteryType === 'nft' ? 'all' : 'nft')}
          >
            NFT Raffles
          </Button>
          <Button
            size="sm"
            variant={filters.lotteryType === 'token' ? 'solid' : 'bordered'}
            color="secondary"
            onPress={() => handleFilterChange('lotteryType', filters.lotteryType === 'token' ? 'all' : 'token')}
          >
            Token Raffles
          </Button>
          <Button
            size="sm"
            variant={filters.raffleType === 'reserve' ? 'solid' : 'bordered'}
            color="warning"
            onPress={() => handleFilterChange('raffleType', filters.raffleType === 'reserve' ? 'all' : 'reserve')}
          >
            Limited Supply
          </Button>
          <Button
            size="sm"
            variant={filters.priceRange === '0-1' ? 'solid' : 'bordered'}
            color="success"
            onPress={() => handleFilterChange('priceRange', filters.priceRange === '0-1' ? 'all' : '0-1')}
          >
            Low Price
          </Button>
        </div>
      </div>

      {/* Filter Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 
          className="text-sm font-medium mb-2"
          style={{ color: colors.gray[700] }}
        >
          Active Filters Summary
        </h4>
        <div className="text-sm space-y-1" style={{ color: colors.gray[600] }}>
          <div>Prize Type: <span className="font-medium">{filters.lotteryType === 'all' ? 'All' : filters.lotteryType.toUpperCase()}</span></div>
          <div>Format: <span className="font-medium">{filters.raffleType === 'all' ? 'All' : filters.raffleType.toUpperCase()}</span></div>
          <div>Price Range: <span className="font-medium">{filters.priceRange === 'all' ? 'All' : filters.priceRange}</span></div>
          <div>Status: <span className="font-medium">{filters.status.toUpperCase()}</span></div>
        </div>
      </div>
    </div>
  );
};

export default RaffleFilters;