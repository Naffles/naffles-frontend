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
    // Return all balances
    return NextResponse.json(mockBalances);
  } catch (error) {
    console.error('Error fetching user balances:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch balances' },
      { status: 500 }
    );
  }
}