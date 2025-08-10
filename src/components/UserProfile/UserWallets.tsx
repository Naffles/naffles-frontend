'use client';

import React, { useState } from 'react';
import { 
  Card, 
  CardBody, 
  CardHeader, 
  Button,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Divider
} from '@nextui-org/react';
import { 
  WalletIcon, 
  StarIcon,
  ClipboardDocumentIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { UserProfile, useUserProfile } from '@/hooks/useUserProfile';
import { toast } from 'react-hot-toast';

interface UserWalletsProps {
  profile: UserProfile;
  onRefresh: () => void;
}

export function UserWallets({ profile, onRefresh }: UserWalletsProps) {
  const { setPrimaryWallet } = useUserProfile();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getWalletTypeColor = (walletType: string) => {
    switch (walletType.toLowerCase()) {
      case 'metamask': return 'warning';
      case 'phantom': return 'secondary';
      case 'coinbase': return 'primary';
      case 'walletconnect': return 'success';
      default: return 'default';
    }
  };

  const getChainName = (chainId: string) => {
    switch (chainId) {
      case '1': return 'Ethereum';
      case '137': return 'Polygon';
      case '8453': return 'Base';
      case 'solana': return 'Solana';
      default: return `Chain ${chainId}`;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Address copied to clipboard');
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleSetPrimary = async (walletAddress: string) => {
    try {
      setLoading(true);
      await setPrimaryWallet(walletAddress);
      toast.success('Primary wallet updated');
      onRefresh();
    } catch (error) {
      console.error('Error setting primary wallet:', error);
      toast.error('Failed to set primary wallet');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTotalBalance = () => {
    if (!profile.walletBalance?.balances) return 0;
    
    let total = 0;
    for (const [token, balance] of profile.walletBalance.balances) {
      // This would need actual price conversion logic
      total += parseFloat(balance) || 0;
    }
    return total;
  };

  return (
    <div className="space-y-6 mt-6">
      {/* Wallet Summary */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <WalletIcon className="w-5 h-5" />
              <h3 className="text-lg font-semibold">Connected Wallets</h3>
              <Chip color="primary" variant="flat" size="sm">
                {profile.wallets?.length || 0}
              </Chip>
            </div>
            <Button 
              color="primary" 
              variant="flat" 
              size="sm"
              startContent={<PlusIcon className="w-4 h-4" />}
              onPress={onOpen}
            >
              Connect Wallet
            </Button>
          </div>
        </CardHeader>
        <CardBody className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {profile.wallets?.length || 0}
              </div>
              <div className="text-sm text-default-500">Connected Wallets</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-success mb-1">
                ${getTotalBalance().toFixed(2)}
              </div>
              <div className="text-sm text-default-500">Total Balance</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-warning mb-1">
                {new Set(profile.wallets?.map(w => w.chainId)).size || 0}
              </div>
              <div className="text-sm text-default-500">Networks</div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Wallets List */}
      <div className="space-y-4">
        {profile.wallets && profile.wallets.length > 0 ? (
          profile.wallets.map((wallet) => (
            <Card key={wallet.id} className={wallet.isPrimary ? 'border-primary border-2' : ''}>
              <CardBody className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg bg-${getWalletTypeColor(wallet.walletType)}/10`}>
                      <WalletIcon className={`w-6 h-6 text-${getWalletTypeColor(wallet.walletType)}`} />
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold capitalize">{wallet.walletType}</h4>
                        {wallet.isPrimary && (
                          <Chip 
                            color="primary" 
                            variant="flat" 
                            size="sm"
                            startContent={<StarIcon className="w-3 h-3" />}
                          >
                            Primary
                          </Chip>
                        )}
                        <Chip 
                          color={getWalletTypeColor(wallet.walletType) as any}
                          variant="flat" 
                          size="sm"
                        >
                          {getChainName(wallet.chainId)}
                        </Chip>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <code className="text-sm bg-default-100 px-2 py-1 rounded">
                          {formatAddress(wallet.address)}
                        </code>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="flat"
                          onClick={() => copyToClipboard(wallet.address)}
                        >
                          <ClipboardDocumentIcon className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <p className="text-sm text-default-500 mt-1">
                        Connected: {formatDate(wallet.connectedAt)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {!wallet.isPrimary && (
                      <Button
                        color="primary"
                        variant="flat"
                        size="sm"
                        onClick={() => handleSetPrimary(wallet.address)}
                        isLoading={loading}
                      >
                        Set Primary
                      </Button>
                    )}
                    <Button
                      color="danger"
                      variant="flat"
                      size="sm"
                    >
                      Disconnect
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))
        ) : (
          <Card>
            <CardBody className="text-center py-12">
              <WalletIcon className="w-16 h-16 text-default-300 mx-auto mb-4" />
              <h4 className="text-lg font-semibold mb-2">No Wallets Connected</h4>
              <p className="text-default-500 mb-4">
                Connect your first wallet to start using the platform
              </p>
              <Button color="primary" onPress={onOpen}>
                Connect Wallet
              </Button>
            </CardBody>
          </Card>
        )}
      </div>

      {/* Wallet Balances */}
      {profile.walletBalance && (
        <Card>
          <CardHeader className="pb-3">
            <h3 className="text-lg font-semibold">Wallet Balances</h3>
          </CardHeader>
          <CardBody className="pt-0">
            <div className="space-y-3">
              {Array.from(profile.walletBalance.balances.entries()).map(([token, balance]) => (
                <div key={token} className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-default-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold uppercase">{token.slice(0, 3)}</span>
                    </div>
                    <span className="font-medium capitalize">{token}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{parseFloat(balance).toFixed(6)}</p>
                    <p className="text-sm text-default-500">≈ $0.00</p>
                  </div>
                </div>
              ))}
            </div>
            
            {profile.walletBalance.balances.size === 0 && (
              <div className="text-center py-8 text-default-500">
                No balances available
              </div>
            )}
          </CardBody>
        </Card>
      )}

      {/* Connect Wallet Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Connect New Wallet</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <p className="text-default-600">
                Choose a wallet to connect to your account:
              </p>
              
              <div className="space-y-2">
                <Button
                  className="w-full justify-start"
                  variant="flat"
                  startContent={<WalletIcon className="w-5 h-5" />}
                >
                  MetaMask
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="flat"
                  startContent={<WalletIcon className="w-5 h-5" />}
                >
                  Phantom
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="flat"
                  startContent={<WalletIcon className="w-5 h-5" />}
                >
                  Coinbase Wallet
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="flat"
                  startContent={<WalletIcon className="w-5 h-5" />}
                >
                  WalletConnect
                </Button>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="flat" onPress={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}