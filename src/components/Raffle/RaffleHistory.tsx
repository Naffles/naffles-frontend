'use client';

import React, { useState, useEffect } from 'react';
import {
    Card,
    CardBody,
    Tabs,
    Tab,
    Button,
    Chip,
    Avatar,
    Spinner,
    Pagination
} from '@nextui-org/react';
import { colors, typography } from '@/styles/design-system/tokens';
import {
    TicketIcon,
    TrophyIcon,
    ClockIcon,
    EyeIcon,
    CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';

interface RaffleHistoryProps {
    userId?: string;
    className?: string;
}

interface HistoryItem {
    _id: string;
    eventId: string;
    type: 'participation' | 'creation' | 'win';
    raffle: {
        _id: string;
        eventId: string;
        rafflePrize: any;
        lotteryTypeEnum: string;
        raffleTypeEnum: string;
        perTicketPrice: number;
        coinType: string;
        status: {
            isActive: boolean;
            wonBy?: string;
        };
        createdBy: {
            _id: string;
            username: string;
        };
        raffleEndDate: string;
    };
    ticketsPurchased?: number;
    totalSpent?: number;
    prizeWon?: any;
    createdAt: string;
}

const RaffleHistory: React.FC<RaffleHistoryProps> = ({ userId, className = '' }) => {
    const [activeTab, setActiveTab] = useState('all');
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchHistory();
    }, [activeTab, currentPage, userId]);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                type: activeTab === 'all' ? '' : activeTab,
                page: currentPage.toString(),
                limit: '10'
            });

            if (userId) {
                params.append('userId', userId);
            }

            const response = await fetch(`/api/raffles/history?${params}`);
            if (response.ok) {
                const data = await response.json();
                setHistory(data.history || []);
                setTotalPages(data.totalPages || 1);
            }
        } catch (error) {
            console.error('Error fetching raffle history:', error);
        } finally {
            setLoading(false);
        }
    };

    const getPrizeDisplay = (rafflePrize: any, lotteryType: string) => {
        if (lotteryType === 'TOKEN' && rafflePrize.tokenPrize) {
            return `${rafflePrize.tokenPrize.amount} ${rafflePrize.tokenPrize.token.toUpperCase()}`;
        } else if (lotteryType === 'NFT' && rafflePrize.nftPrize) {
            return rafflePrize.nftPrize.name;
        } else if (lotteryType === 'NAFFLINGS' && rafflePrize.nafflings) {
            return `${rafflePrize.nafflings.toLocaleString()} Nafflings`;
        }
        return 'Unknown Prize';
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'participation':
                return <TicketIcon className="w-5 h-5" />;
            case 'creation':
                return <CurrencyDollarIcon className="w-5 h-5" />;
            case 'win':
                return <TrophyIcon className="w-5 h-5" />;
            default:
                return <ClockIcon className="w-5 h-5" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'participation':
                return 'primary';
            case 'creation':
                return 'secondary';
            case 'win':
                return 'success';
            default:
                return 'default';
        }
    };

    const getStatusChip = (raffle: any) => {
        if (!raffle.status.isActive && raffle.status.wonBy) {
            return (
                <Chip size="sm" color="success" variant="flat">
                    Completed
                </Chip>
            );
        } else if (!raffle.status.isActive) {
            return (
                <Chip size="sm" color="danger" variant="flat">
                    Cancelled
                </Chip>
            );
        } else {
            return (
                <Chip size="sm" color="primary" variant="flat">
                    Active
                </Chip>
            );
        }
    };

    const renderHistoryItem = (item: HistoryItem) => (
        <Card key={item._id} className="mb-4">
            <CardBody className="p-4">
                <div className="flex items-start gap-4">
                    {/* Type Icon */}
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.type === 'win' ? 'bg-success-100 text-success-600' :
                        item.type === 'creation' ? 'bg-secondary-100 text-secondary-600' :
                            'bg-primary-100 text-primary-600'
                        }`}>
                        {getTypeIcon(item.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                            <div>
                                <h4 className="font-semibold" style={{ color: colors.gray[900] }}>
                                    {item.type === 'participation' && 'Entered Raffle'}
                                    {item.type === 'creation' && 'Created Raffle'}
                                    {item.type === 'win' && 'Won Raffle'}
                                </h4>
                                <p className="text-sm" style={{ color: colors.gray[600] }}>
                                    {getPrizeDisplay(item.raffle.rafflePrize, item.raffle.lotteryTypeEnum)}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                {getStatusChip(item.raffle)}
                                <Button
                                    size="sm"
                                    variant="light"
                                    startContent={<EyeIcon className="w-4 h-4" />}
                                    onPress={() => {
                                        // Navigate to raffle details
                                        window.open(`/raffles/${item.raffle.eventId}`, '_blank');
                                    }}
                                >
                                    View
                                </Button>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                                <span className="text-gray-500">Raffle ID:</span>
                                <div className="font-medium">{item.raffle.eventId}</div>
                            </div>

                            {item.type === 'participation' && (
                                <>
                                    <div>
                                        <span className="text-gray-500">Tickets:</span>
                                        <div className="font-medium">{item.ticketsPurchased}</div>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Spent:</span>
                                        <div className="font-medium">
                                            {item.totalSpent} {item.raffle.coinType.toUpperCase()}
                                        </div>
                                    </div>
                                </>
                            )}

                            {item.type === 'creation' && (
                                <div>
                                    <span className="text-gray-500">Creator:</span>
                                    <div className="font-medium flex items-center gap-1">
                                        <Avatar size="sm" name={item.raffle.createdBy.username} className="w-4 h-4" />
                                        {item.raffle.createdBy.username}
                                    </div>
                                </div>
                            )}

                            {item.type === 'win' && (
                                <div>
                                    <span className="text-gray-500">Prize Won:</span>
                                    <div className="font-medium text-success-600">
                                        {getPrizeDisplay(item.raffle.rafflePrize, item.raffle.lotteryTypeEnum)}
                                    </div>
                                </div>
                            )}

                            <div>
                                <span className="text-gray-500">Date:</span>
                                <div className="font-medium">
                                    {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                                </div>
                            </div>
                        </div>

                        {/* Type and Format Chips */}
                        <div className="flex gap-2 mt-3">
                            <Chip size="sm" variant="flat" color={getTypeColor(item.raffle.lotteryTypeEnum.toLowerCase())}>
                                {item.raffle.lotteryTypeEnum}
                            </Chip>
                            <Chip size="sm" variant="flat">
                                {item.raffle.raffleTypeEnum}
                            </Chip>
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    );

    return (
        <div className={`w-full ${className}`}>
            <div className="mb-6">
                <h2
                    className="text-2xl font-bold mb-2"
                    style={{
                        color: colors.gray[900],
                        fontFamily: typography.fontFamily.display.join(', ')
                    }}
                >
                    Raffle History
                </h2>
                <p className="text-sm" style={{ color: colors.gray[600] }}>
                    Track your raffle participation, creations, and wins
                </p>
            </div>

            {/* Tabs */}
            <Tabs
                selectedKey={activeTab}
                onSelectionChange={(key) => {
                    setActiveTab(key as string);
                    setCurrentPage(1);
                }}
                className="mb-6"
            >
                <Tab key="all" title="All Activity" />
                <Tab key="participation" title="Participated" />
                <Tab key="creation" title="Created" />
                <Tab key="win" title="Won" />
            </Tabs>

            {/* Content */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <Spinner size="lg" color="primary" />
                </div>
            ) : history.length === 0 ? (
                <Card>
                    <CardBody className="p-12 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                            <ClockIcon className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2" style={{ color: colors.gray[900] }}>
                            No History Found
                        </h3>
                        <p className="text-gray-600">
                            {activeTab === 'all'
                                ? "You haven't participated in any raffles yet."
                                : `No ${activeTab} history found.`
                            }
                        </p>
                    </CardBody>
                </Card>
            ) : (
                <>
                    {/* History Items */}
                    <div className="space-y-4">
                        {history.map(renderHistoryItem)}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-8">
                            <Pagination
                                total={totalPages}
                                page={currentPage}
                                onChange={setCurrentPage}
                                showControls
                                showShadow
                                color="primary"
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default RaffleHistory;