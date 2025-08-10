import { NextRequest, NextResponse } from 'next/server';

// Mock user balance data for development/testing
const mockBalances = {
  eth: 2.5,
  sol: 150.0,
  matic: 1000.0,
  usdc: 5000.0,
  usdt: 3000.0,
  nafflings: 25000
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    
    if (token) {
      // Return balance for specific token
      const balance = mockBalances[token as keyof typeof mockBalances] || 0;
      return NextResponse.json({
        success: true,
        balance,
        token
      });
    }
    
    // Return all balances
    return NextResponse.json({
      success: true,
      balances: mockBalances
    });
  } catch (error) {
    console.error('Error fetching user balance:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch balance' },
      { status: 500 }
    );
  }
}