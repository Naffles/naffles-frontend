import React, { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Select,
  SelectItem,
  Slider,
  Button,
  Divider,
  Chip,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell
} from '@nextui-org/react';
import { CalculatorIcon, TrendingUpIcon } from '@heroicons/react/24/outline';

interface StakingContract {
  _id: string;
  contractName: string;
  contractAddress: string;
  blockchain: string;
  rewardStructures: {
    sixMonths: { openEntryTicketsPerMonth: number; bonusMultiplier: number };
    twelveMonths: { openEntryTicketsPerMonth: number; bonusMultiplier: number };
    threeYears: { openEntryTicketsPerMonth: number; bonusMultiplier: number };
  };
}

interface RewardCalculation {
  duration: number;
  monthlyTickets: number;
  totalTickets: number;
  bonusMultiplier: number;
  effectiveValue: number;
  estimatedUSDValue: number;
}

const RewardsCalculator: React.FC = () => {
  const [stakingContracts, setStakingContracts] = useState<StakingContract[]>([]);
  const [selectedContract, setSelectedContract] = useState<string>('');
  const [nftCount, setNftCount] = useState<number>(1);
  const [calculations, setCalculations] = useState<RewardCalculation[]>([]);
  const [ticketValue, setTicketValue] = useState<number>(5); // Estimated USD value per ticket

  useEffect(() => {
    fetchStakingContracts();
  }, []);

  useEffect(() => {
    if (selectedContract) {
      calculateRewards();
    }
  }, [selectedContract, nftCount]);

  const fetchStakingContracts = async () => {
    try {
      const response = await fetch('/api/staking/contracts', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStakingContracts(data.data || []);
        if (data.data && data.data.length > 0) {
          setSelectedContract(data.data[0]._id);
        }
      }
    } catch (error) {
      console.error('Error fetching staking contracts:', error);
    }
  };

  const calculateRewards = () => {
    const contract = stakingContracts.find(c => c._id === selectedContract);
    if (!contract) return;

    const durations = [
      { months: 6, key: 'sixMonths' as const },
      { months: 12, key: 'twelveMonths' as const },
      { months: 36, key: 'threeYears' as const }
    ];

    const newCalculations = durations.map(({ months, key }) => {
      const structure = contract.rewardStructures[key];
      const monthlyTickets = structure.openEntryTicketsPerMonth * nftCount;
      const totalTickets = monthlyTickets * months;
      const effectiveValue = totalTickets * structure.bonusMultiplier;
      const estimatedUSDValue = effectiveValue * ticketValue;

      return {
        duration: months,
        monthlyTickets,
        totalTickets,
        bonusMultiplier: structure.bonusMultiplier,
        effectiveValue,
        estimatedUSDValue
      };
    });

    setCalculations(newCalculations);
  };

  const getDurationLabel = (months: number) => {
    if (months === 6) return '6 Months';
    if (months === 12) return '12 Months';
    if (months === 36) return '3 Years';
    return `${months} Months`;
  };

  const getRecommendation = () => {
    if (calculations.length === 0) return null;

    const bestValue = calculations.reduce((best, current) => 
      current.effectiveValue > best.effectiveValue ? current : best
    );

    const bestROI = calculations.reduce((best, current) => {
      const roi = current.effectiveValue / current.duration;
      const bestROI = best.effectiveValue / best.duration;
      return roi > bestROI ? current : best;
    });

    return { bestValue, bestROI };
  };

  const recommendation = getRecommendation();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CalculatorIcon className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Staking Rewards Calculator</h2>
          </div>
        </CardHeader>
        <CardBody className="space-y-6">
          {/* Configuration */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              <div>
                <label className="block text-sm font-medium mb-2">
                  Number of NFTs: {nftCount}
                </label>
                <Slider
                  size="md"
                  step={1}
                  minValue={1}
                  maxValue={10}
                  value={nftCount}
                  onChange={(value) => setNftCount(Array.isArray(value) ? value[0] : value)}
                  className="max-w-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Estimated Ticket Value (USD): ${ticketValue}
                </label>
                <Slider
                  size="md"
                  step={0.5}
                  minValue={1}
                  maxValue={20}
                  value={ticketValue}
                  onChange={(value) => setTicketValue(Array.isArray(value) ? value[0] : value)}
                  className="max-w-md"
                />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-4">
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
                <CardBody>
                  <h3 className="font-semibold mb-2">Quick Comparison</h3>
                  {calculations.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Best Total Value:</span>
                        <span className="font-medium">
                          {getDurationLabel(recommendation?.bestValue.duration || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Best Monthly ROI:</span>
                        <span className="font-medium">
                          {getDurationLabel(recommendation?.bestROI.duration || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Max Estimated Value:</span>
                        <span className="font-medium text-green-600">
                          ${recommendation?.bestValue.estimatedUSDValue.toFixed(2) || '0'}
                        </span>
                      </div>
                    </div>
                  )}
                </CardBody>
              </Card>

              {recommendation && (
                <Card className="bg-gradient-to-r from-green-50 to-emerald-50">
                  <CardBody>
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUpIcon className="w-4 h-4 text-green-600" />
                      <h3 className="font-semibold text-green-800">Recommendation</h3>
                    </div>
                    <p className="text-sm text-green-700">
                      For maximum rewards, consider staking for{' '}
                      <strong>{getDurationLabel(recommendation.bestValue.duration)}</strong> to earn{' '}
                      <strong>{recommendation.bestValue.effectiveValue.toFixed(1)} effective tickets</strong>.
                    </p>
                  </CardBody>
                </Card>
              )}
            </div>
          </div>

          <Divider />

          {/* Results Table */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Reward Calculations</h3>
            {calculations.length > 0 ? (
              <Table aria-label="Reward calculations">
                <TableHeader>
                  <TableColumn>DURATION</TableColumn>
                  <TableColumn>MONTHLY TICKETS</TableColumn>
                  <TableColumn>TOTAL TICKETS</TableColumn>
                  <TableColumn>BONUS MULTIPLIER</TableColumn>
                  <TableColumn>EFFECTIVE VALUE</TableColumn>
                  <TableColumn>EST. USD VALUE</TableColumn>
                  <TableColumn>MONTHLY ROI</TableColumn>
                </TableHeader>
                <TableBody>
                  {calculations.map((calc) => (
                    <TableRow key={calc.duration}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{getDurationLabel(calc.duration)}</span>
                          {recommendation?.bestValue.duration === calc.duration && (
                            <Chip size="sm" color="success" variant="flat">
                              Best Value
                            </Chip>
                          )}
                          {recommendation?.bestROI.duration === calc.duration && 
                           recommendation.bestROI.duration !== recommendation.bestValue.duration && (
                            <Chip size="sm" color="primary" variant="flat">
                              Best ROI
                            </Chip>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{calc.monthlyTickets}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{calc.totalTickets}</span>
                      </TableCell>
                      <TableCell>
                        <Chip size="sm" variant="flat" color="secondary">
                          {calc.bonusMultiplier}x
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-green-600">
                          {calc.effectiveValue.toFixed(1)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-green-600">
                          ${calc.estimatedUSDValue.toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">
                          ${(calc.estimatedUSDValue / calc.duration).toFixed(2)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Select a staking contract to see reward calculations
              </div>
            )}
          </div>

          {/* Disclaimer */}
          <Card className="bg-yellow-50 border border-yellow-200">
            <CardBody>
              <p className="text-sm text-yellow-800">
                <strong>Disclaimer:</strong> These calculations are estimates based on current reward structures. 
                Actual rewards may vary based on market conditions, platform changes, and other factors. 
                The USD values are estimates and should not be considered financial advice.
              </p>
            </CardBody>
          </Card>
        </CardBody>
      </Card>
    </div>
  );
};

export default RewardsCalculator;