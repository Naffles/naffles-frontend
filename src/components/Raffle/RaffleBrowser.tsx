'use client';

import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Select, SelectItem, Chip, Spinner } from '@nextui-org/react';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { colors, spacing, typography, shadows } from '@/styles/design-system/tokens';
import RaffleCard from './RaffleCard';
import RaffleFilters from './RaffleFilters';

interface Raffle {
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
}

interface RaffleBrowserProps {
  className?: string;
}

const RaffleBrowser: React.FC<RaffleBrowserProps> = ({ className = '' }) => {
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [filteredRaffles, setFilteredRaffles] = useState<Raffle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('endingSoon');
  const [filters, setFilters] = useState({
    lotteryType: 'all',
    raffleType: 'all',
    priceRange: 'all',
    status: 'active'
  });

  // Fetch raffles from API
  useEffect(() => {
    fetchRaffles();
  }, []);

  // Apply filters and search
  useEffect(() => {
    applyFiltersAndSearch();
  }, [raffles, searchQuery, filters, sortBy]);

  const fetchRaffles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/raffles');
      if (response.ok) {
        const data = await response.json();
        setRaffles(data.raffles || []);
      }
    } catch (error) {
      console.error('Error fetching raffles:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFiltersAndSearch = () => {
    let filtered = [...raffles];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(raffle => 
        raffle.eventId.toLowerCase().includes(query) ||
        raffle.createdBy.username.toLowerCase().includes(query) ||
        (raffle.rafflePrize.nftPrize?.name?.toLowerCase().includes(query)) ||
        (raffle.rafflePrize.tokenPrize?.token?.toLowerCase().includes(query))
      );
    }

    // Apply lottery type filter
    if (filters.lotteryType !== 'all') {
      filtered = filtered.filter(raffle => 
        raffle.lotteryTypeEnum.toLowerCase() === filters.lotteryType.toLowerCase()
      );
    }

    // Apply raffle type filter
    if (filters.raffleType !== 'all') {
      filtered = filtered.filter(raffle => 
        raffle.raffleTypeEnum.toLowerCase() === filters.raffleType.toLowerCase()
      );
    }

    // Apply status filter
    if (filters.status === 'active') {
      filtered = filtered.filter(raffle => raffle.status.isActive);
    } else if (filters.status === 'completed') {
      filtered = filtered.filter(raffle => !raffle.status.isActive);
    }

    // Apply price range filter
    if (filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-').map(Number);
      filtered = filtered.filter(raffle => {
        const price = raffle.perTicketPrice;
        if (max) {
          return price >= min && price <= max;
        }
        return price >= min;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'endingSoon':
          return new Date(a.raffleEndDate).getTime() - new Date(b.raffleEndDate).getTime();
        case 'newest':
          return new Date(b.raffleEndDate).getTime() - new Date(a.raffleEndDate).getTime();
        case 'priceHigh':
          return b.perTicketPrice - a.perTicketPrice;
        case 'priceLow':
          return a.perTicketPrice - b.perTicketPrice;
        case 'popular':
          return (b.ticketsSold || 0) - (a.ticketsSold || 0);
        default:
          return 0;
      }
    });

    setFilteredRaffles(filtered);
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({
      lotteryType: 'all',
      raffleType: 'all',
      priceRange: 'all',
      status: 'active'
    });
    setSearchQuery('');
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.lotteryType !== 'all') count++;
    if (filters.raffleType !== 'all') count++;
    if (filters.priceRange !== 'all') count++;
    if (filters.status !== 'active') count++;
    if (searchQuery.trim()) count++;
    return count;
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 
              className="text-3xl font-bold mb-2"
              style={{ 
                color: colors.gray[900],
                fontFamily: typography.fontFamily.display.join(', ')
              }}
            >
              Live Raffles
            </h1>
            <p 
              className="text-lg"
              style={{ color: colors.gray[600] }}
            >
              Discover and participate in exciting raffles for NFTs, tokens, and more
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Chip
              variant="flat"
              color="primary"
              size="lg"
            >
              {filteredRaffles.length} Active Raffles
            </Chip>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <Input
              placeholder="Search raffles by ID, creator, or prize..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startContent={<MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />}
              classNames={{
                input: "text-base",
                inputWrapper: "h-12"
              }}
            />
          </div>

          {/* Sort Dropdown */}
          <Select
            placeholder="Sort by"
            selectedKeys={[sortBy]}
            onSelectionChange={(keys) => setSortBy(Array.from(keys)[0] as string)}
            className="w-full lg:w-48"
            classNames={{
              trigger: "h-12"
            }}
          >
            <SelectItem key="endingSoon">Ending Soon</SelectItem>
            <SelectItem key="newest">Newest First</SelectItem>
            <SelectItem key="popular">Most Popular</SelectItem>
            <SelectItem key="priceHigh">Price: High to Low</SelectItem>
            <SelectItem key="priceLow">Price: Low to High</SelectItem>
          </Select>

          {/* Filter Toggle Button */}
          <Button
            variant={showFilters ? "solid" : "bordered"}
            color="primary"
            onPress={() => setShowFilters(!showFilters)}
            startContent={<FunnelIcon className="w-5 h-5" />}
            className="h-12 px-6"
          >
            Filters
            {getActiveFilterCount() > 0 && (
              <Chip size="sm" color="warning" className="ml-2">
                {getActiveFilterCount()}
              </Chip>
            )}
          </Button>
        </div>

        {/* Active Filters Display */}
        {getActiveFilterCount() > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <span className="text-sm font-medium text-gray-600">Active filters:</span>
            {filters.lotteryType !== 'all' && (
              <Chip
                size="sm"
                variant="flat"
                onClose={() => setFilters(prev => ({ ...prev, lotteryType: 'all' }))}
              >
                Type: {filters.lotteryType}
              </Chip>
            )}
            {filters.raffleType !== 'all' && (
              <Chip
                size="sm"
                variant="flat"
                onClose={() => setFilters(prev => ({ ...prev, raffleType: 'all' }))}
              >
                Format: {filters.raffleType}
              </Chip>
            )}
            {filters.priceRange !== 'all' && (
              <Chip
                size="sm"
                variant="flat"
                onClose={() => setFilters(prev => ({ ...prev, priceRange: 'all' }))}
              >
                Price: {filters.priceRange}
              </Chip>
            )}
            {filters.status !== 'active' && (
              <Chip
                size="sm"
                variant="flat"
                onClose={() => setFilters(prev => ({ ...prev, status: 'active' }))}
              >
                Status: {filters.status}
              </Chip>
            )}
            {searchQuery.trim() && (
              <Chip
                size="sm"
                variant="flat"
                onClose={() => setSearchQuery('')}
              >
                Search: "{searchQuery}"
              </Chip>
            )}
            <Button
              size="sm"
              variant="light"
              color="danger"
              onPress={clearFilters}
            >
              Clear All
            </Button>
          </div>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="mb-6 p-6">
          <RaffleFilters
            filters={filters}
            onFiltersChange={handleFilterChange}
            onClearFilters={clearFilters}
          />
        </Card>
      )}

      {/* Results Section */}
      <div className="min-h-96">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner size="lg" color="primary" />
          </div>
        ) : filteredRaffles.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <MagnifyingGlassIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: colors.gray[900] }}>
                No raffles found
              </h3>
              <p className="text-gray-600 mb-4">
                {searchQuery || getActiveFilterCount() > 0
                  ? "Try adjusting your search or filters to find more raffles."
                  : "There are no active raffles at the moment. Check back soon!"
                }
              </p>
              {(searchQuery || getActiveFilterCount() > 0) && (
                <Button
                  color="primary"
                  variant="flat"
                  onPress={clearFilters}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRaffles.map((raffle) => (
              <RaffleCard
                key={raffle._id}
                raffle={raffle}
                onRaffleUpdate={fetchRaffles}
              />
            ))}
          </div>
        )}
      </div>

      {/* Load More Button (if needed for pagination) */}
      {filteredRaffles.length > 0 && filteredRaffles.length % 20 === 0 && (
        <div className="flex justify-center mt-8">
          <Button
            color="primary"
            variant="bordered"
            size="lg"
            onPress={() => {
              // Implement load more functionality
              console.log('Load more raffles');
            }}
          >
            Load More Raffles
          </Button>
        </div>
      )}
    </div>
  );
};

export default RaffleBrowser;