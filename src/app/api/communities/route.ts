import { NextRequest, NextResponse } from 'next/server';

// GET /api/communities - Get user's communities
export async function GET(request: NextRequest) {
  try {
    // TODO: Get user from session/auth
    const userId = 'current_user_id';
    
    // TODO: Replace with actual API call to backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/communities/user/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add auth headers
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch communities');
    }

    const communities = await response.json();

    return NextResponse.json({
      success: true,
      data: communities
    });
  } catch (error) {
    console.error('Error fetching communities:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch communities',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST /api/communities - Create new community
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // TODO: Get user from session/auth
    const userId = 'current_user_id';
    
    // Validate required fields
    if (!body.name || !body.pointsConfiguration?.pointsName) {
      return NextResponse.json(
        {
          success: false,
          message: 'Community name and points name are required'
        },
        { status: 400 }
      );
    }

    // TODO: Replace with actual API call to backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/communities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add auth headers
      },
      body: JSON.stringify({
        ...body,
        creatorId: userId
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create community');
    }

    const community = await response.json();

    return NextResponse.json({
      success: true,
      message: 'Community created successfully',
      data: community
    });
  } catch (error) {
    console.error('Error creating community:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create community',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}