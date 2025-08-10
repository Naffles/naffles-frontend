'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardBody, Input, Select, SelectItem, Button, Chip, Pagination, Spinner } from '@nextui-org/react';
import { MagnifyingGlassIcon, FunnelIcon, PlusIcon } from '@heroicons/react/24/outline';
import { AccessibleButton } from '../Accessibility/AccessibleButton';
import AllowlistCard from './AllowlistCard';
import AllowlistParticipationModal from './AllowlistParticipationModal';
import { colors, spacing } from '../../styles/design-system/tokens';
import { Allowlist, AllowlistListResponse } from './types';

interface AllowlistBrowserProps {
  communityId?: string;
  showCreateButton?: boolean;
  onCreateAllowlist?: () => void;
  className?: string;
}

/**
 * AllowlistBrowser Component
 * 
 * Browse and filter allowlists with search, status filtering, and pagination.
 * Supports both community-specific and platform-wide browsing.
 */
const AllowlistBrowser: React.FC<AllowlistBrowserProps> = ({
  communityId,
  showCreateButton = false,
  onCreateAllowlist,
  className = ''
}) => {
  const [allowlists, setAllowlists] = useState<Allowlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('active');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedAllowlist, setSelectedAllowlist] = useState<Allowlist | null>(null);
  const [showParticipationModal, setShowParticipationModal] = useState(false);

  const statusOptions = [
    { key: 'all', label: 'All Status' },
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' }
  ];

  const sortOptions = [
    { key: 'newest', label: 'Newest First' },
    { key: 'oldest', label: 'Oldest First' },
    { key: 'ending_soon', label: 'Ending Soon' },
    { key: 'most_participants', label: 'Most Participants' },
    { key: 'highest_prize', label: 'Highest Prize Value' }
  ];

  useEffect(() => {
    loadAllowlists();
  }, [communityId, statusFilter, sortBy, currentPage, searchQuery]);

  const loadAllowlists = async () => {
    setLoading(true);
    
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        status: statusFilter,
        sort: sortBy,
        ...(searchQuery && { search: searchQuery }),
        ...(communityId && { communityId })
      });

      const endpoint = communityId 
        ? `/api/allowlists/community/${communityId}?${params}`
        : `/api/allowlists?${params}`;

      const response = await fetch(endpoint);
      
      if (response.ok) {
        const data: { success: boolean; data: AllowlistListResponse } = await response.json();
        setAllowlists(data.data.allowlists);
        setTotalPages(data.data.pagination.pages);
      } else {
        console.error('Failed to load allowlists');
        setAllowlists([]);
      }
    } catch (error) {
      console.error('Error loading allowlists:', error);
      setAllowlists([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  const handleParticipate = (allowlist: Allowlist) => {
    setSelectedAllowlist(allowlist);
    setShowParticipationModal(true);
  };

  const handleParticipationSuccess = () => {
    setShowParticipationModal(false);
    setSelectedAllowlist(null);
    // Refresh the allowlists to show updated participation counts
    loadAllowlists();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'completed':
        return 'primary';
      case 'cancelled':
        return 'danger';
      default:
        return 'default';
    }
  };

  const renderFilters = () => (
    <Card className="mb-6">
      <CardBody className="p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="flex-1 max-w-md">
              <Input
                placeholder="Search allowlists..."
                value={searchQuery}
                onValueChange={handleSearch}
                startContent={<MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />}
                isClearable
                onClear={() => handleSearch('')}
              />
            </div>
            
            <div className="flex gap-2">
              <Select
                placeholder="Status"
                selectedKeys={[statusFilter]}
                onSelectionChange={(keys) => handleStatusFilter(Array.from(keys)[0] as string)}
                className="min-w-[120px]"
                startContent={<FunnelIcon className="w-4 h-4 text-gray-400" />}
              >
                {statusOptions.map((option) => (
                  <SelectItem key={option.key} value={option.key}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>

              <Select
                placeholder="Sort by"
                selectedKeys={[sortBy]}
                onSelectionChange={(keys) => handleSortChange(Array.from(keys)[0] as string)}
                className="min-w-[140px]"
              >
                {sortOptions.map((option) => (
                  <SelectItem key={option.key} value={option.key}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>

          {showCreateButton && onCreateAllowlist && (
            <AccessibleButton
              color="primary"
              onPress={onCreateAllowlist}
              startContent={<PlusIcon className="w-4 h-4" />}
            >
              Create Allowlist
            </AccessibleButton>
          )}
        </div>
      </CardBody>
    </Card>
  );

  const renderAllowlistGrid = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" />
        </div>
      );
    }

    if (allowlists.length === 0) {
      return (
        <Card className="py-12">
          <CardBody className="text-center">
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchQuery ? 'No allowlists found' : 'No allowlists available'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery 
                  ? `No allowlists match your search for "${searchQuery}"`
                  : communityId 
                    ? 'This community hasn\'t created any allowlists yet.'
                    : 'No allowlists are currently available.'
                }
              </p>
              
              {showCreateButton && onCreateAllowlist && (
                <AccessibleButton
                  color="primary"
                  onPress={onCreateAllowlist}
                  startContent={<PlusIcon className="w-4 h-4" />}
                >
                  Create First Allowlist
                </AccessibleButton>
              )}
            </div>
          </CardBody>
        </Card>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allowlists.map((allowlist) => (
          <AllowlistCard
            key={allowlist._id}
            allowlist={allowlist}
            showParticipationButton={allowlist.status === 'active'}
            onParticipate={() => handleParticipate(allowlist)}
          />
        ))}
      </div>
    );
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center mt-8">
        <Pagination
          total={totalPages}
          page={currentPage}
          onChange={setCurrentPage}
          showControls
          showShadow
        />
      </div>
    );
  };

  const renderActiveFilters = () => {
    const activeFilters = [];
    
    if (statusFilter !== 'all') {
      activeFilters.push({
        key: 'status',
        label: `Status: ${statusOptions.find(opt => opt.key === statusFilter)?.label}`,
        onRemove: () => handleStatusFilter('all')
      });
    }
    
    if (searchQuery) {
      activeFilters.push({
        key: 'search',
        label: `Search: "${searchQuery}"`,
        onRemove: () => handleSearch('')
      });
    }

    if (activeFilters.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="text-sm text-gray-600 mr-2">Active filters:</span>
        {activeFilters.map((filter) => (
          <Chip
            key={filter.key}
            onClose={filter.onRemove}
            variant="flat"
            size="sm"
          >
            {filter.label}
          </Chip>
        ))}
        <Button
          size="sm"
          variant="light"
          onPress={() => {
            setSearchQuery('');
            setStatusFilter('all');
            setCurrentPage(1);
          }}
        >
          Clear all
        </Button>
      </div>
    );
  };

  return (
    <div className={className}>
      {renderFilters()}
      {renderActiveFilters()}
      
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {loading ? (
            'Loading allowlists...'
          ) : (
            `Showing ${allowlists.length} allowlist${allowlists.length !== 1 ? 's' : ''}`
          )}
        </div>
        
        {allowlists.length > 0 && (
          <div className="flex items-center gap-2">
            {statusFilter === 'active' && (
              <Chip color="success" variant="flat" size="sm">
                Live
              </Chip>
            )}
            {communityId && (
              <Chip color="primary" variant="flat" size="sm">
                Community
              </Chip>
            )}
          </div>
        )}
      </div>

      {renderAllowlistGrid()}
      {renderPagination()}

      {/* Participation Modal */}
      {selectedAllowlist && (
        <AllowlistParticipationModal
          allowlist={selectedAllowlist}
          isOpen={showParticipationModal}
          onClose={() => {
            setShowParticipationModal(false);
            setSelectedAllowlist(null);
          }}
          onSuccess={handleParticipationSuccess}
        />
      )}
    </div>
  );
};

export default AllowlistBrowser;