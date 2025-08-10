import { NextRequest, NextResponse } from 'next/server';

// GET /api/communities/[id]/social-tasks - Get community social tasks
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    
    // TODO: Get user from session/auth
    const userId = 'current_user_id';
    
    const queryParams = new URLSearchParams({
      ...(status && { status }),
      ...(type && { type })
    });
    
    // TODO: Replace with actual API call to backend
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/communities/${id}/social-tasks?${queryParams}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add auth headers
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch social tasks');
    }

    const tasks = await response.json();

    return NextResponse.json({
      success: true,
      data: tasks
    });
  } catch (error) {
    console.error('Error fetching social tasks:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch social tasks',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST /api/communities/[id]/social-tasks - Create social task
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    // TODO: Get user from session/auth and verify permissions
    const userId = 'current_user_id';
    
    // Validate required fields
    if (!body.title || !body.type || !body.targetUrl || !body.pointsReward) {
      return NextResponse.json(
        {
          success: false,
          message: 'Title, type, target URL, and points reward are required'
        },
        { status: 400 }
      );
    }
    
    // TODO: Replace with actual API call to backend
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/communities/${id}/social-tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add auth headers
      },
      body: JSON.stringify({
        ...body,
        communityId: id,
        creatorId: userId
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create social task');
    }

    const task = await response.json();

    return NextResponse.json({
      success: true,
      message: 'Social task created successfully',
      data: task
    });
  } catch (error) {
    console.error('Error creating social task:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create social task',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}