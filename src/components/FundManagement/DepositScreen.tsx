import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Button, Select, SelectItem, Input, Spinner, Chip } from '@nextui-org/react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useConnection } from '@solana/wallet-adapter-react';
import { ethers } from 'ethers';
import { toast } from 'react-hot-toast';

interface TokenBalance {
  symbol: string;
  balance: string;
  contract: string;
  decimals: number;
  isNative: boolean;
  chainId: string;
  usdValue?: number;
}

interface NafflesBalance {
  chainId: string;
  tokenSymbol: string;
  tokenContract: string;
  balance: string;
  balanceUSD?: number;
  isNativeToken: boolean;
  lastUpdated: string;
}

interface DepositScreenProps {
  userId: string;
  onDepositComplete?: () => void;
}

const SUPPORTED_CHAINS = {
  'ethereum': { name: 'Ethereum', symbol: 'ETH', chainId: '1' },
  'polygon': { name: 'Polygon', symbol: 'MATIC', chainId: '137' },
  'base': { name: 'Base', symbol: 'ETH', chainId: '8453' },
  'solana': { name: 'Solana', symbol: 'SOL', chainId: 'solana-mainnet' }
};

export default function DepositScreen({ userId, onDepositComplete }: DepositScreenProps) {
  const [walletBalances, setWalletBalances] = useState<TokenBalance[]>([]);
  const [nafflesBalances, setNafflesBalances] = useState<NafflesBalance[]>([]);
  const [selectedToken, setSelectedToken] = useState<string>('');
  const [depositAmount, setDepositAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingBalances, setIsLoadingBalances] = useState(true);
  const [connectedWallets, setConnectedWallets] = useState<any[]>([]);
  
  const { wallet: solanaWallet, connected: solanaConnected } = useWallet();
  const { connection } = useConnection();

  useEffect(() => {
    loadBalances();
    detectConnectedWallets();
  }, [userId]);

  const detectConnectedWallets = async () => {
    const wallets = [];

    // Check for MetaMask (Ethereum-based)
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const network = await provider.getNetwork();
          wallets.push({
            type: 'metamask',
            address: accounts[0],
            chainId: network.chainId.toString(),
            provider
          });
        }
      } catch (error) {
        console.error('Error detecting MetaMask:', error);
      }
    }

    // Check for Phantom (Solana)
    if (solanaConnected && solanaWallet?.adapter?.publicKey) {
      wallets.push({
        type: 'phantom',
        address: solanaWallet.adapter.publicKey.toString(),
        chainId: 'solana-mainnet',
        connection
      });
    }

    setConnectedWallets(wallets);
  };

  const loadBalances = async () => {
    setIsLoadingBalances(true);
    try {
      // Load wallet balances
      await loadWalletBalances();
      
      // Load Naffles account balances
      const response = await fetch(`/api/fund-management/balances/${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setNafflesBalances(data.data);
      }
    } catch (error) {
      console.error('Error loading balances:', error);
      toast.error('Failed to load balances');
    } finally {
      setIsLoadingBalances(false);
    }
  };

  const loadWalletBalances = async () => {
    const balances: TokenBalance[] = [];

    for (const wallet of connectedWallets) {
      try {
        if (wallet.type === 'metamask') {
          const evmBalances = await getEVMBalances(wallet);
          balances.push(...evmBalances);
        } else if (wallet.type === 'phantom') {
          const solanaBalances = await getSolanaBalances(wallet);
          balances.push(...solanaBalances);
        }
      } catch (error) {
        console.error(`Error loading ${wallet.type} balances:`, error);
      }
    }

    setWalletBalances(balances);
  };

  const getEVMBalances = async (wallet: any): Promise<TokenBalance[]> => {
    const balances: TokenBalance[] = [];
    const provider = wallet.provider;

    try {
      // Get native token balance
      const nativeBalance = await provider.getBalance(wallet.address);
      const chainInfo = Object.values(SUPPORTED_CHAINS).find(c => c.chainId === wallet.chainId);
      
      if (chainInfo) {
        balances.push({
          symbol: chainInfo.symbol,
          balance: ethers.formatEther(nativeBalance),
          contract: 'native',
          decimals: 18,
          isNative: true,
          chainId: wallet.chainId
        });
      }

      // TODO: Add ERC20 token balances based on supported tokens
      // This would require fetching supported tokens from the backend
      
    } catch (error) {
      console.error('Error getting EVM balances:', error);
    }

    return balances;
  };

  const getSolanaBalances = async (wallet: any): Promise<TokenBalance[]> => {
    const balances: TokenBalance[] = [];

    try {
      // Get SOL balance
      const solBalance = await wallet.connection.getBalance(wallet.address);
      balances.push({
        symbol: 'SOL',
        balance: (solBalance / 1e9).toString(),
        contract: 'native',
        decimals: 9,
        isNative: true,
        chainId: 'solana-mainnet'
      });

      // TODO: Add SPL token balances
      
    } catch (error) {
      console.error('Error getting Solana balances:', error);
    }

    return balances;
  };

  const handleDeposit = async () => {
    if (!selectedToken || !depositAmount) {
      toast.error('Please select a token and enter an amount');
      return;
    }

    const selectedTokenData = walletBalances.find(t => 
      `${t.chainId}-${t.contract}` === selectedToken
    );

    if (!selectedTokenData) {
      toast.error('Selected token not found');
      return;
    }

    if (parseFloat(depositAmount) > parseFloat(selectedTokenData.balance)) {
      toast.error('Insufficient balance');
      return;
    }

    setIsLoading(true);

    try {
      // Get treasury address for the chain
      const treasuryResponse = await fetch(`/api/fund-management/treasury/address/${selectedTokenData.chainId}`);
      const treasuryData = await treasuryResponse.json();
      
      if (!treasuryData.success) {
        throw new Error('Failed to get treasury address');
      }

      const treasuryAddress = treasuryData.data.address;

      // Execute the deposit transaction
      let txHash: string;
      
      if (selectedTokenData.isNative) {
        txHash = await executeNativeTokenDeposit(selectedTokenData, treasuryAddress);
      } else {
        txHash = await executeTokenDeposit(selectedTokenData, treasuryAddress);
      }

      // Monitor the transaction
      await monitorDepositTransaction(txHash, selectedTokenData.chainId);
      
      toast.success('Deposit initiated successfully!');
      
      // Refresh balances
      await loadBalances();
      
      // Reset form
      setSelectedToken('');
      setDepositAmount('');
      
      if (onDepositComplete) {
        onDepositComplete();
      }
      
    } catch (error) {
      console.error('Deposit error:', error);
      toast.error(error.message || 'Deposit failed');
    } finally {
      setIsLoading(false);
    }
  };

  const executeNativeTokenDeposit = async (tokenData: TokenBalance, treasuryAddress: string): Promise<string> => {
    const wallet = connectedWallets.find(w => w.chainId === tokenData.chainId);
    
    if (!wallet) {
      throw new Error('Wallet not connected for this chain');
    }

    if (wallet.type === 'metamask') {
      const signer = await wallet.provider.getSigner();
      const tx = await signer.sendTransaction({
        to: treasuryAddress,
        value: ethers.parseEther(depositAmount)
      });
      return tx.hash;
    } else if (wallet.type === 'phantom') {
      // Solana native transfer
      const { SystemProgram, Transaction, PublicKey } = await import('@solana/web3.js');
      
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(wallet.address),
          toPubkey: new PublicKey(treasuryAddress),
          lamports: parseFloat(depositAmount) * 1e9
        })
      );

      const signature = await solanaWallet?.adapter.sendTransaction(transaction, wallet.connection);
      return signature || '';
    }

    throw new Error('Unsupported wallet type');
  };

  const executeTokenDeposit = async (tokenData: TokenBalance, treasuryAddress: string): Promise<string> => {
    const wallet = connectedWallets.find(w => w.chainId === tokenData.chainId);
    
    if (!wallet) {
      throw new Error('Wallet not connected for this chain');
    }

    if (wallet.type === 'metamask') {
      // ERC20 transfer
      const signer = await wallet.provider.getSigner();
      const tokenContract = new ethers.Contract(
        tokenData.contract,
        ['function transfer(address to, uint256 amount) returns (bool)'],
        signer
      );

      const amount = ethers.parseUnits(depositAmount, tokenData.decimals);
      const tx = await tokenContract.transfer(treasuryAddress, amount);
      return tx.hash;
    } else if (wallet.type === 'phantom') {
      // SPL token transfer
      const { getAssociatedTokenAddress, createTransferInstruction, TOKEN_PROGRAM_ID } = await import('@solana/spl-token');
      const { Transaction, PublicKey } = await import('@solana/web3.js');
      
      const mintPubkey = new PublicKey(tokenData.contract);
      const fromTokenAccount = await getAssociatedTokenAddress(mintPubkey, new PublicKey(wallet.address));
      const toTokenAccount = await getAssociatedTokenAddress(mintPubkey, new PublicKey(treasuryAddress));
      
      const transaction = new Transaction().add(
        createTransferInstruction(
          fromTokenAccount,
          toTokenAccount,
          new PublicKey(wallet.address),
          parseFloat(depositAmount) * Math.pow(10, tokenData.decimals),
          [],
          TOKEN_PROGRAM_ID
        )
      );

      const signature = await solanaWallet?.adapter.sendTransaction(transaction, wallet.connection);
      return signature || '';
    }

    throw new Error('Unsupported wallet type for token transfer');
  };

  const monitorDepositTransaction = async (txHash: string, chainId: string) => {
    // Create a pending deposit record
    await fetch('/api/fund-management/deposits/pending', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        txHash,
        chainId,
        amount: depositAmount,
        tokenSymbol: walletBalances.find(t => `${t.chainId}-${t.contract}` === selectedToken)?.symbol
      })
    });
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

  if (isLoadingBalances) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Deposit Funds</h1>
        <p className="text-gray-600">Transfer cryptocurrency from your wallet to your Naffles account</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Wallet Balances */}
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Connected Wallet Balances</h3>
          </CardHeader>
          <CardBody>
            {connectedWallets.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No wallets connected</p>
                <Button color="primary" onClick={detectConnectedWallets}>
                  Detect Wallets
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {walletBalances.map((token, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">{token.symbol}</div>
                      <div className="text-sm text-gray-500">{getChainName(token.chainId)}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatBalance(token.balance)}</div>
                      {token.usdValue && (
                        <div className="text-sm text-gray-500">${token.usdValue.toFixed(2)}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Naffles Account Balances */}
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Naffles Account Balances</h3>
          </CardHeader>
          <CardBody>
            {nafflesBalances.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No balances found</p>
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
      </div>

      {/* Deposit Form */}
      <Card>
        <CardHeader>
          <h3 className="text-xl font-semibold">Make a Deposit</h3>
        </CardHeader>
        <CardBody className="space-y-4">
          <Select
            label="Select Token"
            placeholder="Choose a token to deposit"
            value={selectedToken}
            onChange={(e) => setSelectedToken(e.target.value)}
          >
            {walletBalances.map((token, index) => (
              <SelectItem 
                key={`${token.chainId}-${token.contract}`} 
                value={`${token.chainId}-${token.contract}`}
              >
                {token.symbol} ({getChainName(token.chainId)}) - Balance: {formatBalance(token.balance)}
              </SelectItem>
            ))}
          </Select>

          <Input
            type="number"
            label="Deposit Amount"
            placeholder="Enter amount to deposit"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            endContent={
              selectedToken && (
                <Button
                  size="sm"
                  variant="light"
                  onClick={() => {
                    const token = walletBalances.find(t => `${t.chainId}-${t.contract}` === selectedToken);
                    if (token) setDepositAmount(token.balance);
                  }}
                >
                  Max
                </Button>
              )
            }
          />

          {selectedToken && depositAmount && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                You will transfer {depositAmount} {walletBalances.find(t => `${t.chainId}-${t.contract}` === selectedToken)?.symbol} 
                from your wallet to the Naffles treasury wallet.
              </p>
            </div>
          )}

          <Button
            color="primary"
            size="lg"
            className="w-full"
            isLoading={isLoading}
            isDisabled={!selectedToken || !depositAmount || parseFloat(depositAmount) <= 0}
            onClick={handleDeposit}
          >
            {isLoading ? 'Processing Deposit...' : 'Deposit Funds'}
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}