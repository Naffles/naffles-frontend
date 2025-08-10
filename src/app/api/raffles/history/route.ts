import { NextRequest, NextResponse } from 'next/server';

// Mock history data for development/testing
const mockHistory = [
  {
    _id: 'history-1',
    eventId: 'RAFFLE-001',
    type: 'participation',
    raffle: {
      _id: 'raffle-1',
      eventId: 'RAFFLE-001',
      rafflePrize: {
        tokenPrize: {
          token: 'eth',
          amount: '1.5'
        }
      },
      lotteryTypeEnum: 'TOKEN',
      raffleTypeEnum: 'RESERVE',
      perTicketPrice: 10,
      coinType: 'usdc',
      status: {
        isActive: false,
        wonBy: 'user-2'
      },
      createdBy: {
        _id: 'user-1',
        username: 'CryptoTrader'
      },
      raffleEndDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    },
    ticketsPurchased: 5,
    totalSpent: 50,
    createdAt: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'history-2',
    eventId: 'RAFFLE-002',
    type: 'win',
    raffle: {
      _id: 'raffle-2',
      eventId: 'RAFFLE-002',
      rafflePrize: {
        nftPrize: {
          name: 'Bored Ape #1234',
          image: 'https://via.placeholder.com/300x300?text=NFT'
        }
      },
      lotteryTypeEnum: 'NFT',
      raffleTypeEnum: 'UNLIMITED',
      perTicketPrice: 0.1,
      coinType: 'eth',
      status: {
        isActive: false,
        wonBy: 'current-user'
      },
      createdBy: {
        _id: 'user-2',
        username: 'NFTCollector'
      },
      raffleEndDate: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
    },
    ticketsPurchased: 3,
    totalSpent: 0.3,
    createdAt: new Date(Date.now() - 50 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'history-3',
    eventId: 'RAFFLE-003',
    type: 'creation',
    raffle: {
      _id: 'raffle-3',
      eventId: 'RAFFLE-003',
      rafflePrize: {
        nafflings: 50000
      },
      lotteryTypeEnum: 'NAFFLINGS',
      raffleTypeEnum: 'UNCONDITIONAL',
      perTicketPrice: 100,
      coinType: 'nafflings',
      status: {
        isActive: true
      },
      createdBy: {
        _id: 'current-user',
        username: 'CurrentUser'
      },
      raffleEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString()
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const userId = searchParams.get('userId');

    // Filter by type
    let filteredHistory = [...mockHistory];
    if (type && type !== 'all') {
      filteredHistory = filteredHistory.filter(item => item.type === type);
    }

    // Filter by user (in a real implementation, this would be based on authentication)
    if (userId) {
      filteredHistory = filteredHistory.filter(item => 
        item.raffle.createdBy._id === userId || 
        item.raffle.status.wonBy === userId ||
        item.type === 'participation' // Assume current user participated
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedHistory = filteredHistory.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredHistory.length / limit);

    return NextResponse.json({
      success: true,
      history: paginatedHistory,
      totalPages,
      currentPage: page,
      total: filteredHistory.length
    });
  } catch (error) {
    console.error('Error fetching raffle history:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch raffle history' },
      { status: 500 }
    );
  }
}