import { NextRequest, NextResponse } from 'next/server';

// Mock data for development/testing
const mockRaffles = [
  {
    _id: '1',
    eventId: 'RAFFLE-001',
    rafflePrize: {
      _id: 'prize-1',
      tokenPrize: {
        token: 'eth',
        amount: '1.5'
      }
    },
    lotteryTypeEnum: 'TOKEN',
    raffleTypeEnum: 'RESERVE',
    coinType: 'usdc',
    perTicketPrice: 10,
    ticketsAvailable: 100,
    ticketsSold: 45,
    raffleEndDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    createdBy: {
      _id: 'user-1',
      username: 'CryptoTrader'
    },
    status: {
      isActive: true
    }
  },
  {
    _id: '2',
    eventId: 'RAFFLE-002',
    rafflePrize: {
      _id: 'prize-2',
      nftPrize: {
        name: 'Bored Ape #1234',
        image: 'https://via.placeholder.com/300x300?text=NFT',
        contractAddress: '0x1234567890abcdef'
      }
    },
    lotteryTypeEnum: 'NFT',
    raffleTypeEnum: 'UNLIMITED',
    coinType: 'eth',
    perTicketPrice: 0.1,
    ticketsAvailable: 0,
    ticketsSold: 234,
    raffleEndDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: {
      _id: 'user-2',
      username: 'NFTCollector'
    },
    status: {
      isActive: true
    }
  },
  {
    _id: '3',
    eventId: 'RAFFLE-003',
    rafflePrize: {
      _id: 'prize-3',
      nafflings: 50000
    },
    lotteryTypeEnum: 'NAFFLINGS',
    raffleTypeEnum: 'UNCONDITIONAL',
    coinType: 'nafflings',
    perTicketPrice: 100,
    ticketsAvailable: 0,
    ticketsSold: 89,
    raffleEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdBy: {
      _id: 'user-3',
      username: 'PointsGamer'
    },
    status: {
      isActive: true
    }
  }
];

export async function GET(request: NextRequest) {
  try {
    // In a real implementation, this would fetch from the backend API
    // For now, return mock data
    return NextResponse.json({
      success: true,
      raffles: mockRaffles,
      total: mockRaffles.length
    });
  } catch (error) {
    console.error('Error fetching raffles:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch raffles' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // In a real implementation, this would create a raffle via the backend API
    // For now, just return a success response
    console.log('Creating raffle with data:', body);
    
    const newRaffle = {
      _id: `raffle-${Date.now()}`,
      eventId: `RAFFLE-${String(Date.now()).slice(-6)}`,
      ...body,
      ticketsSold: 0,
      raffleEndDate: new Date(Date.now() + body.duration * 24 * 60 * 60 * 1000).toISOString(),
      createdBy: {
        _id: 'current-user',
        username: 'CurrentUser'
      },
      status: {
        isActive: true
      }
    };
    
    return NextResponse.json({
      success: true,
      raffle: newRaffle,
      message: 'Raffle created successfully'
    });
  } catch (error) {
    console.error('Error creating raffle:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create raffle' },
      { status: 500 }
    );
  }
}