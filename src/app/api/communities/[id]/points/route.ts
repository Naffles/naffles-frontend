import { NextRequest, NextResponse } from 'next/server';

// GET /api/communities/[id]/points - Get community points data
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'stats', 'balances', 'transactions'
    
    // TODO: Get user from session/auth and verify permissions
    const userId = 'current_user_id';
    
    const queryParams = new URLSearchParams({
      ...(type && { type })
    });
    
    // TODO: Replace with actual API call to backend
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/communities/${id}/points?${queryParams}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add auth headers
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch points data');
    }

    const pointsData = await response.json();

    return NextResponse.json({
      success: true,
      data: pointsData
    });
  } catch (error) {
    console.error('Error fetching points data:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch points data',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST /api/communities/[id]/points - Credit/Debit points
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    // TODO: Get user from session/auth and verify permissions
    const userId = 'current_user_id';
    
    const { action, targetUserId, amount, description } = body;
    
    // Validate required fields
    if (!action || !targetUserId || !amount || !description) {
      return NextResponse.json(
        {
          success: false,
          message: 'Action, target user, amount, and description are required'
        },
        { status: 400 }
      );
    }
    
    if (!['credit', 'debit'].includes(action)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Action must be either "credit" or "debit"'
        },
        { status: 400 }
      );
    }
    
    // TODO: Replace with actual API call to backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/communities/${id}/points`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add auth headers
      },
      body: JSON.stringify({
        action,
        targetUserId,
        amount,
        description,
        adminId: userId,
        communityId: id
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to ${action} points`);
    }

    const transaction = await response.json();

    return NextResponse.json({
      success: true,
      message: `Points ${action}ed successfully`,
      data: transaction
    });
  } catch (error) {
    console.error('Error processing points transaction:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to process points transaction',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// PUT /api/communities/[id]/points - Update activity configuration
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    // TODO: Get user from session/auth and verify permissions
    const userId = 'current_user_id';
    
    const { activityPointsMap } = body;
    
    if (!activityPointsMap || typeof activityPointsMap !== 'object') {
      return NextResponse.json(
        {
          success: false,
          message: 'Activity points map is required'
        },
        { status: 400 }
      );
    }
    
    // TODO: Replace with actual API call to backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/communities/${id}/points/config`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // Add auth headers
      },
      body: JSON.stringify({
        activityPointsMap,
        updatedBy: userId
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update activity configuration');
    }

    const config = await response.json();

    return NextResponse.json({
      success: true,
      message: 'Activity configuration updated successfully',
      data: config
    });
  } catch (error) {
    console.error('Error updating activity configuration:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update activity configuration',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}