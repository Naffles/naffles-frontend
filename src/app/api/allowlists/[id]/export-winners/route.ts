import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

/**
 * Winner Export API Route
 * 
 * Handles exporting winner data in various formats (CSV, JSON).
 */

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json';

    const response = await fetch(`${BACKEND_URL}/api/allowlists/${id}/export-winners?format=${format}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Forward authentication headers
        ...(request.headers.get('authorization') && {
          'authorization': request.headers.get('authorization')!
        }),
        ...(request.headers.get('cookie') && {
          'cookie': request.headers.get('cookie')!
        })
      }
    });

    if (format === 'csv') {
      const csvData = await response.text();
      return new NextResponse(csvData, {
        status: response.status,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="allowlist-${id}-winners.csv"`
        }
      });
    } else {
      const data = await response.json();
      return NextResponse.json(data, { 
        status: response.status,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  } catch (error) {
    console.error('Error in winner export:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}