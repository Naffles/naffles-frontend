import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Button, Select, SelectItem, Input, Spinner, Chip, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/react';
import { toast } from 'react-hot-toast';

interface NafflesBalance {
  chainId: string;
  tokenSymbol: string;
  tokenContract: string;
  balance: string;
  balanceUSD?: number;
  isNativeToken: boolean;
  lastUpdated: string;
}

interface WithdrawalRequest {
  _id: string;
  chainId: string;
  tokenSymbol: string;
  tokenContract: string;
  amount: string;
  destinationAddress: string;
  status: 'pending' | 'approved' | 'rejected' | 'processing' | 'completed' | 'failed';
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
  txHash?: string;
}

interface WithdrawalScreenProps {
  userId: string;
  onWithdrawalComplete?: () => void;
}

const SUPPORTED_CHAINS = {
  'ethereum': { name: 'Ethereum', symbol: 'ETH', chainId: '1' },
  'polygon': { name: 'Polygon', symbol: 'MATIC', chainId: '137' },
  'base': { name: 'Base', symbol: 'ETH', chainId: '8453' },
  'solana': { name: 'Solana', symbol: 'SOL', chainId: 'solana-mainnet' }
};

const STATUS_COLORS = {
  pending: 'warning',
  approved: 'success',
  rejected: 'danger',
  processing: 'primary',
  completed: 'success',
  failed: 'danger'
} as const;

