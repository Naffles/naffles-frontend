'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardBody, 
  Button, 
  Input, 
  Select, 
  SelectItem,
  Textarea,
  Image,
  Alert
} from '@nextui-org/react';
import { colors, typography } from '@/styles/design-system/tokens';
import { 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';

interface PrizeConfigurationProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const PrizeConfiguration: React.FC<PrizeConfigurationProps> = ({
  data,
  onUpdate,
  onNext,
  onPrevious
}) => {
  const [tokenAmount, setTokenAmount] = useState(data.tokenPrize?.amount || '');
  const [selectedToken, setSelectedToken] = useState(data.tokenPrize?.token || '');
  const [nftContract, setNftContract] = useState(data.nftPrize?.contractAddress || '');
  const [nftTokenId, setNftTokenId] = useState(data.nftPrize?.tokenId || '');
  const [nftName, setNftName] = useState(data.nftPrize?.name || '');
  const [nftImage, setNftImage] = useState(data.nftPrize?.image || '');
  const [nafflings, setNafflings] = useState(data.nafflingsPrize?.amount || 0);
  const [userBalance, setUserBalance] = useState<any>({});
  const [validating, setValidating] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [validationSuccess, setValidationSuccess] = useState('');

  const supportedTokens = [
    { value: 'eth', label: 'Ethereum (ETH)', symbol: 'ETH' },
    { value: 'sol', label: 'Solana (SOL)', symbol: 'SOL' },
    { value: 'matic', label: 'Polygon (MATIC)', symbol: 'MATIC' },
    { value: 'usdc', label: 'USD Coin (USDC)', symbol: 'USDC' },
    { value: 'usdt', label: 'Tether (USDT)', symbol: 'USDT' }
  ];

  // Fetch user balances
  useEffect(() => {
    fetchUserBalances();
  }, []);

  const fetchUserBalances = async () => {
    try {
      const response = await fetch('/api/user/balances');
      if (response.ok) {
        const balances = await response.json();
        setUserBalance(balances);
      }
    } catch (error) {
      console.error('Error fetching balances:', error);
    }
  };

  const validateNFT = async () => {
    if (!nftContract || !nftTokenId) {
      setValidationError('Please enter both contract address and token ID');
      return;
    }

    setValidating(true);
    setValidationError('');
    setValidationSuccess('');

    try {
      const response = await fetch('/api/nft/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractAddress: nftContract,
          tokenId: nftTokenId
        })
      });

      const result = await response.json();

      if (response.ok && result.valid) {
        setNftName(result.name || '');
        setNftImage(result.image || '');
        setValidationSuccess('NFT validated successfully!');
      } else {
        setValidationError(result.message || 'Invalid NFT or you do not own this NFT');
      }
    } catch (error) {
      setValidationError('Failed to validate NFT');
    } finally {
      setValidating(false);
    }
  };

  const handleNext = () => {
    let prizeData: any = {};

    if (data.lotteryType === 'TOKEN') {
      if (!selectedToken || !tokenAmount || parseFloat(tokenAmount) <= 0) {
        setValidationError('Please select a token and enter a valid amount');
        return;
      }

      const balance = userBalance[selectedToken] || 0;
      if (parseFloat(tokenAmount) > balance) {
        setValidationError('Insufficient balance for this token amount');
        return;
      }

      prizeData = {
        tokenPrize: {
          token: selectedToken,
          amount: tokenAmount
        }
      };
    } else if (data.lotteryType === 'NFT') {
      if (!nftContract || !nftTokenId || !nftName) {
        setValidationError('Please validate your NFT first');
        return;
      }

      prizeData = {
        nftPrize: {
          contractAddress: nftContract,
          tokenId: nftTokenId,
          name: nftName,
          image: nftImage
        }
      };
    } else if (data.lotteryType === 'NAFFLINGS') {
      if (!nafflings || nafflings <= 0) {
        setValidationError('Please enter a valid Nafflings amount');
        return;
      }

      const balance = userBalance.nafflings || 0;
      if (nafflings > balance) {
        setValidationError('Insufficient Nafflings balance');
        return;
      }

      prizeData = {
        nafflingsPrize: {
          amount: nafflings
        }
      };
    }

    onUpdate(prizeData);
    onNext();
  };

  const renderTokenConfiguration = () => (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold" style={{ color: colors.gray[900] }}>
        Token Prize Configuration
      </h4>
      
      <Select
        label="Select Token"
        placeholder="Choose a token"
        selectedKeys={selectedToken ? [selectedToken] : []}
        onSelectionChange={(keys) => setSelectedToken(Array.from(keys)[0] as string)}
      >
        {supportedTokens.map((token) => (
          <SelectItem key={token.value} value={token.value}>
            <div className="flex justify-between items-center w-full">
              <span>{token.label}</span>
              <span className="text-sm text-gray-500">
                Balance: {(userBalance[token.value] || 0).toLocaleString()} {token.symbol}
              </span>
            </div>
          </SelectItem>
        ))}
      </Select>

      <Input
        type="number"
        label="Token Amount"
        placeholder="Enter amount to raffle"
        value={tokenAmount}
        onChange={(e) => setTokenAmount(e.target.value)}
        min="0"
        step="0.000001"
        endContent={
          selectedToken && (
            <span className="text-sm text-gray-500">
              {supportedTokens.find(t => t.value === selectedToken)?.symbol}
            </span>
          )
        }
      />

      {selectedToken && userBalance[selectedToken] !== undefined && (
        <div className="text-sm text-gray-600">
          Available balance: {userBalance[selectedToken].toLocaleString()} {
            supportedTokens.find(t => t.value === selectedToken)?.symbol
          }
        </div>
      )}
    </div>
  );

  const renderNFTConfiguration = () => (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold" style={{ color: colors.gray[900] }}>
        NFT Prize Configuration
      </h4>
      
      <Input
        label="Contract Address"
        placeholder="Enter NFT contract address"
        value={nftContract}
        onChange={(e) => setNftContract(e.target.value)}
      />

      <Input
        label="Token ID"
        placeholder="Enter NFT token ID"
        value={nftTokenId}
        onChange={(e) => setNftTokenId(e.target.value)}
      />

      <Button
        color="primary"
        variant="bordered"
        onPress={validateNFT}
        isLoading={validating}
        isDisabled={!nftContract || !nftTokenId}
      >
        Validate NFT
      </Button>

      {nftName && nftImage && (
        <Card>
          <CardBody className="p-4">
            <div className="flex gap-4">
              <Image
                src={nftImage}
                alt={nftName}
                width={80}
                height={80}
                className="rounded-lg object-cover"
                fallbackSrc="/images/default-nft.png"
              />
              <div>
                <h5 className="font-semibold" style={{ color: colors.gray[900] }}>
                  {nftName}
                </h5>
                <p className="text-sm" style={{ color: colors.gray[600] }}>
                  Contract: {nftContract.slice(0, 6)}...{nftContract.slice(-4)}
                </p>
                <p className="text-sm" style={{ color: colors.gray[600] }}>
                  Token ID: {nftTokenId}
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );

  const renderNafflingsConfiguration = () => (
    <div className="space-y-4">
      <h4 className="text-lg font-semibold" style={{ color: colors.gray[900] }}>
        Nafflings Prize Configuration
      </h4>
      
      <Input
        type="number"
        label="Nafflings Amount"
        placeholder="Enter Nafflings amount"
        value={nafflings.toString()}
        onChange={(e) => setNafflings(parseInt(e.target.value) || 0)}
        min="1"
        endContent={<span className="text-sm text-gray-500">NAFFLINGS</span>}
      />

      <div className="text-sm text-gray-600">
        Available balance: {(userBalance.nafflings || 0).toLocaleString()} NAFFLINGS
      </div>
    </div>
  );

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
          Configure Your Prize
        </h3>
        <p className="text-sm" style={{ color: colors.gray[600] }}>
          Set up the prize for your {data.lotteryType?.toLowerCase()} raffle
        </p>
      </div>

      <Card>
        <CardBody className="p-6">
          {data.lotteryType === 'TOKEN' && renderTokenConfiguration()}
          {data.lotteryType === 'NFT' && renderNFTConfiguration()}
          {data.lotteryType === 'NAFFLINGS' && renderNafflingsConfiguration()}
        </CardBody>
      </Card>

      {/* Validation Messages */}
      {validationError && (
        <Alert
          color="danger"
          variant="flat"
          startContent={<ExclamationTriangleIcon className="w-5 h-5" />}
        >
          {validationError}
        </Alert>
      )}

      {validationSuccess && (
        <Alert
          color="success"
          variant="flat"
          startContent={<CheckCircleIcon className="w-5 h-5" />}
        >
          {validationSuccess}
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
          Continue to Settings
        </Button>
      </div>
    </div>
  );
};

export default PrizeConfiguration;