import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Progress,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Select,
  SelectItem,
  Spinner,
  Tabs,
  Tab,
  Image,
  Divider
} from '@nextui-org/react';
import {
  WalletIcon,
  ClockIcon,
  GiftIcon,
  ChartBarIcon,
  PlusIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

interface NFT {
  tokenId: string;
  contractAddress: string;
  blockchain: string;
  name: string;
  description?: string;
  image: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

interface StakingPosition {
  _id: string;
  nftTokenId: string;
  nftContractAddress: string;
  blockchain: string;
  nftMetadata: NFT;
  stakingDuration: number;
  stakedAt: string;
  unstakeAt: string;
  status: 'active' | 'unstaked' | 'expired';
  totalRewardsEarned: number;
  stakingProgress: number;
  remainingDays: number;
  stakingContractId: {
    _id: string;
    contractName: string;
    rewardStructures: {
      sixMonths: { openEntryTicketsPerMonth: number; bonusMultiplier: number };
      twelveMonths: { openEntryTicketsPerMonth: number; bonusMultiplier: number };
      threeYears: { openEntryTicketsPerMonth: number; bonusMultiplier: number };
    };
  };
}

interface StakingContract {
  _id: string;
  contractName: string;
  contractAddress: string;
  blockchain: string;
  description?: string;
  rewardStructures: {
    sixMonths: { openEntryTicketsPerMonth: number; bonusMultiplier: number };
    twelveMonths: { openEntryTicketsPerMonth: number; bonusMultiplier: number };
    threeYears: { openEntryTicketsPerMonth: number; bonusMultiplier: number };
  };
}

interface PortfolioSummary {
  totalPositions: number;
  activePositions: number;
  totalRewardsEarned: number;
  totalValueLocked: number;
  averageStakingDuration: number;
}

interface PendingRewards {
  totalPendingRewards: number;
  positionRewards: Array<{
    positionId: string;
    nftId: string;
    pendingRewards: number;
    nextRewardDate: string;
  }>;
}

const StakingDashboard: React.FC = () => {
  const [portfolio, setPortfolio] = useState<{
    positions: StakingPosition[];
    summary: PortfolioSummary;
  } | null>(null);
  const [pendingRewards, setPendingRewards] = useState<PendingRewards | null>(null);
  const [stakingContracts, setStakingContracts] = useState<StakingContract[]>([]);
  const [eligibleNFTs, setEligibleNFTs] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [selectedContract, setSelectedContract] = useState<string>('');
  const [selectedDuration, setSelectedDuration] = useState<number>(6);
  const [stakingLoading, setStakingLoading] = useState(false);

  const { isOpen: isStakeOpen, onOpen: onStakeOpen, onClose: onStakeClose } = useDisclosure();
  const { isOpen: isDetailsOpen, onOpen: onDetailsOpen, onClose: onDetailsClose } = useDisclosure();
  const [selectedPosition, setSelectedPosition] = useState<StakingPosition | null>(null);

  const durations = [
    { key: 6, label: '6 Months', description: 'Short-term staking' },
    { key: 12, label: '12 Months', description: 'Medium-term staking' },
    { key: 36, label: '3 Years', description: 'Long-term staking' }
  ];

  useEffect(() => {
    fetchPortfolio();
    fetchPendingRewards();
    fetchStakingContracts();
    fetchEligibleNFTs();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const response = await fetch('/api/staking/portfolio', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch portfolio');
      }

      const data = await response.json();
      setPortfolio(data.data);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      toast.error('Failed to load staking portfolio');
    }
  };

  const fetchPendingRewards = async () => {
    try {
      const response = await fetch('/api/staking/rewards/pending', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch pending rewards');
      }

      const data = await response.json();
      setPendingRewards(data.data);
    } catch (error) {
      console.error('Error fetching pending rewards:', error);
      toast.error('Failed to load pending rewards');
    } finally {
      setLoading(false);
    }
  };

  const fetchStakingContracts = async () => {
    try {
      const response = await fetch('/api/staking/contracts', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch staking contracts');
      }

      const data = await response.json();
      setStakingContracts(data.data);
    } catch (error) {
      console.error('Error fetching staking contracts:', error);
      toast.error('Failed to load staking contracts');
    }
  };

  const fetchEligibleNFTs = async () => {
    try {
      // This would integrate with the Gaming NFT Service to get user's NFTs
      // For now, we'll simulate the API call
      const response = await fetch('/api/user/nfts/eligible-for-staking', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setEligibleNFTs(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching eligible NFTs:', error);
      // Don't show error toast for this as it's not critical
    }
  };

  const handleStakeNFT = async () => {
    if (!selectedNFT || !selectedContract) {
      toast.error('Please select an NFT and staking contract');
      return;
    }

    try {
      setStakingLoading(true);
      const response = await fetch('/api/staking/stake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          contractId: selectedContract,
          nftData: {
            contractAddress: selectedNFT.contractAddress,
            tokenId: selectedNFT.tokenId,
            blockchain: selectedNFT.blockchain,
            metadata: selectedNFT
          },
          stakingDuration: selectedDuration
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to stake NFT');
      }

      toast.success('NFT staked successfully!');
      onStakeClose();
      setSelectedNFT(null);
      setSelectedContract('');
      setSelectedDuration(6);
      
      // Refresh data
      fetchPortfolio();
      fetchPendingRewards();
      fetchEligibleNFTs();
    } catch (error) {
      console.error('Error staking NFT:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to stake NFT');
    } finally {
      setStakingLoading(false);
    }
  };

  const handleUnstakeNFT = async (positionId: string) => {
    try {
      const response = await fetch(`/api/staking/unstake/${positionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({})
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to unstake NFT');
      }

      toast.success('NFT unstaked successfully!');
      
      // Refresh data
      fetchPortfolio();
      fetchPendingRewards();
      fetchEligibleNFTs();
    } catch (error) {
      console.error('Error unstaking NFT:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to unstake NFT');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'unstaked': return 'default';
      case 'expired': return 'warning';
      default: return 'default';
    }
  };

  const getDurationLabel = (months: number) => {
    if (months === 6) return '6 Months';
    if (months === 12) return '12 Months';
    if (months === 36) return '3 Years';
    return `${months} Months`;
  };

  const calculateProjectedRewards = (contractId: string, duration: number) => {
    const contract = stakingContracts.find(c => c._id === contractId);
    if (!contract) return 0;

    const durationKey = duration === 6 ? 'sixMonths' : duration === 12 ? 'twelveMonths' : 'threeYears';
    const structure = contract.rewardStructures[durationKey];
    
    return structure.openEntryTicketsPerMonth * duration;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">NFT Staking Portfolio</h1>
          <p className="text-gray-600">Stake your NFTs to earn rewards and bonuses</p>
        </div>
        <Button
          color="primary"
          startContent={<PlusIcon className="w-4 h-4" />}
          onClick={onStakeOpen}
          isDisabled={eligibleNFTs.length === 0}
        >
          Stake NFT
        </Button>
      </div>

      {/* Summary Cards */}
      {portfolio && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Positions</p>
                  <p className="text-2xl font-bold">{portfolio.summary.activePositions}</p>
                </div>
                <WalletIcon className="w-8 h-8 text-blue-500" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Rewards</p>
                  <p className="text-2xl font-bold text-green-600">{portfolio.summary.totalRewardsEarned}</p>
                </div>
                <GiftIcon className="w-8 h-8 text-green-500" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Rewards</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {pendingRewards?.totalPendingRewards || 0}
                  </p>
                </div>
                <ClockIcon className="w-8 h-8 text-orange-500" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Duration</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {portfolio.summary.averageStakingDuration.toFixed(1)}m
                  </p>
                </div>
                <ChartBarIcon className="w-8 h-8 text-purple-500" />
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Staking Positions */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Your Staking Positions</h2>
        </CardHeader>
        <CardBody>
          {portfolio && portfolio.positions.length > 0 ? (
            <Table aria-label="Staking positions table">
              <TableHeader>
                <TableColumn>NFT</TableColumn>
                <TableColumn>CONTRACT</TableColumn>
                <TableColumn>DURATION</TableColumn>
                <TableColumn>PROGRESS</TableColumn>
                <TableColumn>REWARDS</TableColumn>
                <TableColumn>STATUS</TableColumn>
                <TableColumn>ACTIONS</TableColumn>
              </TableHeader>
              <TableBody>
                {portfolio.positions.map((position) => (
                  <TableRow key={position._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Image
                          src={position.nftMetadata.image}
                          alt={position.nftMetadata.name}
                          className="w-12 h-12 rounded-lg object-cover"
                          fallbackSrc="/placeholder-nft.png"
                        />
                        <div>
                          <p className="font-medium">{position.nftMetadata.name}</p>
                          <p className="text-sm text-gray-500">
                            #{position.nftTokenId}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{position.stakingContractId.contractName}</p>
                        <Chip size="sm" variant="flat" color="primary">
                          {position.blockchain.toUpperCase()}
                        </Chip>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{getDurationLabel(position.stakingDuration)}</p>
                        <p className="text-sm text-gray-500">
                          {position.remainingDays} days left
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="w-full">
                        <Progress
                          value={position.stakingProgress}
                          color="success"
                          size="sm"
                          className="mb-1"
                        />
                        <p className="text-xs text-gray-500">
                          {position.stakingProgress.toFixed(1)}% complete
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{position.totalRewardsEarned}</p>
                        <p className="text-sm text-gray-500">tickets earned</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Chip size="sm" color={getStatusColor(position.status)}>
                        {position.status.toUpperCase()}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="light"
                          startContent={<EyeIcon className="w-4 h-4" />}
                          onClick={() => {
                            setSelectedPosition(position);
                            onDetailsOpen();
                          }}
                        >
                          Details
                        </Button>
                        {position.status === 'active' && position.remainingDays <= 0 && (
                          <Button
                            size="sm"
                            color="success"
                            onClick={() => handleUnstakeNFT(position._id)}
                          >
                            Unstake
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <WalletIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No staking positions yet</p>
              <Button
                color="primary"
                onClick={onStakeOpen}
                isDisabled={eligibleNFTs.length === 0}
              >
                Stake Your First NFT
              </Button>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Stake NFT Modal */}
      <Modal isOpen={isStakeOpen} onClose={onStakeClose} size="2xl">
        <ModalContent>
          <ModalHeader>Stake NFT</ModalHeader>
          <ModalBody>
            <Tabs>
              <Tab key="select-nft" title="Select NFT">
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Choose an NFT from your wallet to stake
                  </p>
                  {eligibleNFTs.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                      {eligibleNFTs.map((nft) => (
                        <Card
                          key={`${nft.contractAddress}-${nft.tokenId}`}
                          isPressable
                          isHoverable
                          className={`cursor-pointer ${
                            selectedNFT?.tokenId === nft.tokenId ? 'ring-2 ring-primary' : ''
                          }`}
                          onClick={() => setSelectedNFT(nft)}
                        >
                          <CardBody className="p-3">
                            <Image
                              src={nft.image}
                              alt={nft.name}
                              className="w-full h-32 object-cover rounded-lg mb-2"
                              fallbackSrc="/placeholder-nft.png"
                            />
                            <p className="font-medium text-sm truncate">{nft.name}</p>
                            <p className="text-xs text-gray-500">#{nft.tokenId}</p>
                          </CardBody>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No eligible NFTs found in your wallet</p>
                    </div>
                  )}
                </div>
              </Tab>
              <Tab key="configure" title="Configure Staking">
                <div className="space-y-4">
                  <Select
                    label="Staking Contract"
                    placeholder="Select a staking contract"
                    selectedKeys={selectedContract ? [selectedContract] : []}
                    onSelectionChange={(keys) => {
                      const selected = Array.from(keys)[0] as string;
                      setSelectedContract(selected);
                    }}
                  >
                    {stakingContracts.map((contract) => (
                      <SelectItem key={contract._id} value={contract._id}>
                        <div>
                          <p>{contract.contractName}</p>
                          <p className="text-sm text-gray-500">{contract.blockchain.toUpperCase()}</p>
                        </div>
                      </SelectItem>
                    ))}
                  </Select>

                  <Select
                    label="Staking Duration"
                    placeholder="Select staking duration"
                    selectedKeys={[selectedDuration.toString()]}
                    onSelectionChange={(keys) => {
                      const selected = Array.from(keys)[0] as string;
                      setSelectedDuration(parseInt(selected));
                    }}
                  >
                    {durations.map((duration) => (
                      <SelectItem key={duration.key.toString()} value={duration.key.toString()}>
                        <div>
                          <p>{duration.label}</p>
                          <p className="text-sm text-gray-500">{duration.description}</p>
                        </div>
                      </SelectItem>
                    ))}
                  </Select>

                  {selectedContract && (
                    <Card>
                      <CardBody>
                        <h4 className="font-medium mb-2">Projected Rewards</h4>
                        <p className="text-2xl font-bold text-green-600">
                          {calculateProjectedRewards(selectedContract, selectedDuration)} tickets
                        </p>
                        <p className="text-sm text-gray-500">
                          Over {selectedDuration} months of staking
                        </p>
                      </CardBody>
                    </Card>
                  )}
                </div>
              </Tab>
            </Tabs>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onStakeClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={handleStakeNFT}
              isLoading={stakingLoading}
              isDisabled={!selectedNFT || !selectedContract}
            >
              Stake NFT
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Position Details Modal */}
      <Modal isOpen={isDetailsOpen} onClose={onDetailsClose} size="2xl">
        <ModalContent>
          <ModalHeader>Staking Position Details</ModalHeader>
          <ModalBody>
            {selectedPosition && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Image
                    src={selectedPosition.nftMetadata.image}
                    alt={selectedPosition.nftMetadata.name}
                    className="w-20 h-20 rounded-lg object-cover"
                    fallbackSrc="/placeholder-nft.png"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{selectedPosition.nftMetadata.name}</h3>
                    <p className="text-gray-600">Token ID: #{selectedPosition.nftTokenId}</p>
                    <Chip size="sm" variant="flat" color="primary">
                      {selectedPosition.blockchain.toUpperCase()}
                    </Chip>
                  </div>
                </div>

                <Divider />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Staking Contract</p>
                    <p className="font-medium">{selectedPosition.stakingContractId.contractName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-medium">{getDurationLabel(selectedPosition.stakingDuration)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Staked Date</p>
                    <p className="font-medium">{new Date(selectedPosition.stakedAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Unstake Date</p>
                    <p className="font-medium">{new Date(selectedPosition.unstakeAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">Staking Progress</p>
                  <Progress
                    value={selectedPosition.stakingProgress}
                    color="success"
                    size="md"
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm">
                    <span>{selectedPosition.stakingProgress.toFixed(1)}% complete</span>
                    <span>{selectedPosition.remainingDays} days remaining</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Total Rewards Earned</p>
                    <p className="text-2xl font-bold text-green-600">{selectedPosition.totalRewardsEarned}</p>
                    <p className="text-sm text-gray-500">raffle tickets</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <Chip color={getStatusColor(selectedPosition.status)}>
                      {selectedPosition.status.toUpperCase()}
                    </Chip>
                  </div>
                </div>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onPress={onDetailsClose}>
              Close
            </Button>
            {selectedPosition?.status === 'active' && selectedPosition.remainingDays <= 0 && (
              <Button
                color="success"
                onClick={() => {
                  handleUnstakeNFT(selectedPosition._id);
                  onDetailsClose();
                }}
              >
                Unstake NFT
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default StakingDashboard;