export default function WithdrawalScreen({ userId, onWithdrawalComplete }: WithdrawalScreenProps) {
  const [nafflesBalances, setNafflesBalances] = useState<NafflesBalance[]>([]);
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
  const [selectedToken, setSelectedToken] = useState<string>('');
  const [withdrawalAmount, setWithdrawalAmount] = useState<string>('');
  const [destinationAddress, setDestinationAddress] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingBalances, setIsLoadingBalances] = useState(true);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);

  useEffect(() => {
    loadBalances();
    loadWithdrawalRequests();
  }, [userId]);

  const loadBalances = async () => {
    setIsLoadingBalances(true);
    try {
      const response = await fetch(`/api/fund-management/balances/${userId}`);
      const data = await response.json();
      
      if (data.success) {
        // Filter out zero balances
        const nonZeroBalances = data.data.filter((balance: NafflesBalance) => 
          parseFloat(balance.balance) > 0
        );
        setNafflesBalances(nonZeroBalances);
      }
    } catch (error) {
      console.error('Error loading balances:', error);
      toast.error('Failed to load balances');
    } finally {
      setIsLoadingBalances(false);
    }
  };

  const loadWithdrawalRequests = async () => {
    setIsLoadingRequests(true);
    try {
      const response = await fetch(`/api/fund-management/withdrawals/${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setWithdrawalRequests(data.data);
      }
    } catch (error) {
      console.error('Error loading withdrawal requests:', error);
      toast.error('Failed to load withdrawal history');
    } finally {
      setIsLoadingRequests(false);
    }
  };

  const handleWithdrawal = async () => {
    if (!selectedToken || !withdrawalAmount || !destinationAddress) {
      toast.error('Please fill in all fields');
      return;
    }

    const selectedBalance = nafflesBalances.find(b => 
      `${b.chainId}-${b.tokenContract}` === selectedToken
    );

    if (!selectedBalance) {
      toast.error('Selected token not found');
      return;
    }

    if (parseFloat(withdrawalAmount) > parseFloat(selectedBalance.balance)) {
      toast.error('Insufficient balance');
      return;
    }

    if (parseFloat(withdrawalAmount) <= 0) {
      toast.error('Amount must be greater than 0');
      return;
    }

    // Validate destination address format
    if (!isValidAddress(destinationAddress, selectedBalance.chainId)) {
      toast.error('Invalid destination address format');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/fund-management/withdrawal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          chainId: selectedBalance.chainId,
          tokenSymbol: selectedBalance.tokenSymbol,
          tokenContract: selectedBalance.tokenContract,
          amount: withdrawalAmount,
          destinationAddress: destinationAddress.trim()
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Withdrawal request submitted successfully!');
        
        // Refresh data
        await loadBalances();
        await loadWithdrawalRequests();
        
        // Reset form
        setSelectedToken('');
        setWithdrawalAmount('');
        setDestinationAddress('');
        
        if (onWithdrawalComplete) {
          onWithdrawalComplete();
        }
      } else {
        throw new Error(data.error || 'Failed to create withdrawal request');
      }
    } catch (error) {
      console.error('Withdrawal error:', error);
      toast.error(error.message || 'Withdrawal request failed');
    } finally {
      setIsLoading(false);
    }
  };

  const isValidAddress = (address: string, chainId: string): boolean => {
    if (!address || address.trim().length === 0) return false;

    try {
      if (chainId === 'solana-mainnet') {
        // Solana address validation (base58, 32-44 characters)
        return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address.trim());
      } else {
        // Ethereum-based address validation (0x + 40 hex characters)
        return /^0x[a-fA-F0-9]{40}$/.test(address.trim());
      }
    } catch {
      return false;
    }
  };

  const formatBalance = (balance: string, decimals: number = 6): string => {
    const num = parseFloat(balance);
    if (num === 0) return '0';
    if (num < 0.000001) return '< 0.000001';
    return num.toFixed(decimals);
  };

  const getChainName = (chainId: string): string => {
    const chain = Object.values(SUPPORTED_CHAINS).find(c => c.chainId === chainId);
    return chain?.name || chainId;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAddressPlaceholder = (chainId: string): string => {
    if (chainId === 'solana-mainnet') {
      return 'Enter Solana wallet address (e.g., 9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM)';
    }
    return 'Enter wallet address (e.g., 0x742d35Cc6634C0532925a3b8D4C9db96DfbB8b2e)';
  };

  if (isLoadingBalances) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Withdraw Funds</h1>
        <p className="text-gray-600">Transfer cryptocurrency from your Naffles account to your wallet</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Balances */}
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Available Balances</h3>
          </CardHeader>
          <CardBody>
            {nafflesBalances.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No available balances for withdrawal</p>
              </div>
            ) : (
              <div className="space-y-3">
                {nafflesBalances.map((balance, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">{balance.tokenSymbol}</div>
                      <div className="text-sm text-gray-500">{getChainName(balance.chainId)}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatBalance(balance.balance)}</div>
                      {balance.balanceUSD && (
                        <div className="text-sm text-gray-500">${balance.balanceUSD.toFixed(2)}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Withdrawal Form */}
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Create Withdrawal Request</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <Select
              label="Select Token"
              placeholder="Choose a token to withdraw"
              value={selectedToken}
              onChange={(e) => setSelectedToken(e.target.value)}
              isDisabled={nafflesBalances.length === 0}
            >
              {nafflesBalances.map((balance, index) => (
                <SelectItem 
                  key={`${balance.chainId}-${balance.tokenContract}`} 
                  value={`${balance.chainId}-${balance.tokenContract}`}
                >
                  {balance.tokenSymbol} ({getChainName(balance.chainId)}) - Available: {formatBalance(balance.balance)}
                </SelectItem>
              ))}
            </Select>

            <Input
              type="number"
              label="Withdrawal Amount"
              placeholder="Enter amount to withdraw"
              value={withdrawalAmount}
              onChange={(e) => setWithdrawalAmount(e.target.value)}
              endContent={
                selectedToken && (
                  <Button
                    size="sm"
                    variant="light"
                    onClick={() => {
                      const balance = nafflesBalances.find(b => `${b.chainId}-${b.tokenContract}` === selectedToken);
                      if (balance) setWithdrawalAmount(balance.balance);
                    }}
                  >
                    Max
                  </Button>
                )
              }
            />

            <Input
              label="Destination Address"
              placeholder={selectedToken ? getAddressPlaceholder(
                nafflesBalances.find(b => `${b.chainId}-${b.tokenContract}` === selectedToken)?.chainId || ''
              ) : 'Select a token first'}
              value={destinationAddress}
              onChange={(e) => setDestinationAddress(e.target.value)}
            />

            {selectedToken && withdrawalAmount && destinationAddress && (
              <div className="p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800 mb-2">
                  <strong>Important:</strong> Withdrawal requests require admin approval.
                </p>
                <p className="text-sm text-yellow-800">
                  You will withdraw {withdrawalAmount} {nafflesBalances.find(b => `${b.chainId}-${b.tokenContract}` === selectedToken)?.tokenSymbol} 
                  to {destinationAddress.slice(0, 10)}...{destinationAddress.slice(-8)}
                </p>
              </div>
            )}

            <Button
              color="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
              isDisabled={!selectedToken || !withdrawalAmount || !destinationAddress || parseFloat(withdrawalAmount) <= 0}
              onClick={handleWithdrawal}
            >
              {isLoading ? 'Submitting Request...' : 'Submit Withdrawal Request'}
            </Button>
          </CardBody>
        </Card>
      </div>

      {/* Withdrawal History */}
      <Card>
        <CardHeader>
          <h3 className="text-xl font-semibold">Withdrawal History</h3>
        </CardHeader>
        <CardBody>
          {isLoadingRequests ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : withdrawalRequests.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No withdrawal requests found</p>
            </div>
          ) : (
            <Table aria-label="Withdrawal requests table">
              <TableHeader>
                <TableColumn>DATE</TableColumn>
                <TableColumn>TOKEN</TableColumn>
                <TableColumn>AMOUNT</TableColumn>
                <TableColumn>DESTINATION</TableColumn>
                <TableColumn>STATUS</TableColumn>
                <TableColumn>TX HASH</TableColumn>
              </TableHeader>
              <TableBody>
                {withdrawalRequests.map((request) => (
                  <TableRow key={request._id}>
                    <TableCell>{formatDate(request.createdAt)}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{request.tokenSymbol}</div>
                        <div className="text-sm text-gray-500">{getChainName(request.chainId)}</div>
                      </div>
                    </TableCell>
                    <TableCell>{formatBalance(request.amount)}</TableCell>
                    <TableCell>
                      <span className="font-mono text-sm">
                        {request.destinationAddress.slice(0, 6)}...{request.destinationAddress.slice(-4)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        color={STATUS_COLORS[request.status]} 
                        size="sm"
                        variant="flat"
                      >
                        {request.status.toUpperCase()}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      {request.txHash ? (
                        <a 
                          href={`#`} // TODO: Add blockchain explorer links
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 font-mono text-sm"
                        >
                          {request.txHash.slice(0, 8)}...
                        </a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardBody>
      </Card>
    </div>
  );
}